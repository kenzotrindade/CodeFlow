"use server";

import OpenAI from "openai";
import prisma from "@/lib/prisma";
import { Language, Difficulty } from "@prisma/client";
import { prompts } from "@/lib/prompts/prompts";
import { auth } from "@/lib/auth";
import { promptForm, LevelGuideLine } from "@/lib/types";

// #################################
// ### Exercise Generation
// #################################

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY as string,
});

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

  const exercises = await prisma.exercise.findMany({
    where: { creatorId: session?.user?.id, languageId: language.id },
    include: {
      attempts: {
        where: { userId: session?.user?.id },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  }); // Récupération des exercises fait ET non fait

  const history = exercises
    .map((e) => {
      const status = e.attempts[0]?.status || "Not try";
      return `- ${e.title} (${e.difficulty}, Statut: ${status})`;
    })
    .join("\n"); // Join pour faire un saut de ligne à toutes les lignes car si c'est dans le return ce sera tout sauf la dernière

  const historyText =
    history.length > 0
      ? history
      : "L'utilisateur n'a pas d'historique dans ce langage et cette difficulté."; // Récupération de l'historique de l'utilisateur uniquement

  const levelGuidelines = prompts.exercise_generation
    .level_guidelines as LevelGuideLine;
  const langKey = language.name.toLowerCase();
  const langRules = levelGuidelines[langKey] || levelGuidelines.general;
  const specificRule = langRules[difficulty] || langRules["EASY"];

  const isCapstone = promptArgs === promptForm.capstone;
  const template = isCapstone
    ? prompts.exercise_generation.capstone_template
    : prompts.exercise_generation.progressive_template;

  if (!template) {
    throw new Error(
      `Template non trouvé pour le mode: ${isCapstone ? "Capstone" : "Progressive"}`,
    );
  }

  const finalPrompt = template
    .replaceAll(
      "{{system_persona}}",
      prompts.exercise_generation.system_persona,
    )
    .replaceAll("{{language}}", language.name)
    .replaceAll("{{difficulty}}", difficulty)
    .replaceAll("{{level_rules}}", specificRule)
    .replaceAll("{{last_exercises}}", historyText);

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      return;
    }

    const data = JSON.parse(completion.choices[0].message.content);
    const luminaHeader = data.lumina_message
      ? `### MESSAGE DE LUMINA\n${data.lumina_message}\n\n---\n\n`
      : "";

    const formattedExpectedOutput =
      typeof data.expectedOutput === "object"
        ? JSON.stringify(data.expectedOutput, null, 2)
        : data.expectedOutput;

    const newExercise = await prisma.exercise.create({
      data: {
        title: data.title,
        statement: `${luminaHeader}${data.statement}`,
        expectedOutput: formattedExpectedOutput,
        notion: data.notion || (isCapstone ? "Projet de synthèse" : null),
        isCapstone: data.isCapstone || isCapstone || false,
        difficulty: difficulty,
        languageId: language.id,
        creatorId: session?.user?.id || null,
        attempts: {
          create: session?.user?.id
            ? [
                {
                  userId: session.user.id,
                  status: "PENDING",
                },
              ]
            : [],
        },
      },
    });

    return newExercise;
  } catch (error: unknown) {
    console.error("Error generating exercise:", error);
    throw new Error("Failed to generate exercise", { cause: error });
  }
}
