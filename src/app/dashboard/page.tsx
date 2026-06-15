import prisma from "@/lib/prisma";
import { AttemptStatus, Difficulty } from "@prisma/client";
import DashboardForms from "@/components/DashboardForms";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Terminal,
  History,
  BarChart3,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

// #################################
// ### Dashboard Page
// #################################

export const metadata: Metadata = {
  title: "Console | CodeFlow",
  description:
    "Gérez vos missions, surveillez votre progression et initialisez de nouveaux prismes d'apprentissage.",
};

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  
  const languages = await prisma.language.findMany();
  const difficulties = Object.values(Difficulty);

  const passedCount = await prisma.exerciseAttempt.count({
    where: { userId: session?.user?.id, status: AttemptStatus.PASSED },
  });

  const passedExercises = await prisma.exerciseAttempt.findMany({
    where: { userId: session?.user?.id, status: AttemptStatus.PASSED },
    include: { exercise: { include: { language: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const inProgressExercises = await prisma.exerciseAttempt.findMany({
    where: { userId: session?.user?.id, status: AttemptStatus.PENDING },
    include: { exercise: { include: { language: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="container mx-auto px-6 max-w-475 pt-12 pb-20">
      <header className="mb-16 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2 text-white">
            DASHBOARD
          </h1>
          <div className="h-1.5 w-32 bg-pink-500 mb-6" aria-hidden="true" />
          <p className="text-[13px] text-purple-100/70 font-mono tracking-[0.4em] uppercase flex items-center gap-3">
            <Terminal
              className="w-4.5 h-4.5 text-pink-500"
              aria-hidden="true"
            />
            Interface de contrôle et gestion des flux
          </p>
        </div>
      </header>

      <section
        className="card-fragment p-0! border-white/10 bg-linear-to-br from-white/5 to-transparent mb-16 overflow-visible! relative z-20"
        aria-label="Tableau de bord principal"
      >
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          <Link
            href="/exercises"
            className="p-8 lg:w-1/3 group hover:bg-white/2 transition-all"
            title="Voir les statistiques détaillées"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-linear-to-tr from-pink-600 to-purple-700 flex items-center justify-center border border-white/20">
                  <span className="text-base font-black text-white">
                    {session.user?.name?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-tight">
                    Console Opérateur
                  </h2>
                  <p className="text-[10px] font-mono text-pink-500 tracking-[0.3em] uppercase">
                    Status: En ligne
                  </p>
                </div>
              </div>
              <ChevronRight
                className="w-5 h-5 text-white/20 group-hover:text-pink-500 group-hover:translate-x-1 transition-all"
                aria-hidden="true"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  Séquences
                </span>
                <p className="text-3xl font-black text-white/90 group-hover:text-white transition-colors">
                  {passedCount}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  En cours
                </span>
                <p className="text-3xl font-black text-pink-500">
                  {inProgressExercises.length}
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-white/40 group-hover:text-pink-500/80 transition-colors uppercase tracking-[0.2em]">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              Ouvrir le rapport d&apos;analyse
            </div>
          </Link>

          <div className="p-8 lg:flex-1 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-6 text-white/60">
              <Terminal className="w-4 h-4" aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">
                Initialisation de Nouveau Prisme
              </h2>
            </div>
            <DashboardForms languages={languages} difficulties={difficulties} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section
          className="lg:col-span-8 space-y-10"
          aria-labelledby="active-missions-title"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"
                aria-hidden="true"
              />
              <h3
                id="active-missions-title"
                className="text-[12px] font-black uppercase tracking-[0.5em] text-white/60"
              >
                Missions Opérationnelles
              </h3>
            </div>
            <div className="h-px grow mx-6 bg-white/10" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressExercises.length > 0 ? (
              inProgressExercises.map((p) => (
                <article key={p.id}>
                  <Link
                    href={`/exercise/${p.exercise.id}`}
                    className="group relative block h-full"
                  >
                    <div
                      className={`card-fragment p-8 hover:bg-white/4 transition-all border-white/10 hover:border-pink-500/30 h-full flex flex-col justify-between ${p.exercise.isCapstone ? "ring-2 ring-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.2)]" : ""}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <span className="text-[10px] font-mono bg-white/10 text-white/80 px-3 py-1 border border-white/10 rounded-full group-hover:border-pink-500/20 group-hover:text-pink-300 transition-colors">
                            {p.exercise.language.name}
                          </span>
                          {p.exercise.isCapstone && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 animate-pulse">
                              Défi
                            </span>
                          )}
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-pink-400 transition-colors leading-none mb-4">
                          {p.exercise.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <div className="flex items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <time
                            dateTime={p.createdAt.toISOString()}
                            className="text-[12px] font-mono uppercase tracking-widest"
                          >
                            {new Date(p.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <ArrowRight
                          className="w-5 h-5 text-pink-500 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full py-20 card-fragment flex flex-col items-center justify-center border-dashed border-white/10 opacity-40">
                <BarChart3 className="w-8 h-8 mb-4" aria-hidden="true" />
                <span className="text-[12px] font-black uppercase tracking-[0.5em]">
                  Attente de nouvelles séquences
                </span>
              </div>
            )}
          </div>
        </section>

        <aside
          className="lg:col-span-4 space-y-12"
          aria-labelledby="history-title"
        >
          <div className="space-y-8">
            <h3
              id="history-title"
              className="text-[12px] font-black uppercase tracking-[0.5em] text-white/60 flex items-center gap-3"
            >
              <History className="w-4 h-4" aria-hidden="true" />
              Séquences Validées
            </h3>

            <div className="space-y-4">
              {passedExercises.map((p) => (
                <article
                  key={p.id}
                  className="group p-5 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                      {p.exercise.language.name}
                    </p>
                    <h4 className="text-[13px] font-black uppercase text-white/90 group-hover:text-white transition-colors">
                      {p.exercise.title}
                    </h4>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rotate-45 bg-pink-500 shadow-[0_0_10px_#ec4899]"
                    aria-hidden="true"
                  />
                </article>
              ))}

              <nav aria-label="Navigation historique">
                <Link
                  href="/exercises"
                  className="block w-full py-4 text-center border border-dashed border-white/10 hover:border-pink-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-pink-500 transition-all"
                >
                  Voir l&apos;archive complète
                </Link>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
