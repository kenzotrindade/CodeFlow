import prisma from "@/lib/prisma";
import { Difficulty } from "@prisma/client";
import DashboardForms from "@/components/DashboardForms";
import { auth } from "@/lib/auth";
import Link from "next/link";

// #################################
// ### Dashboard Page
// #################################

export default async function Dashboard() {
  const session = await auth(); // Find session's token
  const languages = await prisma.language.findMany();
  const difficulties = Object.values(Difficulty);

  const passedExercises = await prisma.exerciseAttempt.findMany({
    where: {
      userId: session?.user?.id,
      status: "PASSED",
    },
    include: {
      exercise: {
        include: { language: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const inProgressExercises = await prisma.exerciseAttempt.findMany({
    where: {
      userId: session?.user?.id,
      status: "PENDING",
    },

    include: {
      exercise: {
        include: { language: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {session && (
          <>
            <p className="mb-4">Welcome, {session.user?.name}</p>
            <DashboardForms languages={languages} difficulties={difficulties} />
            {passedExercises.map((p) => (
              <div key={p.id}>
                <p>{p.exercise.title}</p>
                <p>
                  {p.exercise.language.name} -
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {inProgressExercises.map((p) => (
              <div key={p.id}>
                <p>{p.exercise.title}</p>
                <p>
                  {p.exercise.language.name} -
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/exercise/${p.exercise.id}`}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Link
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
