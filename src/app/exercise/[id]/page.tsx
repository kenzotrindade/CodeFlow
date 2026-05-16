import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { completeExercise } from "@/app/actions/exercise";

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

  const completeExercice = completeExercise.bind(null, id)

  return (
    <div className="p-4 flex flex-col">
      <Link href="/dashboard">Dashboard</Link>
      <h1>{exercise.title}</h1>
      <p>
        {exercise.language.name} - {exercise.difficulty}
      </p>

      <p>{exercise.statement}</p>

      <form action={completeExercice}>
        <button type="submit">I have finished</button>
      </form>
    </div>
  );
}
