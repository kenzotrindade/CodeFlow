"use client";

import { Language, Difficulty } from "@prisma/client";
import { GeneratePrompt, promptForm } from "@/app/actions/generate";
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
      router.push(`/exercise/${exercise.id}`);
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
    </div>
  );
}
