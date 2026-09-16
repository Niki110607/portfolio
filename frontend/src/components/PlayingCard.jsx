import React from "react";

const SUIT_SYMBOLS = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
  h: "♥",
  d: "♦",
  c: "♣",
  s: "♠",
};

export default function PlayingCard({ suit, value, hidden = false }) {
  const displaySuit = SUIT_SYMBOLS[suit] || suit || "♠";
  const isRed = displaySuit === "♥" || displaySuit === "♦";

  if (hidden) {
    return (
      <div
        className="
          relative
          w-20
          h-28
          sm:w-24
          sm:h-36
          rounded-xl
          bg-zinc-900
          border
          border-zinc-800
          flex
          items-center
          justify-center
          shadow-xl
          overflow-hidden
          shrink-0
        "
      >
        {/* Minimal machine-pattern back */}
        <div
          className="
            absolute
            inset-2
            rounded-lg
            border
            border-zinc-800
            bg-zinc-950
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              w-9
              h-9
              rounded-lg
              border
              border-emerald-400/35
              rotate-45
              flex
              items-center
              justify-center
            "
          >
            <div className="w-3 h-3 rounded-sm bg-emerald-400/10 border border-emerald-400/30" />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.04]" />
      </div>
    );
  }

  return (
    <div
      className={`
        relative
        w-20
        h-28
        sm:w-24
        sm:h-36
        rounded-xl
        bg-[#f1f1ee]
        border
        border-white/10
        p-2
        sm:p-2.5
        flex
        flex-col
        justify-between
        shadow-[0_12px_28px_rgba(0,0,0,0.35)]
        shrink-0
        overflow-hidden
      `}
    >
      {/* Subtle top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/80" />

      {/* Top-left */}
      <div
        className={`
          flex
          flex-col
          items-start
          leading-none
          ${isRed ? "text-rose-600" : "text-zinc-900"}
        `}
      >
        <span className="text-sm sm:text-base font-black leading-none">
          {value}
        </span>

        <span className="text-xs sm:text-sm leading-none mt-0.5">
          {displaySuit}
        </span>
      </div>

      {/* Center */}
      <div className="flex items-center justify-center flex-1">
        <span
          className={`
            text-3xl
            sm:text-4xl
            font-normal
            leading-none
            ${isRed ? "text-rose-600" : "text-zinc-900"}
          `}
        >
          {displaySuit}
        </span>
      </div>

      {/* Bottom-right */}
      <div
        className={`
          flex
          flex-col
          items-end
          leading-none
          rotate-180
          ${isRed ? "text-rose-600" : "text-zinc-900"}
        `}
      >
        <span className="text-sm sm:text-base font-black leading-none">
          {value}
        </span>

        <span className="text-xs sm:text-sm leading-none mt-0.5">
          {displaySuit}
        </span>
      </div>
    </div>
  );
}
