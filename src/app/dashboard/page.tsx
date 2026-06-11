import prisma from "@/lib/prisma";
import { AttemptStatus, Difficulty } from "@prisma/client";
import DashboardForms from "@/components/DashboardForms";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Terminal, History, BarChart3, Clock } from "lucide-react";

// #################################
// ### Dashboard Page
// #################################

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  const languages = await prisma.language.findMany();
  const difficulties = Object.values(Difficulty);

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
    <div className="container mx-auto px-6 max-w-7xl pt-10 pb-20">
      <div className="card-fragment !p-0 border-white/5 bg-linear-to-br from-white/[0.03] to-transparent mb-16 !overflow-visible">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          <div className="p-8 lg:w-1/3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-pink-600 to-purple-700 flex items-center justify-center border border-white/20">
                <span className="text-sm font-black text-white">
                  {session.user?.name?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
                  Console de Flux
                </h1>
                <p className="text-[9px] font-mono text-pink-500 tracking-[0.3em] uppercase">
                  Status: Connecté
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                  Séquences
                </span>
                <p className="text-lg font-bold text-white/80">
                  {passedExercises.length}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                  Actifs
                </span>
                <p className="text-lg font-bold text-pink-500">
                  {inProgressExercises.length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 lg:flex-1 bg-white/[0.01]">
            <div className="flex items-center gap-2 mb-6 text-white/40">
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Initialisation de Nouveau Prisme
              </span>
            </div>
            <DashboardForms languages={languages} difficulties={difficulties} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                Missions Opérationnelles
              </h3>
            </div>
            <div className="h-px grow mx-6 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressExercises.length > 0 ? (
              inProgressExercises.map((p) => (
                <Link
                  key={p.id}
                  href={`/exercise/${p.exercise.id}`}
                  className="group relative"
                >
                  <div className="card-fragment p-8 hover:bg-white/[0.04] transition-all border-white/5 hover:border-pink-500/30 h-full flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-[8px] font-mono bg-white/5 text-white/40 px-3 py-1 border border-white/5 rounded-full group-hover:border-pink-500/20 group-hover:text-pink-300 transition-colors">
                          {p.exercise.language.name}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-pink-400 transition-colors leading-none mb-4">
                        {p.exercise.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex items-center gap-2 text-white/20">
                        <Clock className="w-3 h-3" />
                        <span className="text-[8px] font-mono uppercase tracking-widest">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 card-fragment flex flex-col items-center justify-center border-dashed opacity-20">
                <BarChart3 className="w-8 h-8 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Attente de nouvelles séquences
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 flex items-center gap-3">
              <History className="w-3.5 h-3.5" />
              Séquences Validées
            </h3>

            <div className="space-y-4">
              {passedExercises.map((p) => (
                <div
                  key={p.id}
                  className="group p-5 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                      {p.exercise.language.name}
                    </p>
                    <h5 className="text-xs font-black uppercase text-white/70 group-hover:text-white transition-colors">
                      {p.exercise.title}
                    </h5>
                  </div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                </div>
              ))}

              <Link
                href="/exercises"
                className="block w-full py-4 text-center border border-dashed border-white/10 hover:border-pink-500/30 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-pink-500 transition-all"
              >
                Voir l'archive complète
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
