"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeExercise(exerciseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You are not connected");
  }

  await prisma.exerciseAttempt.create({
    data: {
      userId: session.user.id,
      exerciseId: exerciseId,
      status: AttemptStatus.PASSED,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
