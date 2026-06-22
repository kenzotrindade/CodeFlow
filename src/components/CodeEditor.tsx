"use client";

import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Terminal, BrainCircuit, AlertCircle } from "lucide-react";
import { validateCode } from "@/app/actions/exercise";

// #################################
// ### Code Editor Component (Monaco)
// #################################

export default function CodeEditor({
  exerciseId,
  language,
  initialCode = "",
  onValidation,
}: Readonly<{
  exerciseId: string;
  language: string;
  initialCode?: string;
  onValidation: (
    result: {
      passed: boolean;
      feedback: string;
      score: number;
      hint?: string;
    } | null,
  ) => void;
}>) {
  const [code, setCode] = useState(initialCode);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const handleRunAndValidate = async () => {
    if (isEvaluating) return;
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
          passed: typeof result.passed === "boolean" ? result.passed : false,
          feedback: result.feedback || "Aucun feedback généré.",
          score: Number(result.score),
          hint: result.hint,
        });
      }
    } catch (err) {
      setError("Échec critique du système de validation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="card-fragment p-0 border-white/10 overflow-hidden flex flex-col h-full min-h-[500px] shadow-2xl">
      <div className="bg-[#0f071a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Prisme_Console./
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
        </div>
      </div>

      <div className="grow bg-[#0a0414] py-4">
        <Editor
          height="100%"
          language={language.toLowerCase()}
          theme="prism-theme"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: isEvaluating,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "all",
            cursorStyle: "line",
            cursorBlinking: "blink",
            cursorWidth: 2,
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("prism-theme", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#0a0414",
                "editorCursor.foreground": "#ec4899",
                "editorLineNumber.foreground": "#ffffff20",
                "editorLineNumber.activeForeground": "#ec4899",
                "editor.selectionBackground": "#ec489930",
                "editor.lineHighlightBackground": "#ec48990a",
              },
            });
          }}
        />
      </div>

      <div className="p-4 bg-[#0f071a] flex justify-between items-center border-t border-white/5">
        <div className="flex flex-col pl-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
            {code.length} octets // Langue: {language}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[9px] mt-1.5 uppercase font-black">
              <AlertCircle className="w-3 h-3" /> {error}
            </div>
          )}
        </div>
        <button
          onClick={handleRunAndValidate}
          disabled={isEvaluating}
          className={`relative h-10 px-10 group active:scale-95 transition-all disabled:opacity-50 overflow-hidden ${isEvaluating ? "cursor-wait" : ""}`}
        >
          <div
            className={`absolute inset-0 -skew-x-12 transition-colors ${isEvaluating ? "bg-white/5 animate-pulse" : "bg-pink-600 group-hover:bg-pink-500"}`}
          />
          <span className="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            {isEvaluating ? (
              <>
                <BrainCircuit className="w-3.5 h-3.5 animate-spin" /> AUDIT...
              </>
            ) : (
              <>SOUMETTRE</>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
