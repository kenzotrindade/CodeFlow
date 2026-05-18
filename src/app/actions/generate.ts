"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { Language, Difficulty } from "@prisma/client";
import prompts from "@/lib/prompts/prompts.json";
import { auth } from "@/lib/auth";
import { promptForm } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function GeneratePrompt({
  language,
  difficulty,
  promptArgs = promptForm.standard,
}: {
  language: Language;
  difficulty: Difficulty;
  promptArgs?: promptForm;
}) {
  const session = await auth();

  let template;
  let finalPrompt;

  if (promptArgs == promptForm.progressive) {
    const exercises = await prisma.exercise.findMany({
      where: { creatorId: session?.user?.id, languageId: language.id },
      include: {
        attempts: {
          where: { userId: session?.user?.id },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const history = exercises
      .map((e) => {
        const status = e.attempts[0]?.status;
        return `- ${e.title} - ${e.attempts} (${e.difficulty}, Statut: ${status})`;
      })
      .join("\n");

    template = prompts.exercise_generation.progressive.prompt;
    finalPrompt = template
      .replaceAll("{{language}}", language.name)
      .replaceAll("{{difficulty}}", difficulty)
      .replaceAll("{{last_exercises}}", history);
  } else {
    template = prompts.exercise_generation.standard.prompt;
    finalPrompt = template
      .replaceAll("{{language}}", language.name)
      .replaceAll("{{difficulty}}", difficulty);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  try {
    const result = await model.generateContent(finalPrompt);
    const response = result.response.text();
    const clearResponse = response.replace(/```json\s?|```/g, "").trim();
    const data = JSON.parse(clearResponse);

    const newExercise = await prisma.exercise.create({
      data: {
        title: data.title,
        statement: data.statement,
        expectedOutput: data.expectedOutput,
        difficulty: difficulty,
        languageId: language.id,
        creatorId: session?.user?.id || null,
      },
    });

    return newExercise;
  } catch (error: any) {
    console.error("Error generating exercise:", error);
    throw new Error("Failed to generate exercise", { cause: error });
  }
}
