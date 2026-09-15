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

  // Convert raw eval score (-10 to +10 range) into gauge percentage (5% to 95%)
  const evalPercentage = Math.min(
    Math.max(((evalScore + 5) / 10) * 100, 5),
    95,
  );

  return (
    <div
      data-theme="chess"
      className="min-h-screen bg-[var(--bg-main,#09090b)] text-[var(--color-text,#f4f4f5)] flex flex-col font-sans selection:bg-[var(--color-accent-glow)] selection:text-[var(--color-accent)] relative overflow-x-hidden"
    >
      {/* Ambient Background Radial Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-accent-glow)] blur-[220px] opacity-20 pointer-events-none" />

      {/* Minimal Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Portfolio
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            MCTS + Transformer Engine
          </span>
        </div>
      </header>

      {/* CENTER STAGE WORKBENCH */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 flex flex-col items-center justify-center relative z-10 py-6">
        {/* Page Title Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Transformer Chess Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            6.5M parameter neural network powered by Monte Carlo Tree Search
          </p>
        </div>

        {/* Hero Board Stage */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Workspace Status Bar */}
          <div className="flex items-center justify-between w-full max-w-xl text-[11px] font-mono text-zinc-500 px-1">
            <span>BOARD WORKSPACE</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="text-zinc-300">Engine Ready</span>
            </div>
          </div>

          {/* Centered Board + Telemetry Eval Gauge */}
          <div className="flex flex-row items-stretch justify-center gap-4 sm:gap-6 w-full max-w-xl">
            {/* Expanded Hero Chessboard */}
            <div className="flex-1 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 bg-black">
              <ChessBoard key={boardKey} onEvalUpdate={setEvalScore} />
            </div>

            {/* Vertical Telemetry Evaluation Bar */}
            {showEval && (
              <div className="flex flex-col items-center justify-between w-10 py-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-inner relative">
                {/* Floating Score Readout */}
                <span className="text-[10px] font-mono font-bold text-zinc-300 z-10">
                  {evalScore > 0
                    ? `+${evalScore.toFixed(1)}`
                    : evalScore.toFixed(1)}
                </span>

                {/* Vertical Gauge Channel */}
                <div className="w-2 flex-1 bg-zinc-900 rounded-full overflow-hidden relative my-2 border border-white/5">
                  <div className="absolute top-1/2 w-full h-[1px] bg-zinc-500/60 z-10" />
                  <div
                    className="absolute bottom-0 w-full bg-[var(--color-accent)] transition-all duration-500 rounded-b-full shadow-[0_0_10px_var(--color-accent)]"
                    style={{ height: `${evalPercentage}%` }}
                  />
                </div>

                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">
                  EVAL
                </span>
              </div>
            )}
          </div>

          {/* Compact Telemetry Badge Bar (Replaces cluttered text boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl pt-2">
            <div className="bg-zinc-900/50 border border-zinc-800/60 px-3 py-2 rounded-xl text-center">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">
                Model Size
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                6.5M Params
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/60 px-3 py-2 rounded-xl text-center">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">
                Dataset
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                10M Positions
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/60 px-3 py-2 rounded-xl text-center">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">
                Speed
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                1,000 pos/sec
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/60 px-3 py-2 rounded-xl text-center">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">
                Strength
              </div>
              <div className="text-xs font-mono font-bold font-mono text-[var(--color-accent)] mt-0.5">
                2200-2400 ELO
              </div>
            </div>
          </div>

          {/* Action Control Pills */}
          <div className="flex items-center gap-3 w-full max-w-xl mt-1">
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

        {/* Technical Specs Toggle Button (Identical to CNN page) */}
        <button
          onClick={() => setShowTechDetails((prev) => !prev)}
          className="mt-12 text-xs font-mono text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2 py-2 px-4 rounded-full border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40"
        >
          <span>
            {showTechDetails ? "Hide Engine Specs" : "Inspect Engine Specs"}
          </span>
          <span
            className={`transition-transform duration-200 ${
              showTechDetails ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </button>
      </main>

      {/* Collapsible Architecture Footer */}
      {showTechDetails && (
        <footer className="w-full bg-zinc-950/90 border-t border-zinc-800/80 backdrop-blur-xl relative z-10 py-10 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto px-6">
            {/* Footer Tab Headers */}
            <div className="flex border-b border-zinc-800/80 pb-3 gap-6 text-xs font-mono mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "overview"
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Transformer Architecture
              </button>
              <button
                onClick={() => setActiveTab("mcts")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "mcts"
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                MCTS Integration
              </button>
            </div>

            {/* Tab 1: Architecture */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
                <div className="space-y-2">
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Move Policy Head
                  </div>
                  <p className="leading-relaxed">
                    Outputs a probability distribution across all legal
                    candidate move vectors to guide search priorities toward
                    optimal tactical lines.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Value Evaluation Head
                  </div>
                  <p className="leading-relaxed">
                    Evaluates raw 8x8 spatial board state tensors to predict
                    positional win probabilities and precise numerical eval
                    metrics.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: MCTS */}
            {activeTab === "mcts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
                <div className="space-y-2">
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    Branch Pruning
                  </div>
                  <p className="leading-relaxed">
                    Embeds neural priors directly into tree nodes to prune weak
                    tactical variations early and focus search depth on winning
                    lines.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    High Throughput
                  </div>
                  <p className="leading-relaxed">
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
