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
      {/* Ambient engine glow */}
      <div
        className="
          fixed
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[800px]
          h-[800px]
          rounded-full
          bg-[var(--color-accent-glow)]
          blur-[220px]
          opacity-15
          pointer-events-none
        "
      />

      {/* =========================================
          TOP HEADER
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
            text-xs
            font-mono
            text-zinc-500
            hover:text-white
            transition-colors
            flex
            items-center
            gap-2
            group
          "
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Portfolio
        </Link>

        <span
          className="
            text-[10px]
            sm:text-xs
            font-mono
            text-zinc-400
            uppercase
            tracking-[0.16em]
          "
        >
          MCTS + Transformer Engine
        </span>
        <a
          href="https://github.com/Niki110607/chess_ai"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.78-1.34-1.78-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 7.03c1.02 0 2.05.14 3.01.42 2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z" />
          </svg>

          <span>GitHub</span>
          <span className="text-[10px]">↗</span>
        </a>
      </header>

      {/* =========================================
          MAIN
      ========================================== */}

      <main
        className="
          flex-1
          relative
          z-10
          w-full
          max-w-5xl
          mx-auto
          px-6
          pb-16
        "
      >
        {/* =========================================
            PROJECT TITLE
        ========================================== */}

        <div
          className="
            text-center
            pt-10
            sm:pt-12
            pb-9
            sm:pb-10
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
              text-zinc-400
              font-mono
            "
          >
            6.5M parameter neural network powered by Monte Carlo Tree Search
          </p>
        </div>

        {/* =========================================
            WORKSPACE HEADER
        ========================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-1
            pb-3
            border-b
            border-zinc-800/80
          "
        >
          <span
            className="
              text-[10px]
              sm:text-[11px]
              font-mono
              text-zinc-500
              uppercase
              tracking-[0.14em]
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

            <span
              className="
                text-[10px]
                sm:text-[11px]
                font-mono
                text-zinc-300
              "
            >
              Engine Ready
            </span>
          </div>
        </div>

        {/* =========================================
            BOARD WORKSPACE
        ========================================== */}

        <section className="w-full pt-5">
          <div className="w-full max-w-xl mx-auto">
            <div
              className="
                flex
                items-stretch
                justify-center
                gap-3
                sm:gap-4
                w-full
              "
            >
              {/* Chessboard */}
              <div className="min-w-0 flex-1">
                <ChessBoard key={boardKey} onEvalUpdate={setEvalScore} />
              </div>

              {/* =====================================
                  ENGINE EVALUATION RAIL
              ====================================== */}

              {showEval && (
                <div
                  className="
                    w-10
                    sm:w-11
                    shrink-0
                    flex
                    flex-col
                    items-center
                    justify-between
                    py-3
                    rounded-xl
                    border
                    border-zinc-800/80
                    bg-zinc-950/80
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
                      leading-none
                    "
                  >
                    {formattedEval}
                  </span>

                  {/* Gauge */}
                  <div
                    className="
                      relative
                      my-3
                      w-[6px]
                      flex-1
                      min-h-[170px]
                      rounded-full
                      bg-zinc-900
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-3
                        h-px
                        bg-zinc-600
                        z-10
                      "
                    />

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        w-full
                        rounded-full
                        bg-[var(--color-accent)]
                        transition-all
                        duration-500
                        shadow-[0_0_10px_var(--color-accent)]
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
                      text-zinc-600
                      uppercase
                      tracking-[0.1em]
                    "
                  >
                    EVAL
                  </span>
                </div>
              )}
            </div>

            {/* =========================================
                VISIBLE CONTROLS
            ========================================== */}

            {/* Action Control Pills */}
            <div className="flex items-center gap-5 w-full max-w-xl mt-5">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white transition active:scale-95"
              >
                Reset Board
              </button>

              <button
                onClick={() => setShowEval((prev) => !prev)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-mono font-medium transition active:scale-95 ${
                  showEval
                    ? "bg-[var(--color-accent-glow)] border-[var(--color-accent)]/40 text-[var(--color-accent)]"
                    : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                {showEval ? "Hide Evaluation" : "Show Evaluation"}
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            MODEL TELEMETRY
        ========================================== */}

        <section
          className="
            w-full
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
            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
                Model Size
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                6.5M Params
              </div>
            </div>

            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
                Dataset
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                10M Positions
              </div>
            </div>

            <div
              className="
                text-center
                sm:border-r
                border-zinc-800/70
              "
            >
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
                Speed
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                1,000 pos/sec
              </div>
            </div>

            <div className="text-center">
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
                Strength
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-[var(--color-accent)]">
                2200–2400 ELO
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            TECHNICAL DETAILS
        ========================================== */}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowTechDetails((prev) => !prev)}
            className="
              text-xs
              font-mono
              text-zinc-500
              hover:text-zinc-200
              transition-colors
              flex
              items-center
              gap-2
              py-2
              px-4
              rounded-full
              border
              border-zinc-800/80
              hover:border-zinc-700
              bg-zinc-900/40
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
            bg-zinc-950/90
            border-t
            border-zinc-800/80
            backdrop-blur-xl
            relative
            z-10
            py-10
          "
        >
          <div className="max-w-5xl mx-auto px-6">
            <div
              className="
                flex
                overflow-x-auto
                gap-6
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
                  pb-3
                  border-b-2
                  transition
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
                  pb-3
                  border-b-2
                  transition
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
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Move Policy Head
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Outputs a probability distribution across all legal
                    candidate move vectors to guide search priorities toward
                    optimal tactical lines.
                  </p>
                </div>

                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Value Evaluation Head
                  </div>

                  <p className="mt-2 leading-relaxed">
                    Evaluates raw 8x8 spatial board state tensors to predict
                    positional win probabilities and precise numerical
                    evaluation metrics.
                  </p>
                </div>
              </div>
            )}

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
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
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
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
