"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TechwatchPrompt } from "@/app/actions/techwatch";
import { Article, Language } from "@/lib/types";

// #################################
// ### Techwatch List Component
// #################################

export default function TechWatchList({
  articles,
  languages,
  currentTag,
}: Readonly<{
  articles: Article[];
  languages: Language[];
  currentTag: string;
}>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentLang =
    languages.find((l) => l.slug === currentTag) || languages[0];
  const [selectedLangId, setSelectedLangId] = useState(currentLang?.id);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleLangChange = (id: string) => {
    setSelectedLangId(id);
    const lang = languages.find((l) => l.id === id);
    if (lang) {
      router.push(`/techwatch?tag=${lang.slug}`);
    }
  };

  const handleGenerate = (art: Article, index: number) => {
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
    <div className="space-y-12">
      <div className="card-fragment max-w-sm border-l-2 border-pink-500">
        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/50 mb-4 block">
          Langage cible pour la conversion
        </label>
        <select
          value={selectedLangId}
          onChange={(e) => handleLangChange(e.target.value)}
          className="input-prism w-full appearance-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-[#1a0b2e]">
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art, index) => (
          <div
            key={index}
            className="card-fragment group flex flex-col justify-between hover:bg-white/4 transition-all"
          >
            <div>
              <div className="mb-6 flex items-center gap-2">
                <div className="w-8 h-px bg-pink-500" />
                <span className="text-[9px] font-mono text-purple-100/30 uppercase tracking-widest">
                  Article Flux dev.to
                </span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tighter mb-4 leading-tight group-hover:text-pink-400 transition-colors">
                {art.title}
              </h3>
              <p className="text-sm text-purple-100/40 leading-relaxed mb-6 line-clamp-3 italic">
                {art.description}
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={art.url}
                target="_blank"
                className="text-[10px] uppercase tracking-widest font-bold text-pink-500/60 hover:text-pink-500 transition-colors block border-b border-pink-500/10 pb-2 w-fit"
              >
                Lire la source ↗
              </a>
              <button
                onClick={() => handleGenerate(art, index)}
                disabled={isPending}
                className="btn-prism w-full py-2 text-xs"
              >
                {loadingId === index
                  ? "CRISTALLISATION..."
                  : "CONVERTIR EN DÉFI"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
