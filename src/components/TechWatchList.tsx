"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TechwatchPrompt } from "@/app/actions/techwatch";
import { Article, Language } from "@/lib/types";
import { Clock, ExternalLink, BrainCircuit, ChevronDown } from "lucide-react";
import { toast } from "sonner";

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
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLangChange = (lang: Language) => {
    setIsOpen(false);
    router.push(`/techwatch?tag=${lang.slug}`);
  };

  const handleGenerate = (art: Article, index: number) => {
    setLoadingId(index);
    startTransition(async () => {
      const exercise = await TechwatchPrompt({
        title: art.title,
        description: art.description,
        languageId: currentLang.id,
        languageName: currentLang.name,
      });

      if (exercise) {
        toast.success("Défi généré !");
        router.push(`/exercise/${exercise.id}`);
      } else {
        toast.error("Échec de la conversion");
      }
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end -mt-24 mb-12 relative z-50">
        <div className="relative min-w-[200px]" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="input-prism flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] w-full text-left"
          >
            {currentLang?.name}
            <ChevronDown
              className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border-l-2 border-pink-500 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLangChange(lang)}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/5 ${currentLang.id === lang.id ? "text-pink-500 bg-white/[0.02]" : "text-white/60"}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(0, visibleCount).map((art, index) => (
          <div
            key={index}
            className="card-fragment group flex flex-col justify-between hover:bg-white/[0.04] transition-all p-0 overflow-hidden border-white/5"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#0d0415]">
              {art.cover_image ? (
                <img
                  src={art.cover_image}
                  alt={art.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <BrainCircuit className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0414] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-lg font-bold uppercase tracking-tight leading-tight text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                  {art.title}
                </h3>
              </div>
            </div>

            <div className="p-6 pt-5 flex-grow flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-white/20 uppercase">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> {art.reading_time_minutes} min
                </div>
                <div>
                  {new Date(art.published_at || "").toLocaleDateString()}
                </div>
              </div>
              <p className="text-xs text-purple-100/40 leading-relaxed mb-8 line-clamp-3 italic font-light">
                {art.description}
              </p>
              <div className="space-y-4">
                <a
                  href={art.url}
                  target="_blank"
                  className="text-[9px] uppercase font-black text-white/20 hover:text-pink-500 flex items-center gap-2 w-fit"
                >
                  LIRE LA SOURCE <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={() => handleGenerate(art, index)}
                  disabled={isPending}
                  className="btn-prism w-full py-3 text-[10px] flex items-center justify-center gap-2"
                >
                  {loadingId === index ? "FORGEAGE..." : "GÉNÉRER LE DÉFI IA"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < articles.length && (
        <div className="flex justify-center pt-12">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="btn-prism-outline flex items-center gap-3 px-12 py-3 text-[10px] font-black group border-white/5"
          >
            CHARGER PLUS
          </button>
        </div>
      )}
    </div>
  );
}
