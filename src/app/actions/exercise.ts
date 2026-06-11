"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prompts } from "@/lib/prompts/prompts";
import { client } from "@/lib/openai";
import { fillTemplate } from "@/lib/utils";

// #################################
// ### Exercise actions
// #################################

export async function completeExercise(exerciseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non connecté");

  await prisma.exerciseAttempt.updateMany({
    where: {
      userId: session.user.id,
      exerciseId,
      status: AttemptStatus.PENDING,
    },
    data: { status: AttemptStatus.PASSED },
  });

  revalidatePath("/dashboard");
  revalidatePath("/exercises");
  redirect("/dashboard");
}

export async function validateCode(exerciseId: string, submittedCode: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non connecté" };

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { language: true },
  });

  if (!exercise) return { error: "Défi introuvable" };

  const finalPrompt = fillTemplate(prompts.exercise_validation.template, {
    title: exercise.title,
    statement: exercise.statement,
    expectedOutput: exercise.expectedOutput,
    language: exercise.language.name,
    submitted_code: submittedCode,
  });

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: finalPrompt }],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) return { error: "L'IA n'a pas répondu" };

    const result = JSON.parse(content);
    let score = Math.min(
      Number(result.score) * (Number(result.score) <= 10 ? 10 : 1),
      100,
    );

    await prisma.exerciseAttempt.updateMany({
      where: {
        userId: session.user.id,
        exerciseId,
        status: AttemptStatus.PENDING,
      },
      data: { submittedCode },
    });

    return {
      passed: result.passed,
      feedback: result.feedback,
      score,
      learningPath: result.learning_path || [],
    };
  } catch (error) {
    return { error: "Erreur de validation" };
  }
}
