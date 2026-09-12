import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChessBoard from "../components/ChessBoard";

export default function ChessPage() {
  const [evalScore, setEvalScore] = useState(0.0);
  const [showEval, setShowEval] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-color-main text-color-text flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <header className="border-b border-color-border/60 bg-color-secondary/80 px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium text-color-text/70 hover:text-color-accent transition flex items-center gap-2"
        >
          ← Back to Portfolio
        </Link>
      </header>

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Interactive Board & Controls (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col items-center bg-color-secondary border border-color-border/80 rounded-2xl p-10 shadow-xl w-full">
          {/* Board & Eval Bar Workspace */}
          <div className="flex flex-row items-center justify-center gap-4 w-full">
            {/* Chess Board Container */}
            <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg aspect-square rounded-xl overflow-hidden shadow-2xl border border-color-border/50">
              <ChessBoard onEvalUpdate={setEvalScore} />
            </div>

            {/* Evaluation Bar */}
            {showEval && (
              <div className="flex flex-col items-center self-stretch">
                <div className="relative w-3.5 flex-1 bg-color-main rounded-full overflow-hidden border border-color-border/60">
                  <div
                    className="absolute bottom-0 w-full bg-color-accent transition-all duration-500 rounded-b-full"
                    style={{
                      height: `${Math.min(
                        Math.max(((evalScore + 5) / 10) * 100, 5),
                        95,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="w-full max-w-xs sm:max-w-md flex items-center gap-3 mt-6">
            <button
              className="flex-1 py-2 px-4 bg-color-main/60 hover:border-color-accent border border-color-border/60 rounded-lg text-sm font-mono transition"
              onClick={() => window.location.reload()}
            >
              Reset Board
            </button>
            <button
              onClick={() => setShowEval((prev) => !prev)}
              className="flex-1 py-2 px-4 bg-color-main/60 hover:border-color-accent border border-color-border/60 rounded-lg text-sm font-mono transition"
            >
              {showEval ? "Hide Eval Bar" : "Show Eval Bar"}
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: Technical Showcase & Details (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Project Header Card */}
          <div className="bg-color-secondary border border-color-border/80 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Transformer Chess Engine
            </h1>
            <p className="text-sm text-color-text/70 leading-relaxed">
              A neural chess engine pairing a 6.5M parameter Transformer with
              Monte Carlo Tree Search (MCTS) to predict move policy
              distributions and positional evaluations.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Model Size
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  6.5M Params
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Dataset
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  10M Positions
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Search Speed
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  1,000 pos/sec
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Playing Strength
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  2200-2400 ELO
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Technical Deep-Dive Card */}
          <div className="bg-color-secondary border border-color-border/80 rounded-2xl p-6 shadow-xl">
            {/* Tab Controls */}
            <div className="flex border-b border-color-border/60 pb-3 gap-4 mb-4 text-sm font-mono">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "overview"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setActiveTab("mcts")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "mcts"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                MCTS Search
              </button>
            </div>

            {/* Tab 1: Architecture */}
            {activeTab === "overview" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  The engine processes raw 8x8 board states through a
                  Transformer encoder, producing dual outputs:
                </p>
                <ul className="list-disc pl-4 space-y-1 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Move Policy Head:
                    </strong>{" "}
                    Outputs a probability distribution across all theoretical
                    legal moves to prioritize high-value candidates.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Value Evaluation Head:
                    </strong>{" "}
                    Predicts expected win probability and numerical evaluation.
                  </li>
                </ul>
                <p>
                  Trained on <strong>10 million real Lichess positions</strong>,
                  capturing both tactical patterns and positional dynamics.
                </p>
              </div>
            )}

            {/* Tab 2: MCTS Search */}
            {activeTab === "mcts" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Instead of evaluating every node blindly, the engine embeds
                  model predictions directly into a custom{" "}
                  <strong>Monte Carlo Tree Search (MCTS)</strong> loop.
                </p>
                <ul className="list-disc pl-4 space-y-1 font-sans">
                  <li>
                    <strong className="text-color-text">Branch Pruning:</strong>{" "}
                    Uses the policy distribution to skip unpromising candidate
                    moves early.
                  </li>
                  <li>
                    <strong className="text-color-text">Throughput:</strong>{" "}
                    Evaluates ~1,000 positions per second during real-time
                    gameplay.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
