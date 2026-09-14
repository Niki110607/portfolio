import React, { useState } from "react";
import { Link } from "react-router-dom";
import CraftBoard from "../components/CraftBoard";

export default function InfinitePage() {
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
        {/* LEFT COLUMN: Interactive Crafting Board (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col items-center bg-color-secondary border border-color-border/80 rounded-2xl p-8 lg:p-10 shadow-xl w-full">
          <div className="w-full">
            <CraftBoard />
          </div>
        </section>

        {/* RIGHT COLUMN: Technical Showcase & Details (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Project Header Card */}
          <div className="bg-color-secondary border border-color-border/80 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Infinite-Craft Clone
            </h1>
            <p className="text-sm text-color-text/70 leading-relaxed">
              An element-combining sandbox environment powered by generative LLM
              combination logic and interactive drag-and-drop canvas physics.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Backend
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  FastAPI / LLM
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Database
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  SQLite
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Combinations
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  Dynamic
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Collision
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  AABB 2D
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
                onClick={() => setActiveTab("llm")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "llm"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                LLM Engine
              </button>
            </div>

            {/* Tab 1: Architecture */}
            {activeTab === "overview" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Combines front-end interactive canvas physics with dynamic
                  backend element predictions:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Canvas Physics & Collision:
                    </strong>{" "}
                    Implements AABB bounding-box collision detection to trigger
                    combinations when items intersect on drop.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Non-Blocking Locks:
                    </strong>{" "}
                    Applies pointer-events-none and visual indicators to
                    combining elements without freezing the remaining workspace.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      State Persistence:
                    </strong>{" "}
                    Discovered elements dynamically populate the sidebar
                    inventory for infinite chaining.
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 2: LLM Engine */}
            {activeTab === "llm" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Handles real-time concept synthesis through generative model
                  inference and persistent caching:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Generative Prediction:
                    </strong>{" "}
                    Prompt-engineered language models output structured JSON
                    containing the combined element's name and representative
                    emoji.
                  </li>
                  <li>
                    <strong className="text-color-text">SQLite Caching:</strong>{" "}
                    Stores previously generated element pairs to ensure instant
                    response times for recurring combinations.
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
