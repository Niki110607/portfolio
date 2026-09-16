import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChessBoard from "../components/ChessBoard";

export default function ChessPage() {
  const [evalScore, setEvalScore] = useState(0.0);
  const [showEval, setShowEval] = useState(true);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [boardKey, setBoardKey] = useState(0);

  const handleReset = () => {
    setBoardKey((prev) => prev + 1);
    setEvalScore(0.0);
  };

  // Convert raw evaluation into a visual gauge position.
  const evalPercentage = Math.min(
    Math.max(((evalScore + 5) / 10) * 100, 5),
    95,
  );

  const formattedEval =
    evalScore > 0 ? `+${evalScore.toFixed(1)}` : evalScore.toFixed(1);

  return (
    <div
      data-theme="chess"
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
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[850px]
          h-[850px]
          rounded-full
          bg-[var(--color-accent-glow)]
          blur-[220px]
          opacity-20
          pointer-events-none
        "
      />

      {/* =========================================
          TOP HEADER
      ========================================== */}

      <header
        className="
          w-full
          max-w-5xl
          mx-auto
          px-6
          py-6
          flex
          items-center
          justify-between
          relative
          z-10
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
          MCTS + Transformer Engine
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

        <div
          className="
            text-center
            pt-10
            sm:pt-14
            pb-11
            sm:pb-13
          "
        >
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
            Transformer Chess Engine
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
            6.5M parameter neural network powered by Monte Carlo Tree Search
          </p>
        </div>

        {/* =========================================
            WORKSPACE LABEL
        ========================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
            px-1
          "
        >
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
            Board Workspace
          </span>

          <div className="flex items-center gap-2">
            <span
              className="
                w-2
                h-2
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
            HERO WORKSPACE
        ========================================== */}

        <section className="w-full">
          <div
            className="
              w-full
              max-w-2xl
              mx-auto
              flex
              items-stretch
              justify-center
              gap-4
              sm:gap-5
            "
          >
            {/* =====================================
                BOARD

                ChessBoard already owns its border,
                radius, shadow and corner markers.
                No extra wrapper here.
            ====================================== */}

            <div className="flex-1 min-w-0">
              <ChessBoard key={boardKey} onEvalUpdate={setEvalScore} />
            </div>

            {/* =====================================
                EVALUATION TELEMETRY
            ====================================== */}

            {showEval && (
              <aside
                className="
                  flex
                  w-11
                  sm:w-12
                  shrink-0
                  flex-col
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-zinc-800/80
                  bg-zinc-950/80
                  py-3
                  shadow-inner
                "
              >
                {/* Score */}
                <span
                  className="
                    text-[10px]
                    font-mono
                    font-bold
                    text-zinc-300
                  "
                >
                  {formattedEval}
                </span>

                {/* Gauge */}
                <div
                  className="
                    relative
                    my-2
                    flex-1
                    w-2
                    overflow-hidden
                    rounded-full
                    border
                    border-white/[0.04]
                    bg-zinc-900
                  "
                >
                  {/* Zero line */}
                  <div
                    className="
                      absolute
                      top-1/2
                      left-0
                      z-10
                      h-px
                      w-full
                      bg-zinc-500/50
                    "
                  />

                  {/* Evaluation fill */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-full
                      rounded-b-full
                      bg-[var(--color-accent)]
                      transition-all
                      duration-500
                      shadow-[0_0_10px_var(--color-accent-glow)]
                    "
                    style={{
                      height: `${evalPercentage}%`,
                    }}
                  />
                </div>

                <span
                  className="
                    text-[8px]
                    font-mono
                    uppercase
                    tracking-[0.16em]
                    text-zinc-600
                  "
                >
                  Eval
                </span>
              </aside>
            )}
          </div>
        </section>

        {/* =========================================
            FLAT TELEMETRY
        ========================================== */}

        <section
          className="
            w-full
            max-w-2xl
            mx-auto
            mt-8
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
            {/* Model */}
            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Model Size
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
                6.5M Params
              </div>
            </div>

            {/* Dataset */}
            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Dataset
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
                10M Positions
              </div>
            </div>

            {/* Speed */}
            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div
                className="
                  text-[9px]
                  font-mono
                  uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                Speed
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
                1,000 pos/sec
              </div>
            </div>

            {/* Strength */}
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
                Strength
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
                2200–2400 ELO
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CONTROLS
        ========================================== */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            sm:gap-3
            w-full
            max-w-2xl
            mx-auto
            mt-6
          "
        >
          <button
            onClick={handleReset}
            className="
              flex-1
              max-w-xs
              py-2.5
              px-4
              rounded-lg
              bg-zinc-900/80
              border
              border-zinc-800
              text-xs
              font-mono
              font-medium
              text-zinc-400
              hover:border-zinc-700
              hover:text-white
              transition-all
              active:scale-95
            "
          >
            Reset Position
          </button>

          <button
            onClick={() => setShowEval((prev) => !prev)}
            className={`
              flex-1
              max-w-xs
              py-2.5
              px-4
              rounded-lg
              border
              text-xs
              font-mono
              font-medium
              transition-all
              active:scale-95
              ${
                showEval
                  ? `
                    bg-[var(--color-accent-glow)]
                    border-[var(--color-accent)]/40
                    text-[var(--color-accent)]
                  `
                  : `
                    bg-zinc-900/80
                    border-zinc-800
                    text-zinc-400
                    hover:border-zinc-700
                    hover:text-white
                  `
              }
            `}
          >
            Evaluation: {showEval ? "On" : "Off"}
          </button>
        </div>

        {/* =========================================
            TECHNICAL DETAILS
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
              transition-colors
              hover:border-zinc-700
              hover:text-zinc-200
            "
          >
            <span>
              {showTechDetails ? "Hide Engine Specs" : "Inspect Engine Specs"}
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
            w-full
            bg-zinc-950/95
            border-t
            border-zinc-800/80
            backdrop-blur-xl
            relative
            z-10
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
                mb-7
                text-xs
                font-mono
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
                Transformer Architecture
              </button>

              <button
                onClick={() => setActiveTab("mcts")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition-colors
                  ${
                    activeTab === "mcts"
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                MCTS Integration
              </button>
            </div>

            {/* =====================================
                TRANSFORMER ARCHITECTURE
            ====================================== */}

            {activeTab === "overview" && (
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
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-mono
                      font-semibold
                      text-white
                    "
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Move Policy Head
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Outputs a probability distribution across legal candidate
                    move vectors to guide search priorities toward tactical
                    lines.
                  </p>
                </div>

                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-mono
                      font-semibold
                      text-white
                    "
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Value Evaluation Head
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Evaluates the 8x8 spatial board representation to produce
                    positional win probabilities and numerical evaluation
                    metrics.
                  </p>
                </div>
              </div>
            )}

            {/* =====================================
                MCTS
            ====================================== */}

            {activeTab === "mcts" && (
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
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-mono
                      font-semibold
                      text-white
                    "
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Branch Pruning
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Embeds neural priors directly into tree nodes to prune weak
                    tactical variations early and focus search depth on
                    promising lines.
                  </p>
                </div>

                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-mono
                      font-semibold
                      text-white
                    "
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    High Throughput
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Optimized vector evaluation loops enable real-time
                    calculations up to 1,000 positions per second during active
                    gameplay.
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
