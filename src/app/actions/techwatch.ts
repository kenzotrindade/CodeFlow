"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { prompts } from "@/lib/prompts/prompts";
import { auth } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  try {
    const result = await model.generateContent(finalPrompt);
    const response = result.response.text();
    const clearResponse = response.replace(/```json\s?|```/g, "").trim();
    const exerciseData = JSON.parse(clearResponse);

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
  } catch (error: any) {
    console.error("Error failing generate techwatch exercise");
    throw new Error("Failed to generate techwatch's exercise", {
      cause: error,
    });
  }
}
