import React, { useState } from "react";
import { Link } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";

export default function CnnPage() {
  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState(Array(10).fill(0));
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handlePrediction = (data) => {
    if (data) {
      setPrediction(data.digit);
      setProbabilities(data.probabilities || Array(10).fill(0));
    }
  };

  const handleClear = () => {
    setPrediction(null);
    setProbabilities(Array(10).fill(0));
  };

  const maxConfidence =
    prediction !== null ? (probabilities[prediction] * 100).toFixed(1) : 0;

  return (
    <div
      data-theme="cnn"
      className="min-h-screen bg-[var(--bg-main)] text-[var(--color-text)] flex flex-col font-sans selection:bg-[var(--color-accent-glow)] selection:text-[var(--color-accent)] relative overflow-x-hidden"
    >
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
            CNN Vision Engine
          </span>
        </div>
      </header>

      {/* MAIN WORKBENCH STAGE */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 flex flex-col items-center justify-center relative z-10 py-10">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Handwritten Digit Classifier
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Custom neural network built with pure NumPy
          </p>
        </div>

        {/* Studio Center Stage */}
        <div className="w-full flex flex-col items-center gap-14">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
            <DrawingCanvas
              onPrediction={handlePrediction}
              onClear={handleClear}
            />

            <div className="flex flex-col items-center md:items-start min-w-[200px] border-t md:border-t-0 md:border-l border-zinc-800/80 pt-6 md:pt-0 md:pl-12">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                Inference Output
              </span>

              <div
                className={`flex flex-col items-center md:items-start transition-opacity duration-200 min-h-[140px] ${
                  prediction !== null
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-8xl sm:text-9xl font-mono font-black text-white tracking-tighter leading-none">
                  {prediction !== null ? prediction : "0"}
                </span>

                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] border border-[var(--color-accent)]/30">
                  <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                    {maxConfidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl pt-10 border-t border-zinc-800/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-4 px-1">
              <span>Probability Spectrum</span>
              <span>Digits (0 – 9)</span>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {probabilities.map((prob, idx) => {
                const isTop = prediction === idx;
                const pct = Math.round(prob * 100);

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-full h-20 bg-zinc-900/90 rounded-lg overflow-hidden relative border border-white/5 flex items-end p-0.5">
                      <div
                        className={`w-full rounded-sm transition-all duration-300 ${
                          isTop
                            ? "bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]"
                            : "bg-zinc-700/40 group-hover:bg-zinc-600"
                        }`}
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-mono transition-colors ${
                        isTop
                          ? "font-bold text-[var(--color-accent)]"
                          : "text-zinc-500"
                      }`}
                    >
                      {idx}
                    </span>

                    <span className="text-[9px] font-mono text-zinc-600 hidden sm:block">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowTechDetails((prev) => !prev)}
          className="mt-16 text-xs font-mono text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2 py-2 px-4 rounded-full border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40"
        >
          <span>
            {showTechDetails
              ? "Hide Architecture Specs"
              : "Inspect Architecture Specs"}
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

      {showTechDetails && (
        <footer className="w-full bg-zinc-950/90 border-t border-zinc-800/80 backdrop-blur-xl relative z-10 py-10 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-400">
            <div className="space-y-2">
              <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                Network Pipeline
              </div>
              <p className="leading-relaxed">
                Processes 28x28 grayscale inputs through 3x3 Conv kernels,
                MaxPool downsampling, and Dense Softmax layers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Vectorization
              </div>
              <p className="leading-relaxed">
                Uses <code className="text-zinc-200 font-mono">im2col</code>{" "}
                memory flattening to transform multi-dimensional sliding
                convolutions into accelerated matrix multiplications.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Model Metrics
              </div>
              <div className="font-mono space-y-1 text-[11px] text-zinc-300 pt-1">
                <div className="flex justify-between border-b border-zinc-800/60 pb-1">
                  <span>Accuracy:</span>
                  <span className="text-emerald-400">98.8%</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-1">
                  <span>Loss Function:</span>
                  <span>Cross-Entropy</span>
                </div>
                <div className="flex justify-between">
                  <span>Optimizer:</span>
                  <span>Adam</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
