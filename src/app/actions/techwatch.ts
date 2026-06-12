"use server";

import prisma from "@/lib/prisma";
import { prompts } from "@/lib/prompts/prompts";
import { auth } from "@/lib/auth";
import { client } from "@/lib/openai";
import { fillTemplate, parseAIResponse } from "@/lib/utils";
import { AIGenerationResponse } from "@/lib/types";

// #################################
// ### Techwatch Action
// #################################

export async function TechwatchPrompt({
  title,
  description,
  languageId,
  languageName,
}: {
  title: string;
  description: string;
  languageId: string;
  languageName: string;
}) {
  const session = await auth();

  const finalPrompt = fillTemplate(prompts.techwatch_generation.template, {
    article_title: title,
    article_description: description,
    language: languageName,
  });

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: finalPrompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) return null;

    const data = parseAIResponse<AIGenerationResponse>(content);
    if (!data) return null;

    const luminaHeader = data.lumina_message ? `### MESSAGE DU MENTOR\n${data.lumina_message}\n\n---\n\n` : "";

    return await prisma.exercise.create({
      data: {
        title: data.title,
        statement: `${luminaHeader}${data.statement}`,
        expectedOutput: typeof data.expectedOutput === "object" ? JSON.stringify(data.expectedOutput, null, 2) : data.expectedOutput,
        notion: data.notion || "Veille technologique",
        difficulty: "MEDIUM",
        languageId,
        creatorId: session?.user?.id || null,
        attempts: {
          create: session?.user?.id ? [{ userId: session.user.id, status: "PENDING" }] : [],
        },
      },
    });
  } catch (error) {
    console.error("Techwatch Generation Error:", error);
    return null;
  }
}
