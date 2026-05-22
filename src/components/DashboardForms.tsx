"use client";

import { Language, Difficulty } from "@prisma/client";
import { GeneratePrompt } from "@/app/actions/generate";
import { promptForm } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
      if (!lang) {
        return;
      }

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
    <div>
      <select
        value={selectedLangId}
        onChange={(e) => setSelectedLangId(e.target.value)}
        className="border p-2 rounded text-black"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <select
        value={selectedDiff}
        onChange={(e) => setSelectedDiff(e.target.value)}
        className="border p-2 rounded text-black"
      >
        {difficulties.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>

      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Generation..." : "Generate"}
      </button>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-black flex flex-col items-center max-w-sm">
            <h2 className="text-xl font-bold mb-2">Congrats !</h2>
            <p className="mb-4 text-center">
              You finish this module {selectedDiff} !
            </p>
            <button
              onClick={() => router.push(`/exercise/${lastGeneratedId}`)}
              className="bg-green-600 text-white px-4 py-2 rounded font-bold"
            >
              Go to project
            </button>
            <button
              onClick={() => setShowProjectModal(false)}
              className="mt-4 text-gray-500 text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
