"use client";

import { useEffect, useState } from "react";

// #################################
// ### Lumina Chat Component
// #################################

export default function LuminaChat({
  statement,
}: Readonly<{ statement: string }>) {
  const [isTyping, setIsTyping] = useState(true);

  const parts = statement.split("---");
  const luminaPart = parts.length > 1 ? parts[0] : "";
  const actualStatement = (
    parts.length > 1 ? parts.slice(1).join("---") : statement
  ).trim();

  const cleanLuminaMessage = luminaPart
    .replace("### MESSAGE DE LUMINA", "")
    .trim();

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-12">
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-pink-500 to-purple-600 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000" />

        <div className="relative bg-[#0d0415] border border-pink-500/20 rounded-lg p-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-size-[100%_2px,3px_100%]" />

          <div className="flex gap-6 items-start">
            <div className="shrink-0 relative">
              <div
                className={`w-14 h-14 rounded-full bg-linear-to-tr from-pink-600 to-purple-800 flex items-center justify-center border-2 border-pink-500/40 ${isTyping ? "animate-pulse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0d0415] shadow-[0_0_10px_#22c55e]" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-[0.4em] text-pink-500 uppercase">
                  Identity: Lumina-01
                </span>
                <span className="text-[8px] font-mono text-purple-300/30 uppercase tracking-widest">
                  Status: Active
                </span>
              </div>

              <div className="text-purple-100/90 text-sm md:text-base leading-relaxed font-mono">
                {isTyping ? (
                  <span className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:0.2s]">
                      .
                    </span>
                    <span className="animate-bounce [animation-delay:0.4s]">
                      .
                    </span>
                  </span>
                ) : (
                  <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {cleanLuminaMessage ||
                      "Analyse de la progression terminée. Préparez-vous pour le prochain défi."}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-fragment bg-white/2 border-l-4 border-pink-500 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="text-8xl font-black italic select-none">DATA</span>
        </div>

        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500 mb-8 flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rotate-45" />
          Mission de Terrain
        </h2>

        <div className="text-lg md:text-xl text-purple-50/80 leading-relaxed font-light whitespace-pre-wrap">
          {actualStatement}
        </div>
      </div>
    </div>
  );
}
