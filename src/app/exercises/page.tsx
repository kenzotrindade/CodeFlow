import prisma from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ExerciseStats from "@/components/ExerciseStats";
import { ChevronLeft, BarChart2, BookOpen } from "lucide-react";

// #################################
// ### Exercises List & Stats Page
// #################################

export default async function ExercisesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const allAttempts = await prisma.exerciseAttempt.findMany({
    where: { userId: session.user.id },
    include: { exercise: { include: { language: true } } },
    orderBy: { createdAt: "desc" },
  });

  const passedAttempts = allAttempts.filter(
    (a) => a.status === AttemptStatus.PASSED,
  );

  const attemptsByLanguageMap = new Map<string, number>();
  allAttempts.forEach((a) => {
    const lang = a.exercise.language.name;
    attemptsByLanguageMap.set(lang, (attemptsByLanguageMap.get(lang) || 0) + 1);
  });

  const attemptsByLanguage = Array.from(attemptsByLanguageMap.entries()).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    })
    .reverse();

  const attemptsByDay = last7Days.map((day) => ({
    day: day.split("-").slice(1).join("/"),
    count: allAttempts.filter((a) => a.createdAt.toISOString().startsWith(day))
      .length,
  }));

  const successRate =
    allAttempts.length > 0
      ? Math.round((passedAttempts.length / allAttempts.length) * 100)
      : 0;

  return (
    <div className="container mx-auto px-6 max-w-7xl pt-6 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-pink-500 mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft className="w-3 h-3" /> Retour au Dashboard
          </Link>
          <h1 className="text-5xl font-black italic tracking-tighter mix-diff uppercase mb-2">
            ARCHIVES
          </h1>
          <div className="h-1 w-20 bg-pink-500 mb-4" />
          <p className="text-[10px] text-purple-200/40 font-mono tracking-widest uppercase flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-pink-500" />
            Analyse de progression cristalline
          </p>
        </div>

        <div className="bg-white/5 px-6 py-3 border border-white/10 backdrop-blur-md hidden md:block">
          <span className="text-[10px] font-mono text-purple-100/30 uppercase tracking-[0.2em]">
            Total Fragments :{" "}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">
            {passedAttempts.length}
          </span>
        </div>
      </div>

      <section className="mb-16">
        <ExerciseStats
          data={{
            attemptsByDay,
            attemptsByLanguage,
            successRate,
            totalCompleted: passedAttempts.length,
          }}
        />
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-300/40 whitespace-nowrap">
            Historique Complet
          </h3>
          <div className="h-px grow bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {allAttempts.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:border-pink-500/30 transition-all"
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div
                  className={`w-10 h-10 flex items-center justify-center border ${p.status === AttemptStatus.PASSED ? "border-pink-500/30 bg-pink-500/5" : "border-white/10"}`}
                >
                  <BookOpen
                    className={`w-4 h-4 ${p.status === AttemptStatus.PASSED ? "text-pink-500" : "text-white/20"}`}
                  />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight text-white group-hover:text-pink-400 transition-colors">
                    {p.exercise.title}
                  </h4>
                  <p className="text-[10px] text-purple-100/30 font-mono mt-1 uppercase">
                    {p.exercise.language.name} • {p.exercise.difficulty} •{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                    p.status === AttemptStatus.PASSED
                      ? "border-pink-500/50 text-pink-500"
                      : p.status === AttemptStatus.PENDING
                        ? "border-purple-500/50 text-purple-500"
                        : "border-white/10 text-white/20"
                  }`}
                >
                  {p.status}
                </span>

                {p.status === AttemptStatus.PENDING && (
                  <Link
                    href={`/exercise/${p.exercise.id}`}
                    className="text-[10px] font-black text-white hover:text-pink-500 underline underline-offset-4 tracking-[0.2em]"
                  >
                    REPRENDRE
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
