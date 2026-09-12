import React, { useState } from "react";
import { Link } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";

export default function CnnPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState(Array(10).fill(0));

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
        {/* LEFT COLUMN: Interactive Canvas & Probabilities (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col items-center bg-color-secondary border border-color-border/80 rounded-2xl p-8 lg:p-10 shadow-xl w-full">
          {/* Section Heading */}
          <div className="w-full mb-6 border-b border-color-border/40 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Draw Digit</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center w-full">
            {/* Drawing Canvas Container */}
            <div className="flex flex-col items-center">
              <DrawingCanvas
                onPrediction={handlePrediction}
                onClear={handleClear}
              />
            </div>

            {/* Live Model Output / Probabilities Card */}
            <div className="flex flex-col gap-4 w-full bg-color-main/60 border border-color-border/60 p-5 rounded-xl">
              {/* Predicted Digit Display */}
              <div className="text-center p-3 bg-color-secondary border border-color-border/60 rounded-xl">
                <span className="text-xs font-mono text-color-text/60 uppercase tracking-wider">
                  Predicted Digit
                </span>
                <div className="text-5xl font-bold font-mono text-color-accent mt-1 h-12 flex items-center justify-center">
                  {prediction !== null ? prediction : ""}
                </div>
              </div>

              {/* 10-Class Probability Bars */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-mono text-color-text/50 mb-1">
                  Class Probabilities
                </span>
                {probabilities.map((prob, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono"
                  >
                    <span className="w-3 text-color-text/60">{idx}</span>
                    <div className="flex-1 bg-color-secondary h-2.5 rounded-full overflow-hidden border border-color-border/40">
                      <div
                        className={`h-full transition-all duration-300 ${
                          prediction === idx
                            ? "bg-color-accent"
                            : "bg-color-text/30"
                        }`}
                        style={{ width: `${(prob * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-color-text/50">
                      {(prob * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Technical Showcase & Details (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Project Header Card */}
          <div className="bg-color-secondary border border-color-border/80 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              CNN From Scratch (NumPy)
            </h1>
            <p className="text-sm text-color-text/70 leading-relaxed">
              A pure Python/NumPy Convolutional Neural Network built from ground
              zero to master lower-level tensor operations, manual
              backpropagation, and kernel convolutions without PyTorch or
              TensorFlow.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Dataset
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  MNIST Digits
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Test Accuracy
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  98.8%
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Loss Function
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  Cross-Entropy
                </div>
              </div>
              <div className="bg-color-main/60 p-3 rounded-xl border border-color-border/40">
                <div className="text-xs text-color-text/50 font-mono">
                  Optimizer
                </div>
                <div className="text-lg font-semibold font-mono text-color-accent">
                  Adam
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
                Core Architecture
              </button>
              <button
                onClick={() => setActiveTab("optimization")}
                className={`pb-1 transition border-b-2 ${
                  activeTab === "optimization"
                    ? "border-color-accent text-color-accent font-semibold"
                    : "border-transparent text-color-text/60 hover:text-color-text"
                }`}
              >
                Optimizations
              </button>
            </div>

            {/* Tab 1: Architecture */}
            {activeTab === "overview" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Built to understand the exact calculus behind deep learning
                  frameworks before relying on high-level abstractions:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Forward Propagation:
                    </strong>{" "}
                    Sliding window kernels for feature extraction, spatial
                    downsampling via Max Pooling layers, and dense output
                    classification using Fully Connected layers.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Manual Backpropagation:
                    </strong>{" "}
                    Analytical 4D tensor gradient derivation across
                    convolutional and pooling operations.
                  </li>
                  <li>
                    <strong className="text-color-text">Activations:</strong>{" "}
                    Vectorized implementations of ReLU and numerically stable
                    Softmax activation functions.
                  </li>
                </ul>
              </div>
            )}

            {/* Tab 2: Optimizations */}
            {activeTab === "optimization" && (
              <div className="space-y-3 text-xs leading-relaxed text-color-text/80">
                <p>
                  Key performance enhancements built directly into the custom
                  training pipeline:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-color-text">
                      Im2col Transformation:
                    </strong>{" "}
                    Converts 4D image tensors into 2D matrices, replacing slow
                    nested loops with highly optimized NumPy BLAS matrix
                    multiplications.
                  </li>
                  <li>
                    <strong className="text-color-text">Adam Optimizer:</strong>{" "}
                    Incorporates adaptive moment estimation for smoother
                    convergence to optimal local minima.
                  </li>
                  <li>
                    <strong className="text-color-text">
                      Dropout Regularization:
                    </strong>{" "}
                    Randomly deactivates neurons during training passes to
                    prevent overfitting.
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
