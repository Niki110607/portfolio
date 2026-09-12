import React from "react";

export default function PlayingCard({ suit, value, hidden = false }) {
  const isRed = suit === "♥" || suit === "♦";

  if (hidden) {
    return (
      <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-gradient-to-b from-color-secondary via-color-secondary/95 to-color-main/80 border border-color-border/80 p-2 sm:p-2.5 flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-color-accent/50 select-none overflow-hidden group">
        {/* Top Gloss Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Center Glow Effect */}
        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-color-accent/15 filter blur-md" />

        {/* Inner Card Pattern Container */}
        <div className="w-full h-full rounded-lg border border-color-border/60 bg-color-main/50 flex items-center justify-center relative z-10 overflow-hidden">
          {/* Subtle Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--tw-gradient-stops))] from-color-text via-transparent to-transparent [background-size:8px_8px]" />

          {/* Center Geometric Crest */}
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-md border border-color-accent/40 bg-color-secondary/80 rotate-45 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-color-accent/60 bg-color-accent/20 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Ambient Inner Ring */}
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/5" />
      </div>
    );
  }

  return (
    <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl bg-gradient-to-b from-color-secondary via-color-secondary/95 to-color-main/80 border border-color-border/80 p-2 sm:p-2.5 flex flex-col justify-between shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-color-accent/50 select-none overflow-hidden group">
      {/* Top Gloss Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* TOP-LEFT CORNER */}
      <div
        className={`flex flex-col items-start self-start leading-none ${
          isRed ? "text-red-400" : "text-color-text"
        }`}
      >
        <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight drop-shadow-sm">
          {value}
        </span>
        <span className="text-[10px] sm:text-xs -mt-0.5 opacity-90">
          {suit}
        </span>
      </div>

      {/* CENTER LARGE SUIT */}
      <div className="relative flex items-center justify-center my-auto">
        <div
          className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full filter blur-md opacity-20 ${
            isRed ? "bg-red-500" : "bg-color-accent"
          }`}
        />
        <span
          className={`relative text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110 ${
            isRed
              ? "text-red-400 drop-shadow-[0_2px_8px_rgba(248,113,113,0.25)]"
              : "text-color-text/90 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
          }`}
        >
          {suit}
        </span>
      </div>

      {/* BOTTOM-RIGHT CORNER (INVERTED & DIAGONALLY OPPOSITE) */}
      <div
        className={`flex flex-col items-end self-end leading-none rotate-180 ${
          isRed ? "text-red-400" : "text-color-text"
        }`}
      >
        <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight drop-shadow-sm">
          {value}
        </span>
        <span className="text-[10px] sm:text-xs -mt-0.5 opacity-90">
          {suit}
        </span>
      </div>

      {/* Ambient Inner Ring */}
      <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/5" />
    </div>
  );
}
