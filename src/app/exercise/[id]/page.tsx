import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ExerciseClient from "./ExerciseClient";

// #################################
// ### Exercise Page
// #################################

export default async function ExercisePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { id: id },
    include: { language: true },
  });

  if (!exercise) {
    notFound();
  }

  return <ExerciseClient exercise={exercise} />;
}
