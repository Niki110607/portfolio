import React, { useState } from "react";
import { Link } from "react-router-dom";
import CraftBoard from "../components/CraftBoard";

export default function InfinitePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div
      data-theme="craft"
      className="
        min-h-screen
        bg-[var(--bg-main,#09090b)]
        text-[var(--color-text,#f4f4f5)]
        flex
        flex-col
        font-sans
        selection:bg-[var(--color-accent-glow)]
        selection:text-[var(--color-accent)]
        relative
        overflow-x-hidden
      "
    >
      {/* =========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <div
        className="
          fixed
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          h-[850px]
          w-[850px]
          rounded-full
          bg-[var(--color-accent-glow)]
          opacity-20
          blur-[220px]
          pointer-events-none
        "
      />

      {/* =========================================
          TOP NAVIGATION
      ========================================== */}

      <header
        className="
          relative
          z-10
          w-full
          max-w-5xl
          mx-auto
          px-6
          py-6
          flex
          items-center
          justify-between
        "
      >
        <Link
          to="/"
          className="
            group
            flex
            items-center
            gap-2
            text-xs
            font-mono
            text-zinc-500
            transition-colors
            hover:text-white
          "
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          <span>Portfolio</span>
        </Link>

        <span
          className="
            text-[10px]
            sm:text-xs
            font-mono
            uppercase
            tracking-[0.16em]
            text-zinc-400
          "
        >
          LLM + Canvas Engine
        </span>
      </header>

      {/* =========================================
          MAIN
      ========================================== */}

      <main
        className="
          relative
          z-10
          flex-1
          w-full
          max-w-5xl
          mx-auto
          px-6
          pb-16
        "
      >
        {/* =========================================
            PROJECT INTRO
        ========================================== */}

        <div className="text-center pt-10 sm:pt-14 pb-10 sm:pb-12">
          <h1
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              font-extrabold
              tracking-[-0.04em]
              text-white
            "
          >
            Infinite Craft
          </h1>

          <p
            className="
              mt-3
              text-xs
              sm:text-sm
              font-mono
              text-zinc-400
            "
          >
            Generative element-combination sandbox powered by an LLM
          </p>
        </div>

        {/* =========================================
            WORKSPACE LABEL
        ========================================== */}

        <div className="flex items-center justify-between mb-3 px-1">
          <span
            className="
              text-[10px]
              sm:text-[11px]
              font-mono
              uppercase
              tracking-[0.14em]
              text-zinc-500
            "
          >
            Craft Workspace
          </span>

          <div className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[var(--color-accent)]
                animate-pulse
                shadow-[0_0_10px_var(--color-accent-glow)]
              "
            />

            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300">
              Engine Ready
            </span>
          </div>
        </div>

        {/* =========================================
            HERO CRAFT BOARD
        ========================================== */}

        <section className="w-full">
          <CraftBoard />
        </section>

        {/* =========================================
            FLAT SYSTEM TELEMETRY
        ========================================== */}

        <section
          className="
            w-full
            mt-10
            py-5
            border-y
            border-zinc-800/70
          "
        >
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-4
              gap-y-5
              sm:gap-y-0
            "
          >
            {/* Backend */}
            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Backend
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  font-mono
                  font-bold
                  text-white
                "
              >
                FastAPI / LLM
              </div>
            </div>

            {/* Database */}
            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Database
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  font-mono
                  font-bold
                  text-white
                "
              >
                SQLite
              </div>
            </div>

            {/* Combination */}
            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Combinations
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  font-mono
                  font-bold
                  text-white
                "
              >
                Dynamic
              </div>
            </div>

            {/* Physics */}
            <div className="text-center">
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Physics
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  font-mono
                  font-bold
                  text-[var(--color-accent)]
                "
              >
                AABB 2D
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            TECHNICAL DETAILS TRIGGER
        ========================================== */}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowTechDetails((prev) => !prev)}
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-zinc-800
              bg-zinc-900/30
              px-4
              py-2
              text-xs
              font-mono
              text-zinc-500
              transition-all
              hover:border-zinc-700
              hover:text-zinc-200
            "
          >
            <span>
              {showTechDetails ? "Hide System Specs" : "Inspect System Specs"}
            </span>

            <span
              className={`
                transition-transform
                duration-200
                ${showTechDetails ? "rotate-180" : ""}
              `}
            >
              ↓
            </span>
          </button>
        </div>
      </main>

      {/* =========================================
          TECHNICAL DRAWER
      ========================================== */}

      {showTechDetails && (
        <footer
          className="
            relative
            z-10
            w-full
            border-t
            border-zinc-800/80
            bg-zinc-950/95
            backdrop-blur-xl
            py-10
          "
        >
          <div className="max-w-5xl mx-auto px-6">
            {/* Tabs */}
            <div
              className="
                flex
                gap-6
                overflow-x-auto
                border-b
                border-zinc-800/80
                text-xs
                font-mono
                mb-7
              "
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition-colors
                  ${
                    activeTab === "overview"
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                Architecture
              </button>

              <button
                onClick={() => setActiveTab("llm")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition-colors
                  ${
                    activeTab === "llm"
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                LLM Engine
              </button>
            </div>

            {/* =====================================
                ARCHITECTURE
            ====================================== */}

            {activeTab === "overview" && (
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-8
                  text-xs
                  text-zinc-400
                "
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    Canvas Physics
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Uses AABB bounding-box collision detection to identify
                    element intersections when items are dropped into the
                    workspace.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Non-Blocking Locks
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Combining elements become temporarily locked while the
                    remaining workspace stays interactive.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    State Persistence
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Newly discovered elements are added to the inventory so they
                    can participate in future combinations.
                  </p>
                </div>
              </div>
            )}

            {/* =====================================
                LLM ENGINE
            ====================================== */}

            {activeTab === "llm" && (
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-8
                  text-xs
                  text-zinc-400
                "
              >
                <div>
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    Generative Prediction
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Concept pairs are sent to the backend where a language model
                    generates the resulting element name and representative
                    emoji.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-mono font-semibold text-white">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    SQLite Cache
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Previously generated combinations can be cached so recurring
                    element pairs do not need to be regenerated.
                  </p>
                </div>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
