"use client";

import { useState } from "react";
import { completeExercise } from "@/app/actions/exercise";
import LuminaChat from "@/components/LuminaChat";
import CodeEditor from "@/components/CodeEditor";
import { AIValidationResponse, Language } from "@/lib/types";
import { Difficulty } from "@prisma/client";
import {
  Award,
  XCircle,
  BrainCircuit,
  ExternalLink,
  Library,
  Terminal,
  Activity,
  CheckCircle,
  Info,
} from "lucide-react";

interface ExerciseClientProps {
  exercise: {
    id: string;
    title: string;
    statement: string;
    difficulty: Difficulty;
    language: Language;
    codeSnippet?: string | null;
  };
}

// #################################
// ### Exercise Client Validation
// #################################

export default function ExerciseClient({
  exercise,
}: Readonly<ExerciseClientProps>) {
  const [validationResult, setValidationResult] =
    useState<AIValidationResponse | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleValidation = (result: any) => {
    setValidationResult(result);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.03)_0%,transparent_50%)]">
      <header className="container mx-auto px-6 max-w-475 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-pink-500/10 text-pink-500 px-3 py-1 border border-pink-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Terminal className="w-3 h-3" aria-hidden="true" />
                {exercise.language.name}
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
                Séquence: {exercise.difficulty}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mix-diff">
              {exercise.title}
            </h1>
          </div>

          {validationResult && (
            <aside
              className="flex items-center gap-6 bg-white/2 border border-white/10 p-6 backdrop-blur-xl animate-in fade-in zoom-in duration-500 relative group"
              aria-label="Résultat de l'audit"
            >
              <div
                className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
              <div className="text-right relative">
                <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black mb-1">
                  Audit d&apos;Intégrité
                </div>
                <div
                  className={`text-4xl font-black italic ${validationResult.passed ? "text-green-500" : "text-red-500"}`}
                >
                  {validationResult.score}%
                </div>
              </div>
              <div
                className={`w-14 h-14 flex items-center justify-center border-2 relative ${validationResult.passed ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}`}
              >
                {validationResult.passed ? (
                  <Award
                    className="w-7 h-7 text-green-500"
                    aria-label="Validé"
                  />
                ) : (
                  <XCircle
                    className="w-7 h-7 text-red-500"
                    aria-label="Échec"
                  />
                )}
              </div>
            </aside>
          )}
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-475">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <section
            className="lg:col-span-5 space-y-12"
            aria-label="Énoncé et retours"
          >
            <article className="space-y-6">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-white/20">
                <BrainCircuit
                  className="w-4 h-4 text-pink-500/60"
                  aria-hidden="true"
                />
                Spécifications de la Mission
              </div>
              <LuminaChat statement={exercise.statement} />
            </article>

            {validationResult && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-white/20">
                    <Activity
                      className="w-4 h-4 text-purple-500/60"
                      aria-hidden="true"
                    />
                    Analyse de l&apos;Architecte
                  </div>
                  <div
                    className={`p-8 border-l-4 bg-white/1 backdrop-blur-sm ${validationResult.passed ? "border-green-500" : "border-red-500"}`}
                  >
                    <p className="text-base text-purple-100/90 leading-relaxed font-mono italic">
                      &quot;{validationResult.feedback}&quot;
                    </p>

                    {validationResult && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 hover:text-pink-400 transition-colors flex items-center gap-2"
                        >
                          <Info className="w-3 h-3" />{" "}
                          {showHint
                            ? "Masquer l'indice"
                            : "Besoin d'un indice ?"}
                        </button>

                        {showHint && (
                          <div className="mt-4 bg-pink-500/5 p-4 border border-pink-500/20">
                            <p className="text-xs text-pink-100/80 leading-relaxed italic">
                              <span className="font-bold text-pink-500">
                                INDICE :
                              </span>
                              {validationResult.hint ||
                                "L'IA n'a pas généré d'indice pour cette soumission."}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {validationResult.learning_path &&
                  validationResult.learning_path.length > 0 && (
                    <section className="space-y-6">
                      <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-pink-500/60">
                        <Library className="w-4 h-4" aria-hidden="true" />
                        Protocole d&apos;Optimisation
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {validationResult.learning_path.map((item, idx) => (
                          <article
                            key={idx}
                            className="bg-white/2 border border-white/5 p-6 hover:bg-white/4 transition-all group border-l border-l-transparent hover:border-l-pink-500"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[12px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                                {item.title}
                              </h4>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-pink-500 transition-colors"
                                  title="Ouvrir la ressource"
                                >
                                  <ExternalLink
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                </a>
                              )}
                            </div>
                            <p className="text-[11px] text-purple-100/40 leading-relaxed italic">
                              {item.description}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
              </div>
            )}

            {!validationResult && (
              <div
                className="bg-white/1 border border-white/5 p-6 flex items-start gap-4 opacity-40"
                role="status"
              >
                <Info
                  className="w-5 h-5 text-purple-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs text-purple-100/60 leading-relaxed italic uppercase tracking-wider">
                  Soumettez votre implémentation pour déclencher l&apos;audit de
                  sécurité de votre mentor.
                </p>
              </div>
            )}
          </section>

          <section
            className="lg:col-span-7 space-y-10"
            aria-label="Zone d'implémentation"
          >
            <div className="sticky top-32 space-y-10">
              <div className="h-150 shadow-2xl">
                <CodeEditor
                  exerciseId={exercise.id}
                  language={exercise.language.name}
                  initialCode={exercise.codeSnippet || ""}
                  onValidation={handleValidation}
                />
              </div>

              <div
                className={`card-fragment p-10 flex flex-col md:flex-row items-center justify-between gap-10 border-white/5 bg-linear-to-r from-white/2 to-transparent transition-all duration-1000 ${validationResult?.passed ? "opacity-100 shadow-[0_20px_50px_rgba(236,72,153,0.1)] scale-100" : "opacity-20 grayscale pointer-events-none scale-[0.98]"}`}
              >
                <div className="space-y-2">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm">
                    Validation du Flux
                  </h3>
                  <p className="text-[10px] text-purple-100/30 font-mono uppercase tracking-widest">
                    Signature d&apos;intégrité prête pour archivage
                  </p>
                </div>

                <form action={() => completeExercise(exercise.id)}>
                  <button
                    type="submit"
                    disabled={!validationResult?.passed}
                    className="btn-prism px-16 py-5 group flex items-center gap-4 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                    <span className="text-[12px] tracking-[0.3em]">
                      ARCHIVER
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
