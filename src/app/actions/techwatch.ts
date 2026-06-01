"use server";

import OpenAI from "openai";
import prisma from "@/lib/prisma";
import { prompts } from "@/lib/prompts/prompts";
import { auth } from "@/lib/auth";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY as string,
});

export async function TechwatchPrompt(data: {
  title: string;
  description: string;
  languageId: string;
  languageName: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not connected");
  }

  const template = prompts.techwatch_generation.template;

  const finalPrompt = template
    .replaceAll(
      "{{system_persona}}",
      prompts.exercise_generation.system_persona,
    )
    .replaceAll("{{article_title}}", data.title)
    .replaceAll("{{article_description}}", data.description)
    .replaceAll("{{language}}", data.languageName);

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

    const exerciseData = JSON.parse(completion.choices[0].message.content!);

    const newExercise = await prisma.exercise.create({
      data: {
        title: exerciseData.title,
        statement: exerciseData.statement,
        expectedOutput: exerciseData.expectedOutput,
        notion: exerciseData.notion,
        difficulty: "MEDIUM",
        languageId: data.languageId,
        creatorId: session?.user?.id || null,
        attempts: {
          create: session?.user?.id ? [
            {
              userId: session.user.id,
              status: "PENDING",
            }
          ] : []
        }
      },
    });

    return newExercise;
  } catch (error: unknown) {
    console.error("Error failing generate techwatch exercise", error);
    throw new Error("Failed to generate techwatch's exercise", {
      cause: error,
    });
  }
}
