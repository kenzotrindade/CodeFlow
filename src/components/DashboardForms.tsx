"use client";

import { Language, Difficulty } from "@prisma/client";
import { GeneratePrompt } from "@/app/actions/generate";
import { useRouter } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { promptForm } from "@/lib/types";
import { toast } from "sonner";
import { ChevronDown, Zap } from "lucide-react";

// #################################
// ### Dashboard Form
// #################################

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

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  const currentLang =
    languages.find((l) => l.id === selectedLangId) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setIsLangOpen(false);
      if (diffRef.current && !diffRef.current.contains(event.target as Node))
        setIsDiffOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = () => {
    startTransition(async () => {
      const lang = languages.find((l) => l.id === selectedLangId);
      if (!lang) return;

      const exercise = await GeneratePrompt({
        language: lang,
        difficulty: selectedDiff as Difficulty,
        promptArgs: promptForm.progressive,
      });

      if (!exercise) {
        toast.error("Échec de la génération");
        return;
      }

      toast.success("Prisme forgé !");
      router.push(`/exercise/${exercise.id}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full bg-white/[0.03] border border-white/5 hover:border-pink-500/30 px-10 py-3 rounded flex items-center justify-between transition-all"
          >
            <div className="flex flex-col items-start">
              <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 mb-1">
                Système
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {currentLang?.name}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-pink-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border border-white/10 shadow-2xl z-50 rounded-b overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLangId(lang.id);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-pink-500/10 transition-colors ${selectedLangId === lang.id ? "text-pink-500" : "text-white/60"}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={diffRef}>
          <button
            onClick={() => setIsDiffOpen(!isDiffOpen)}
            className="w-full bg-white/[0.03] border border-white/5 hover:border-pink-500/30 px-10 py-3 rounded flex items-center justify-between transition-all"
          >
            <div className="flex flex-col items-start">
              <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 mb-1">
                Niveau
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {selectedDiff}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-pink-500 transition-transform ${isDiffOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDiffOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border border-white/10 shadow-2xl z-50 rounded-b overflow-hidden">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedDiff(level);
                    setIsDiffOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-pink-500/10 transition-colors ${selectedDiff === level ? "text-pink-500" : "text-white/60"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="btn-prism min-w-[180px] flex items-center justify-center gap-2 group"
      >
        <span className="text-[16px]">
          {isPending ? "SCANNAGE..." : "GÉNÉRER"}
        </span>
      </button>
    </div>
  );
}
