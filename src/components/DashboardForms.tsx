"use client";

import { Language, Difficulty } from "@prisma/client";
import { GeneratePrompt } from "@/app/actions/generate";
import { useRouter } from "next/navigation";
import { useState, useTransition, useRef, useEffect } from "react";
import { promptForm } from "@/lib/types";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { CapstoneModal } from "@/components/CapstoneModal";

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

      const result = await GeneratePrompt({
        language: lang,
        difficulty: selectedDiff as Difficulty,
        promptArgs: promptForm.progressive,
      });

      if (!result) {
        toast.error("Échec de la génération");
        return;
      }

      toast.success("Prisme forgé !");

      if (result.recommendCapstone) {
        setLastGeneratedId(result.exercise.id);
        setShowProjectModal(true);
      } else {
        router.push(`/exercise/${result.exercise?.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="input-prism flex items-center justify-between text-[14px] font-black uppercase tracking-[0.2em] w-full text-left py-4"
          >
            {currentLang?.name}
            <ChevronDown
              className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLangOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border-l-2 border-pink-500 shadow-2xl z-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedLangId(lang.id);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-white/5 ${selectedLangId === lang.id ? "text-pink-500 bg-white/2" : "text-white/60"}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={diffRef}>
          <button
            type="button"
            onClick={() => setIsDiffOpen(!isDiffOpen)}
            className="input-prism flex items-center justify-between text-[14px] font-black uppercase tracking-[0.2em] w-full text-left py-4"
          >
            {selectedDiff}
            <ChevronDown
              className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${isDiffOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDiffOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#0d0414] border-l-2 border-pink-500 shadow-2xl z-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {difficulties.map((level) => (
                <button
                  key={level}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedDiff(level);
                    setIsDiffOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-white/5 ${selectedDiff === level ? "text-pink-500 bg-white/2" : "text-white/60"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="relative h-10 px-12 group active:scale-95 transition-all disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-pink-600 -skew-x-12 group-hover:bg-pink-500 transition-colors shadow-[0_0_25px_rgba(236,72,153,0.3)]" />
        <span className="relative text-[14px] font-black uppercase tracking-[0.4em] text-white">
          {isPending ? "SCAN..." : "GÉNÉRER"}
        </span>
      </button>

      {showProjectModal && (
        <CapstoneModal
          onAccept={() => router.push(`/exercise/${lastGeneratedId}`)}
          onClose={() => setShowProjectModal(false)}
        />
      )}
    </div>
  );
}
