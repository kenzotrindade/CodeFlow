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

  const completeExerciceAction = completeExercise.bind(null, id);

  return (
    <div className="container mx-auto px-6 max-w-5xl">
      <Link
        href="/dashboard"
        className="text-[10px] uppercase tracking-widest font-bold text-purple-100/30 hover:text-pink-500 transition-colors mb-12 block"
      >
        ← Retour au Dashboard
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">
            {exercise.language.name}
          </span>
          <span className="text-purple-300/40 text-[10px] font-mono uppercase tracking-widest">
            Niveau {exercise.difficulty}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mix-diff">
          {exercise.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="card-fragment bg-white/3 border-l-4 border-pink-500 p-12">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500 mb-8">
            Énoncé du Défi
          </h2>
          <div className="text-l md:text-xl text-purple-100/80 leading-relaxed font-light italic whitespace-pre-wrap">
            {exercise.statement}
          </div>

          <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-xs text-purple-100/30 max-w-md italic">
              Une fois le défi relevé et le code implémenté dans votre
              environnement, validez le fragment pour progresser dans le flux.
            </p>
            <form action={completeExerciceAction}>
              <button type="submit" className="btn-prism whitespace-nowrap">
                DÉFI TERMINÉ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
