"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TechwatchPrompt } from "@/app/actions/techwatch";
import { Article, Language } from "@/lib/types";
import {
  Clock,
  ExternalLink,
  BrainCircuit,
  ChevronDown,
  Globe,
} from "lucide-react";
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
      const result = await TechwatchPrompt({
        title: art.title,
        description: art.description,
        languageId: currentLang.id,
        languageName: currentLang.name,
      });

      if (result?.exercise?.id) {
        toast.success("Défi généré !");
        router.push(`/exercise/${result.exercise.id}`);
      } else {
        toast.error("Échec de la conversion");
      }
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-16">
      <header className="border-b border-white/10 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter mix-diff uppercase mb-2 text-white">
              TECH WATCH
            </h1>
            <div className="h-1.5 w-32 bg-pink-500 mb-6" aria-hidden="true" />
            <p className="text-[12px] text-purple-100/70 font-mono tracking-[0.4em] uppercase flex items-center gap-3">
              <Globe className="w-4 h-4 text-pink-500" aria-hidden="true" />
              Extraction de flux externes en temps réel
            </p>
          </div>

          <nav
            className="relative min-w-55 z-50"
            ref={dropdownRef}
            aria-label="Filtrage par technologie"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className="input-prism flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] w-full text-white/90 text-left py-3.5"
            >
              {currentLang?.name}
              <ChevronDown
                className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div
                className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border-l-2 border-pink-500 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2"
                role="listbox"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLangChange(lang)}
                    role="option"
                    aria-selected={currentLang.id === lang.id}
                    className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-white/10 ${currentLang.id === lang.id ? "text-pink-500 bg-white/5" : "text-white/70"}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </nav>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(0, visibleCount).map((art, index) => (
          <article
            key={index}
            className="card-fragment group flex flex-col justify-between hover:bg-white/4 transition-all p-0 overflow-hidden border-white/10"
          >
            <header className="relative aspect-video w-full overflow-hidden bg-[#0d0415]">
              {art.cover_image ? (
                <img
                  src={art.cover_image}
                  alt={art.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center opacity-20"
                  aria-hidden="true"
                >
                  <BrainCircuit className="w-12 h-12" />
                </div>
              )}
              <div
                className="absolute inset-0 bg-linear-to-t from-[#0a0414] via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-lg font-bold uppercase tracking-tight leading-tight text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                  {art.title}
                </h3>
              </div>
            </header>

            <div className="p-6 pt-5 grow flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4 text-[9px] font-mono text-white/50 uppercase">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" aria-hidden="true" />{" "}
                  {art.reading_time_minutes} min
                </div>
                <time dateTime={art.published_at}>
                  {new Date(art.published_at || "").toLocaleDateString()}
                </time>
              </div>
              <p className="text-xs text-purple-100/70 leading-relaxed mb-8 line-clamp-3 italic font-light">
                {art.description}
              </p>
              <footer className="space-y-4">
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] uppercase font-black text-white/40 hover:text-pink-500 flex items-center gap-2 w-fit transition-colors"
                >
                  LIRE LA SOURCE{" "}
                  <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                </a>
                <button
                  onClick={() => handleGenerate(art, index)}
                  disabled={isPending}
                  className="btn-prism w-full py-3 text-[11px] font-black tracking-widest flex items-center justify-center gap-2"
                >
                  {loadingId === index ? "ANALYSE..." : "CRÉER UN MODULE"}
                </button>
              </footer>
            </div>
          </article>
        ))}
      </section>

      {visibleCount < articles.length && (
        <div className="flex justify-center pt-20">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="btn-prism-outline flex items-center gap-4 px-16 py-5 text-[12px] font-black tracking-[0.3em] group border-white/10 text-white/90"
          >
            AFFICHER DAVANTAGE
          </button>
        </div>
      )}
    </div>
  );
}
