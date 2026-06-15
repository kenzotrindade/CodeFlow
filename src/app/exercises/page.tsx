import prisma from "@/lib/prisma";
import { AttemptStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ExerciseStats from "@/components/ExerciseStats";
import { BarChart2, BookOpen } from "lucide-react";
import type { Metadata } from "next";

// #################################
// ### Exercises Page SEO
// #################################

export const metadata: Metadata = {
  title: "Statistiques | CodeFlow",
  description:
    "Analysez votre progression technique, visualisez vos succès et accédez à votre archive complète de missions.",
};

export default async function ExercisesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const allAttempts = await prisma.exerciseAttempt.findMany({
    where: { userId: session?.user?.id },
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
    <div className="container mx-auto px-6 max-w-475 pt-12 pb-20">
      <header className="mb-16 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2">
            ARCHIVES
          </h1>
          <div className="h-1.5 w-32 bg-pink-500 mb-6" aria-hidden="true" />
          <p className="text-[12px] text-purple-100/80 font-mono tracking-[0.4em] uppercase flex items-center gap-3">
            <BarChart2 className="w-4 h-4 text-pink-500" aria-hidden="true" />
            Analyse de votre progression technique
          </p>
        </div>
      </header>

      <section className="mb-20" aria-label="Tableau de bord des statistiques">
        <ExerciseStats
          data={{
            attemptsByDay,
            attemptsByLanguage,
            successRate,
            totalCompleted: passedAttempts.length,
          }}
        />
      </section>

      <section aria-labelledby="history-journal-title">
        <div className="flex items-center gap-6 mb-12">
          <h2
            id="history-journal-title"
            className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 whitespace-nowrap"
          >
            Journal de Bord
          </h2>
          <div className="h-px grow bg-white/10" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {allAttempts.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all"
            >
              <div className="flex items-center gap-10 mb-4 md:mb-0">
                <div
                  className={`w-14 h-14 flex items-center justify-center border-2 ${p.status === AttemptStatus.PASSED ? "border-pink-500/30 bg-pink-500/5 shadow-[0_0_15px_rgba(236,72,153,0.1)]" : "border-white/20"}`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${p.status === AttemptStatus.PASSED ? "text-pink-500" : "text-white/30"}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-pink-400 transition-colors">
                    {p.exercise.title}
                  </h3>
                  <div className="text-[11px] text-purple-100/50 font-mono mt-2 uppercase tracking-widest">
                    <span>{p.exercise.language.name}</span>
                    <span className="mx-2">•</span>
                    <span>{p.exercise.difficulty}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={p.createdAt.toISOString()}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 border ${
                    p.status === AttemptStatus.PASSED
                      ? "border-pink-500/50 text-pink-500 bg-pink-500/5"
                      : p.status === AttemptStatus.PENDING
                        ? "border-purple-500/50 text-purple-500 bg-purple-500/5"
                        : "border-white/20 text-white/40"
                  }`}
                >
                  {p.status}
                </span>

                {p.status === AttemptStatus.PENDING && (
                  <nav aria-label={`Continuer l'exercice ${p.exercise.title}`}>
                    <Link
                      href={`/exercise/${p.exercise.id}`}
                      className="text-[11px] font-black text-white hover:text-pink-500 transition-all uppercase tracking-[0.2em] border-b border-white/20 hover:border-pink-500 pb-1"
                    >
                      Reprendre
                    </Link>
                  </nav>
                )}
              </div>
            </article>
          ))}
          {allAttempts.length === 0 && (
            <div className="py-20 card-fragment flex flex-col items-center justify-center border-dashed border-white/10 opacity-60">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
                Aucune séquence enregistrée
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
