"use client";

import { useState } from "react";
import { Terminal, BrainCircuit, AlertCircle } from "lucide-react";
import { validateCode } from "@/app/actions/exercise";

// #################################
// ### Code Editor Component
// #################################

export default function CodeEditor({
  exerciseId,
  language,
  initialCode = "",
  onValidation,
}: {
  exerciseId: string;
  language: string;
  initialCode?: string;
  onValidation: (
    result: { passed: boolean; feedback: string; score: number } | null,
  ) => void;
}) {
  const [code, setCode] = useState(
    initialCode ||
      `// Write your ${language} code here...\n\nfunction solve() {\n  // your logic\n}\n\nconsole.log(solve());`,
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAndValidate = async () => {
    setIsEvaluating(true);
    setError(null);
    onValidation(null);

    try {
      const result = await validateCode(exerciseId, code);

      if (result.error) {
        setError(result.error);
        onValidation(null);
      } else {
        onValidation({
          passed: result.passed,
          feedback: result.feedback,
          score: Number(result.score),
        });
      }
    } catch (err) {
      setError("Critical system failure during validation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="card-fragment p-0 border-white/10 overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
            Prisme_Editor.v3
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div className="relative flex-grow bg-[#0d0415]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-6 font-mono text-sm bg-transparent text-purple-100/90 resize-none focus:outline-none selection:bg-pink-500/30"
        />
      </div>

      <div className="p-4 bg-white/5 flex justify-between items-center border-t border-white/5">
        <div className="flex flex-col">
          <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
            {code.length} characters
          </div>
          {error && (
            <div className="flex items-center gap-1 text-red-500 text-[9px] mt-1 uppercase font-bold">
              <AlertCircle className="w-2.5 h-2.5" /> {error}
            </div>
          )}
        </div>
        <button
          onClick={handleRunAndValidate}
          disabled={isEvaluating}
          className={`flex items-center gap-2 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isEvaluating ? "bg-pink-500/20 text-pink-500 animate-pulse" : "bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]"}`}
        >
          {isEvaluating ? (
            <span className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 animate-spin" /> ANALYSE IA...
            </span>
          ) : (
            <>SOUMETTRE À LUMINA</>
          )}
        </button>
      </div>
    </div>
  );
}
