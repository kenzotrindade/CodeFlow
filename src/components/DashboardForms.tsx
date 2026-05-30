"use client";

import { Language, Difficulty } from "@prisma/client";
import { GeneratePrompt } from "@/app/actions/generate";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { promptForm } from "@/lib/types";

export default function DashboardForms({
  languages,
  difficulties,
}: Readonly<{
  languages: Language[];
  difficulties: string[];
}>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedLangId, setSelectedLangId] = useState(languages[0]?.id);
  const [selectedDiff, setSelectedDiff] = useState(difficulties[0]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [lastGeneratedId, setLastGeneratedId] = useState<string | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      const lang = languages.find((l) => l.id === selectedLangId);
      if (!lang) return;

      const exercise = await GeneratePrompt({
        language: lang,
        difficulty: selectedDiff as Difficulty,
        promptArgs: promptForm.progressive,
      });

      if (exercise.isCapstone) {
        setLastGeneratedId(exercise.id);
        setShowProjectModal(true);
      } else {
        router.push(`/exercise/${exercise.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">Langage</label>
          <select
            value={selectedLangId}
            onChange={(e) => setSelectedLangId(e.target.value)}
            className="input-prism w-full appearance-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-[#1a0b2e]">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50">Difficulté</label>
          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="input-prism w-full appearance-none cursor-pointer"
          >
            {difficulties.map((level) => (
              <option key={level} value={level} className="bg-[#1a0b2e]">
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isPending}
        className={`btn-prism w-full ${isPending ? "opacity-50" : ""}`}
      >
        {isPending ? "SCULPTURE..." : "GÉNÉRER LE DÉFI"}
      </button>

      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="card-fragment max-w-sm w-full border-pink-500 border-2 text-center">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Bravo !</h2>
            <p className="text-purple-200/60 text-sm mb-8 leading-relaxed">
              Vous avez complété ce module de niveau <span className="text-pink-500 font-bold">{selectedDiff}</span>. 
              Un projet final vous attend.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push(`/exercise/${lastGeneratedId}`)}
                className="btn-prism w-full"
              >
                ACCÉDER AU PROJET
              </button>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
