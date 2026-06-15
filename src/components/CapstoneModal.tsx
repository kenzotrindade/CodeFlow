import { X } from "lucide-react";

interface CapstoneModalProps {
  onAccept: () => void;
  onClose: () => void;
}

export function CapstoneModal({ onAccept, onClose }: Readonly<CapstoneModalProps>) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-[#0a0414]/90 backdrop-blur-md p-6">
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-br from-pink-600 via-purple-600 to-pink-600 opacity-40 blur-3xl animate-aura" />

        <div className="relative bg-[#0f071a] p-12 text-center max-w-sm w-full border border-white/20 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-6">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-500 bg-pink-500/10 px-4 py-2 border border-pink-500/10">
              Protocole activé
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/50 hover:text-pink-500 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pink-500" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-pink-500" />

          <h2 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">
            Défi
            <br />
            Détecté
          </h2>

          <div className="flex items-center gap-2 mb-8">
            <span className="text-[10px] uppercase tracking-widest text-white/30">
              Niveau requis :
            </span>
            <span className="text-[12px] font-black text-pink-500 bg-pink-500/10 px-3 py-1 border border-pink-500/20">
              HARD/EXPERT
            </span>
          </div>

          <p className="text-purple-100/60 mb-8 italic leading-relaxed text-xs uppercase tracking-widest max-w-[280px]">
            Lumina a analysé ton parcours. Le Projet de Synthèse est
            déverrouillé. Une mission de production réelle t&apos;attend.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-60">
            <button
              type="button"
              onClick={onAccept}
              className="btn-prism text-[10px] w-full py-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Lancer le défi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
