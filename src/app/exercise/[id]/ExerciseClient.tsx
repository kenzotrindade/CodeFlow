"use client";

import { useState } from "react";
import Link from "next/link";
import { completeExercise } from "@/app/actions/exercise";
import LuminaChat from "@/components/LuminaChat";
import CodeEditor from "@/components/CodeEditor";
import {
  ChevronLeft,
  Info,
  CheckCircle2,
  Award,
  XCircle,
  BrainCircuit,
  BookOpen,
  ExternalLink,
  Library,
} from "lucide-react";

export default function ExerciseClient({ exercise }: any) {
  const [validationResult, setValidationResult] = useState<{
    passed: boolean;
    feedback: string;
    score: number;
    learningPath?: { title: string; url?: string; description: string }[];
  } | null>(null);

  const handleValidation = (result: any) => {
    setValidationResult(result);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container mx-auto px-6 max-w-7xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 hover:text-pink-500 transition-colors mb-4"
            >
              <ChevronLeft className="w-3 h-3" /> Retour Dashboard
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono bg-pink-500/10 text-pink-500 px-2 py-0.5 border border-pink-500/20">
                {exercise.language.name}
              </span>
              <span className="text-[10px] font-mono text-purple-300/40 uppercase tracking-widest">
                {exercise.difficulty}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mix-diff">
              {exercise.title}
            </h1>
          </div>

          {validationResult && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 backdrop-blur-md animate-in fade-in zoom-in duration-500">
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-widest text-purple-100/30 font-bold mb-1">
                  Analyse Finale
                </div>
                <div
                  className={`text-3xl font-black italic ${validationResult.passed ? "text-green-500" : "text-red-500"}`}
                >
                  {validationResult.score}%
                </div>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center border-2 ${validationResult.passed ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
              >
                {validationResult.passed ? (
                  <Award className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-pink-500/60">
                <BrainCircuit className="w-3 h-3" /> Énoncé du Fragment
              </div>
              <LuminaChat statement={exercise.statement} />
            </section>

            {validationResult && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                <section>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/40 mb-4">
                    Rapport de Lumina
                  </div>
                  <div
                    className={`p-6 border-l-4 bg-white/[0.02] ${validationResult.passed ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.05)]" : "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]"}`}
                  >
                    <p className="text-sm text-purple-100/80 leading-relaxed font-mono italic">
                      {validationResult.feedback}
                    </p>
                  </div>
                </section>

                {validationResult.learningPath &&
                  validationResult.learningPath.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mb-4">
                        <Library className="w-3 h-3" /> Protocole de
                        Perfectionnement
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {validationResult.learningPath.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.05] transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-pink-500 transition-colors">
                                {item.title}
                              </h4>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  className="text-purple-400 hover:text-white transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-[10px] text-purple-100/40 leading-relaxed italic">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
              </div>
            )}

            <div className="bg-white/[0.02] border border-white/5 p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-purple-100/40 leading-relaxed italic">
                La cristallisation n'est possible qu'après une validation
                positive de l'entité Lumina.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="h-[500px]">
                <CodeEditor
                  exerciseId={exercise.id}
                  language={exercise.language.name}
                  initialCode={exercise.codeSnippet || ""}
                  onValidation={handleValidation}
                />
              </div>

              <div
                className={`card-fragment p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-pink-500/20 bg-linear-to-r from-pink-500/5 to-transparent transition-all duration-700 ${!validationResult?.passed ? "opacity-30 grayscale pointer-events-none" : "opacity-100 shadow-[0_0_30px_rgba(236,72,153,0.1)]"}`}
              >
                <div>
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs">
                    Stabilisation du Fragment
                  </h3>
                  <p className="text-[10px] text-purple-100/30 font-mono mt-1">
                    Prêt pour l'archivage dans le flux cristallin
                  </p>
                </div>

                <form action={() => completeExercise(exercise.id)}>
                  <button
                    type="submit"
                    disabled={!validationResult?.passed}
                    className="btn-prism px-12 group flex items-center gap-3 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> CRISTALLISER
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
