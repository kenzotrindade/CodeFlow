"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { Language, Difficulty } from "@prisma/client";
import prompts from "@/lib/prompts/prompts.json";

console.log(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function GeneratePrompt({
  language,
  difficulty,
}: {
  language: Language;
  difficulty: Difficulty;
}) {
  const template = prompts.exercise_generation.standard.prompt;
  const finalPrompt = template
    .replace("{{language}}", language.name)
    .replace("{{difficulty}}", difficulty);

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(finalPrompt);
  const response = result.response.text();
  const data = JSON.parse(response);

  const newExercise = await prisma.exercise.create({
    data: {
      title: data.title,
      statement: data.statement,
      expectedOutput: data.expectedOutput,
      difficulty: difficulty,
      languageId: language.id,
    },
  });

  return newExercise;
}
