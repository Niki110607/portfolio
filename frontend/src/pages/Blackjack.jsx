import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PlayingBoard from "../components/PlayingBoard";

export default function BlackjackPage() {
  const [hintData, setHintData] = useState(null);
  const [showPolicy, setShowPolicy] = useState(true);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const actionLabels = ["Stand", "Hit", "Double", "Split"];

  const handleData = (data) => {
    if (data && data.q_values) {
      setHintData(data);
    }
  };

  const analysis = useMemo(() => {
    if (!hintData?.q_values) return null;

    const qValues = hintData.q_values;
    const validActions = hintData.validActions || {};

    const validFlags = [
      true,
      true,
      Boolean(validActions.double ?? true),
      Boolean(validActions.split ?? true),
    ];

    const maskedQValues = qValues.map((q, index) =>
      validFlags[index] ? q : -Infinity,
    );

    const maxQ = Math.max(...maskedQValues);
    const bestActionIdx = maxQ === -Infinity ? -1 : maskedQValues.indexOf(maxQ);

    const validQValues = qValues.filter((_, index) => validFlags[index]);
    const maxValidQ = Math.max(...validQValues);

    const expValues = qValues.map((q, index) =>
      validFlags[index] ? Math.exp(q - maxValidQ) : 0,
    );

    const sumExp = expValues.reduce((sum, value) => sum + value, 0);

    const probabilities = expValues.map((value, index) =>
      validFlags[index] && sumExp > 0 ? value / sumExp : 0,
    );

    return {
      bestActionIdx,
      probabilities,
      validFlags,
    };
  }, [hintData]);

  return (
    <div
      data-theme="casino"
      className="
        min-h-screen
        bg-[var(--bg-main,#09090b)]
        text-[var(--color-text,#f4f4f5)]
        flex flex-col
        font-sans
        selection:bg-emerald-500/20
        selection:text-emerald-400
        relative
        overflow-x-hidden
      "
    >
      {/* Ambient system glow */}
      <div
        className="
          fixed
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[900px]
          h-[900px]
          rounded-full
          bg-emerald-500/[0.035]
          blur-[220px]
          pointer-events-none
        "
      />

      {/* Top navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between relative z-10">
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

        <span className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-[0.18em]">
          DQN + Gymnasium Engine
        </span>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 pb-16 relative z-10">
        {/* Page heading */}
        <div className="text-center pt-10 sm:pt-14 pb-10 sm:pb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-white">
            Deep Q-Network Blackjack
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono">
            Reinforcement Learning agent trained on 3M hands in custom Gym
            environment
          </p>
        </div>

        {/* Workspace header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-[0.14em]">
            Table Workspace
          </span>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">Engine Ready</span>
          </div>
        </div>

        {/* Main workspace */}
        <section
          className="
            w-full
            border-t
            border-b
            border-zinc-800/80
            py-4
            sm:py-5
          "
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px]">
            {/* Game stage */}
            <div className="min-w-0 pr-0 lg:pr-7">
              <PlayingBoard onHint={handleData} />
            </div>

            {/* Policy telemetry rail */}
            <aside
              className={`
                ${showPolicy ? "block" : "hidden"}
                mt-5
                lg:mt-0
                lg:border-l
                border-zinc-800/80
                pt-6
                lg:pt-2
                lg:pl-6
              `}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.14em]">
                  AI Policy
                </span>

                {analysis && analysis.bestActionIdx !== -1 ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    Live
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    Waiting
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {actionLabels.map((action, index) => {
                  const isLegal = analysis ? analysis.validFlags[index] : true;

                  const isBest =
                    analysis && analysis.bestActionIdx === index && isLegal;

                  const probability = analysis
                    ? analysis.probabilities[index]
                    : 0;

                  const percentage = isLegal
                    ? Math.round(probability * 100)
                    : 0;

                  return (
                    <div key={action}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`
                            text-[10px]
                            font-mono
                            uppercase
                            tracking-wider
                            ${
                              isBest
                                ? "text-emerald-400 font-bold"
                                : isLegal
                                  ? "text-zinc-300"
                                  : "text-zinc-700"
                            }
                          `}
                        >
                          {action}
                        </span>

                        <span
                          className={`
                            text-[10px]
                            font-mono
                            ${
                              isBest
                                ? "text-emerald-400 font-bold"
                                : isLegal
                                  ? "text-zinc-500"
                                  : "text-zinc-700"
                            }
                          `}
                        >
                          {!isLegal ? "N/A" : `${percentage}%`}
                        </span>
                      </div>

                      <div className="h-1 bg-zinc-900 overflow-hidden rounded-full">
                        <div
                          className={`
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                            ${
                              isBest
                                ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                : isLegal
                                  ? "bg-zinc-700"
                                  : "bg-transparent"
                            }
                          `}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-800/70">
                <span className="block text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-600 mb-2">
                  Recommendation
                </span>

                <div className="text-xl font-mono font-bold text-white">
                  {analysis && analysis.bestActionIdx !== -1
                    ? actionLabels[analysis.bestActionIdx]
                    : "—"}
                </div>

                <p className="mt-2 text-[10px] leading-relaxed text-zinc-600 font-mono">
                  Ask the trained agent for its current action distribution.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Policy visibility control */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowPolicy((prev) => !prev)}
            className={`
              text-[10px]
              sm:text-xs
              font-mono
              uppercase
              tracking-wider
              py-2
              px-4
              border
              rounded-full
              transition-all
              ${
                showPolicy
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/[0.05]"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700"
              }
            `}
          >
            {showPolicy ? "Hide Policy HUD" : "Show Policy HUD"}
          </button>
        </div>

        {/* Flat telemetry strip */}
        <div
          className="
            w-full
            max-w-5xl
            mx-auto
            mt-10
            py-5
            border-y
            border-zinc-800/70
            grid
            grid-cols-2
            sm:grid-cols-4
            gap-y-5
            sm:gap-y-0
          "
        >
          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              Training Volume
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              3.0M Hands
            </div>
          </div>

          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              Win Rate
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              43.7%
            </div>
          </div>

          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              Expected Return
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-emerald-400">
              ~0.00 EV
            </div>
          </div>

          <div className="text-center">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              Framework
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              PyTorch / Gym
            </div>
          </div>
        </div>

        {/* Technical details trigger */}
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
              border-zinc-800
              hover:border-zinc-700
              bg-zinc-900/30
            "
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
        </div>
      </main>

      {/* Technical drawer */}
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
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="flex overflow-x-auto border-b border-zinc-800/80 gap-6 text-xs font-mono mb-6">
              {[
                ["overview", "DQN Architecture"],
                ["env", "Gym Environment"],
                ["performance", "Strategy Convergence"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`
                    pb-3
                    whitespace-nowrap
                    border-b-2
                    transition
                    ${
                      activeTab === id
                        ? "border-emerald-400 text-emerald-400 font-bold"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-400">
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Replay Memory Buffer
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Stores 100,000 state transitions to sample decorrelated
                    minibatches during gradient updates, stabilizing temporal
                    Q-learning.
                  </p>
                </div>

                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Dynamic Action Masking
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Evaluates valid hand flags prior to Softmax calculation,
                    zeroing out illegal actions like Double Down or Split after
                    the initial draw.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "env" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-400">
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Extended Ruleset Gym
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Custom Gymnasium environment built with full rule mechanics:
                    Stand, Hit, Double Down, and Pair Splitting with dealer
                    standing on soft 17.
                  </p>
                </div>

                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    3:2 Reward Calibration
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Terminal payoffs directly model casino-style expected
                    returns per unit bet, including standard bonuses on natural
                    Blackjacks.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-400">
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Basic Strategy Mirroring
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Learned policy outputs converge toward established Blackjack
                    basic strategy decisions across the represented state space.
                  </p>
                </div>

                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Expected Return
                  </div>
                  <p className="mt-2 leading-relaxed">
                    Training reduces sub-optimal player decisions and drives the
                    learned policy toward its long-run reward baseline.
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
