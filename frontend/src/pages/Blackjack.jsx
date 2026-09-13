import React, { useState } from "react";
import { Link } from "react-router-dom";
import PlayingBoard from "../components/PlayingBoard";

export default function BlackjackPage() {
  const [hintData, setHintData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const actionLabels = ["Stand", "Hit", "Double", "Split"];

  const handleData = (data) => {
    if (data && data.q_values) {
      setHintData(data);
    }
  };

  // Action Masking & Softmax Relative Weight Calculation
  const getAnalysis = () => {
    if (!hintData || !hintData.q_values) return null;

    const { q_values: qValues, validActions } = hintData;

    // Action validity mask: Stand and Hit are always valid during play; Double and Split depend on hand state
    const validFlags = [
      true,
      true,
      validActions ? Boolean(validActions.double) : true,
      validActions ? Boolean(validActions.split) : true,
    ];

    // Mask Q-values for illegal actions (-Infinity) to compute optimal move
    const maskedQValues = qValues.map((q, idx) =>
      validFlags[idx] ? q : -Infinity,
    );
    const maxQ = Math.max(...maskedQValues);
    const bestActionIdx = maskedQValues.indexOf(maxQ);

    // Numerically stable masked Softmax computation over legal actions
    const validQValues = qValues.filter((_, idx) => validFlags[idx]);
    const maxValidQ = Math.max(...validQValues);

    const expValues = qValues.map((q, idx) =>
      validFlags[idx] ? Math.exp(q - maxValidQ) : 0,
    );
    const sumExp = expValues.reduce((sum, val) => sum + val, 0);

    const probabilities = expValues.map((exp, idx) =>
      validFlags[idx] && sumExp > 0 ? exp / sumExp : 0,
    );

    return {
      bestActionIdx: maxQ === -Infinity ? -1 : bestActionIdx,
      probabilities,
      validFlags,
    };
  };

  const analysis = getAnalysis();

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
        {/* LEFT COLUMN: Interactive Playing Board & Minimal Model Output (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col items-center bg-color-secondary border border-color-border/80 rounded-2xl p-8 lg:p-10 shadow-xl w-full">
          {/* Section Heading */}
          <div className="w-full mb-6 border-b border-color-border/40 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Play Blackjack
            </h2>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            {/* Playing Board Workspace */}
            <div className="w-full flex justify-center">
              <PlayingBoard onHint={handleData} />
            </div>

            {/* Minimal Live Model Recommendation Card */}
            <div className="w-full bg-color-main/60 border border-color-border/60 p-5 rounded-xl flex flex-col gap-4">
              {/* Card Header & Dominant Recommendation Badge */}
              <div className="flex items-center justify-between border-b border-color-border/40 pb-3">
                <span className="text-xs font-mono text-color-text/50 uppercase tracking-wider">
                  DQN Action Policy
                </span>

                {analysis && analysis.bestActionIdx !== -1 ? (
                  <span className="text-xs font-mono font-bold text-color-accent bg-color-accent/10 px-3 py-1 rounded-full border border-color-accent/30 uppercase tracking-wider">
                    Optimal: {actionLabels[analysis.bestActionIdx]}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-color-text/40">
                    Click "Hint" during turn
                  </span>
                )}
              </div>

              {/* Minimal Action Visual Bars */}
              <div className="flex flex-col gap-2.5">
                {actionLabels.map((action, idx) => {
                  const isLegal = analysis ? analysis.validFlags[idx] : true;
                  const isBest =
                    analysis && analysis.bestActionIdx === idx && isLegal;
                  const prob = analysis ? analysis.probabilities[idx] : 0;

                  return (
                    <div
                      key={action}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        !isLegal
                          ? "opacity-30 bg-color-secondary/10"
                          : isBest
                            ? "bg-color-secondary border border-color-accent/40 shadow-sm"
                            : "bg-color-secondary/30"
                      }`}
                    >
                      {/* Action Label */}
                      <span
                        className={`w-16 text-xs font-mono uppercase ${
                          isBest
                            ? "font-bold text-color-accent"
                            : isLegal
                              ? "font-semibold text-color-text/80"
                              : "text-color-text/40"
                        }`}
                      >
                        {action}
                      </span>

                      {/* Visual Relative Probability Bar */}
                      <div className="flex-1 bg-color-main h-2 rounded-full overflow-hidden border border-color-border/40">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isBest
                              ? "bg-color-accent"
                              : isLegal
                                ? "bg-color-text/40"
                                : "bg-transparent"
                          }`}
                          style={{
                            width: `${isLegal ? (prob * 100).toFixed(1) : 0}%`,
                          }}
                        />
                      </div>

                      {/* Status Tag for N/A Actions */}
                      {!isLegal && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                          N/A
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Technical Showcase & Details (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Project Header Card */}
          <div className="bg-color-secondary border border-color-border/80 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Blackjack RL Agent
            </h1>
            <p className="text-sm text-color-text/70 leading-relaxed">
              A fullstack Reinforcement Learning project featuring a Deep
              Q-Network (DQN) agent trained to play Blackjack optimally in a
              custom Gymnasium environment supporting splits and double downs.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Training
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  3M Hands
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Winrate
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  43.7%
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Expected Value
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  ~0.00 EV
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Framework
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  PyTorch
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
                onClick={() => setActiveTab("env")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "env"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                Environment
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "performance"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                Performance
              </button>
            </div>

            {/* Tab 1: Architecture */}
            {activeTab === "overview" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Implements a Deep Q-Network (DQN) designed to approximate
                  optimal state-action value functions across complex hand
                  configurations:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Experience Replay:
                    </strong>{" "}
                    Stores state transitions in a replay buffer to break
                    temporal correlations between consecutive steps.
                  </li>
                  <li>
                    <strong className="text-color-text">Target Network:</strong>{" "}
                    Uses a periodically synchronized target network to stabilize
                    temporal-difference target values during optimization.
                  </li>
                  <li>
                    <strong className="text-color-text">Action Masking:</strong>{" "}
                    Filters out illegal actions (Double/Split after initial
                    moves) prior to policy recommendation inference.
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 2: Environment */}
            {activeTab === "env" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  A custom Gymnasium-inspired environment built to accommodate
                  extended action rulesets and tailored reward structures:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Extended Action Space:
                    </strong>{" "}
                    Supports standard Stand (S) and Hit (H) alongside Double
                    Down (D) and Pair Splitting (P).
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Ruleset Configuration:
                    </strong>{" "}
                    Single deck reshuffled every deal, dealer stands on soft 17,
                    and natural Blackjacks pay out at 3:2.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Reward Alignment:
                    </strong>{" "}
                    Calibrated terminal payoffs directly reflecting expected
                    monetary returns per unit bet.
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 3: Performance */}
            {activeTab === "performance" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  After 3 million training hands, the agent converged to optimal
                  play matching mathematical basic strategy:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">Winrate & EV:</strong>{" "}
                    Achieves a 43.7% winrate with an expected value near zero
                    (~0.00 EV), effectively eliminating house edge.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Strategy Convergence:
                    </strong>{" "}
                    Learned Q-table outputs for all action combinations mirror
                    statistically proven basic strategy tables.
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
