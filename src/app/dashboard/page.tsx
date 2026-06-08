import prisma from "@/lib/prisma";
import { Difficulty } from "@prisma/client";
import DashboardForms from "@/components/DashboardForms";
import { auth } from "@/lib/auth";
import Link from "next/link";

// #################################
// ### Dashboard Page
// #################################

export default async function Dashboard() {
  const session = await auth();
  const languages = await prisma.language.findMany();
  const difficulties = Object.values(Difficulty);

  const passedExercises = await prisma.exerciseAttempt.findMany({
    where: { userId: session?.user?.id, status: "PASSED" },
    include: { exercise: { include: { language: true } } },
    orderBy: { createdAt: "desc" },
  });

  const inProgressExercises = await prisma.exerciseAttempt.findMany({
    where: { userId: session?.user?.id, status: "PENDING" },
    include: { exercise: { include: { language: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="mb-20">
        <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2">
          DASHBOARD
        </h1>
        <div className="h-1 w-24 bg-pink-500 mb-6" />
        <p className="text-purple-200/50 font-mono text-sm tracking-widest uppercase">
          Flux actif : {session?.user?.name}
        </p>
      </div>

      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Section Génération */}
          <div className="lg:col-span-4 space-y-8">
            <div className="card-fragment">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-pink-500">
                Générateur de Prisme
              </h2>
              <DashboardForms
                languages={languages}
                difficulties={difficulties}
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-purple-300/40 mb-6 flex items-center gap-4">
                Fragments en attente{" "}
                <div className="h-px grow bg-white/5" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressExercises.map((p) => (
                  <Link key={p.id} href={`/exercise/${p.exercise.id}`}>
                    <div className="card-fragment hover:bg-white/5 transition-all group border-l-2 border-l-pink-500">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2 py-1">
                          {p.exercise.language.name}
                        </span>
                        <span className="text-[10px] text-purple-100/30 uppercase tracking-widest">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold uppercase tracking-tighter group-hover:text-pink-400 transition-colors">
                        {p.exercise.title}
                      </h4>
                      <div className="mt-4 flex items-center gap-2 text-[10px] text-pink-500 font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0">
                        REPRENDRE LE FLUX →
                      </div>
                    </div>
                  </Link>
                ))}
                {inProgressExercises.length === 0 && (
                  <p className="text-sm text-purple-100/20 italic">
                    Aucun fragment actif.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-purple-300/40 mb-6 flex items-center gap-4">
                Archives Cristallines{" "}
                <div className="h-px grow bg-white/5" />
              </h3>
              <div className="space-y-4">
                {passedExercises.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-6 bg-white/2 border border-white/5 hover:border-pink-500/30 transition-all"
                  >
                    <div>
                      <h4 className="font-bold uppercase tracking-tight text-purple-100/80">
                        {p.exercise.title}
                      </h4>
                      <p className="text-[10px] text-purple-100/30 font-mono mt-1">
                        {p.exercise.language.name} • COMPLÉTÉ LE{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-2 h-2 rotate-45 bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                  </div>
                ))}
                {passedExercises.length === 0 && (
                  <p className="text-sm text-purple-100/20 italic">
                    Aucune archive disponible.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
