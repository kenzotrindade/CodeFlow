"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TechwatchPrompt } from "@/app/actions/techwatch";

export default function TechWatchList({
  articles,
  languages,
}: {
  articles: any[];
  languages: any[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedLangId, setSelectedLangId] = useState(languages[0]?.id);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleGenerate = (art: any, index: number) => {
    setLoadingId(index);
    startTransition(async () => {
      const lang = languages.find((l) => l.id === selectedLangId);
      if (!lang) {
        setLoadingId(null);
        return;
      }
      const exercise = await TechwatchPrompt({
        title: art.title,
        description: art.description,
        languageId: lang.id,
        languageName: lang.name,
      });

      if (exercise) {
        router.push(`/exercise/${exercise.id}`);
      }
      setLoadingId(null);
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
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((art, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h3>{art.title}</h3>
              <p>{art.description}</p>
              <a
                href={art.url}
                target="_blank"
                className="text-blue-500 hover:text-blue-400"
              >
                {art.url}
              </a>
              <button
                onClick={() => handleGenerate(art, index)}
                disabled={isPending}
              >
                {loadingId === index ? "Generation..." : "Generate"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
