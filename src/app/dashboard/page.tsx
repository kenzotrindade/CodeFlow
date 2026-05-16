import prisma from "@/lib/prisma";
import { Difficulty } from "@prisma/client";
import DashboardForms from "@/components/DashboardForms";
import { auth } from "@/lib/auth";

// #################################
// ### Dashboard Page
// #################################

export default async function Dashboard() {
  const session = await auth(); // Find session's token
  const languages = await prisma.language.findMany();
  const difficulties = Object.values(Difficulty);

  const attempts = await prisma.exerciseAttempt.findMany({
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

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {session && (
          <>
            <p className="mb-4">Welcome, {session.user?.name}</p>
            <DashboardForms languages={languages} difficulties={difficulties} />
            {attempts.map((attempt) => (
              <div key={attempt.id}>
                <p>{attempt.exercise.title}</p>
                <p>
                  {attempt.exercise.language.name} -
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
