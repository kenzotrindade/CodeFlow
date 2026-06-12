"use server";

import prisma from "@/lib/prisma";
import { Language, Difficulty } from "@prisma/client";
import { prompts } from "@/lib/prompts/prompts";
import { auth } from "@/lib/auth";
import { promptForm, LevelGuideLine, AIGenerationResponse } from "@/lib/types";
import { client } from "@/lib/openai";
import { fillTemplate, parseAIResponse } from "@/lib/utils";

// #################################
// ### Exercise Generation
// #################################

export async function GeneratePrompt({
  language,
  difficulty,
  promptArgs = promptForm.progressive,
}: {
  language: Language;
  difficulty: Difficulty;
  promptArgs?: promptForm;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const exercises = await prisma.exercise.findMany({
    where: { creatorId: session?.user?.id, languageId: language.id },
    include: {
      attempts: {
        where: { userId: session?.user?.id },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const history = exercises
    .map(
      (e) =>
        `- ${e.title} (${e.difficulty}, Statut: ${e.attempts[0]?.status || "Non tenté"})`,
    )
    .join("\n");

  const levelGuidelines = prompts.exercise_generation
    .level_guidelines as LevelGuideLine;
  const langKey = language.name.toLowerCase();
  const langRules = levelGuidelines[langKey] || levelGuidelines.general;
  const specificRule = langRules[difficulty] || langRules["EASY"];

  const isCapstone = promptArgs === promptForm.capstone;
  const template = isCapstone
    ? prompts.exercise_generation.capstone_template
    : prompts.exercise_generation.progressive_template;

  const finalPrompt = fillTemplate(template, {
    system_persona: prompts.exercise_generation.system_persona,
    language: language.name,
    difficulty: difficulty,
    level_rules: specificRule,
    last_exercises: history || "Aucun historique disponible.",
  });

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: finalPrompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return null;
    }

    const data = parseAIResponse<AIGenerationResponse>(content);

    if (!data) {
      return null;
    }

    const luminaHeader = data.lumina_message
      ? `MESSAGE DE LUMINA : \n${data.lumina_message}\n\n---\n\n`
      : "";

    return await prisma.exercise.create({
      data: {
        title: data.title,
        statement: `${luminaHeader}${data.statement}`,
        expectedOutput:
          typeof data.expectedOutput === "object"
            ? JSON.stringify(data.expectedOutput, null, 2) // (value, replacement, indentation)
            : data.expectedOutput,
        notion:
          data.notion ||
          (isCapstone ? "Projet de synthèse" : "Concept technique"),
        isCapstone: data.isCapstone || isCapstone || false,
        difficulty: difficulty,
        languageId: language.id,
        creatorId: session?.user?.id || null,
        attempts: {
          create: session?.user?.id
            ? [{ userId: session.user.id, status: "PENDING" }]
            : [],
        },
      },
    });
  } catch (error) {
    console.error("Generation Error:", error);
    return null;
  }
}
