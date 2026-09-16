import React, { useState } from "react";
import { Link } from "react-router-dom";
import DrawingCanvas from "../components/DrawingCanvas";

export default function CnnPage() {
  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState(Array(10).fill(0));
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handlePrediction = (data) => {
    if (!data) return;

    setPrediction(data.digit);
    setProbabilities(data.probabilities || Array(10).fill(0));
  };

  const handleClear = () => {
    setPrediction(null);
    setProbabilities(Array(10).fill(0));
  };

  const maxConfidence =
    prediction !== null ? (probabilities[prediction] * 100).toFixed(1) : "0.0";

  return (
    <div
      data-theme="cnn"
      className="
        min-h-screen
        bg-[var(--bg-main)]
        text-[var(--color-text)]
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
          CNN Vision Engine
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
            Handwritten Digit Classifier
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
            Custom neural network built with pure NumPy
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
            Vision Workspace
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
              Inference Ready
            </span>
          </div>
        </div>

        {/* =========================================
            MAIN VISION WORKSPACE
        ========================================== */}

        <section
          className="
            w-full
            max-w-4xl
            mx-auto
            border-t
            border-b
            border-zinc-800/70
            py-5
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[minmax(0,1fr)_220px]
              items-center
            "
          >
            {/* =====================================
                DRAWING STAGE
            ====================================== */}

            <div
              className="
                min-w-0
                flex
                justify-center
                lg:pr-8
              "
            >
              <DrawingCanvas
                onPrediction={handlePrediction}
                onClear={handleClear}
              />
            </div>

            {/* =====================================
                INFERENCE TELEMETRY
            ====================================== */}

            <aside
              className="
                mt-8
                lg:mt-0
                pt-7
                lg:pt-0
                lg:pl-7
                border-t
                lg:border-t-0
                lg:border-l
                border-zinc-800/70
              "
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="
                    text-[10px]
                    font-mono
                    uppercase
                    tracking-[0.14em]
                    text-zinc-500
                  "
                >
                  Inference Output
                </span>

                {prediction !== null && (
                  <span
                    className="
                      text-[9px]
                      font-mono
                      uppercase
                      tracking-widest
                      text-[var(--color-accent)]
                    "
                  >
                    Result
                  </span>
                )}
              </div>

              <div
                className={`
                  min-h-[150px]
                  flex
                  flex-col
                  justify-center
                  transition-all
                  duration-300
                  ${prediction !== null ? "opacity-100" : "opacity-100"}
                `}
              >
                {prediction !== null ? (
                  <>
                    <div
                      className="
                        text-[7rem]
                        sm:text-[8rem]
                        font-mono
                        font-black
                        leading-[0.8]
                        tracking-[-0.08em]
                        text-white
                      "
                    >
                      {prediction}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <span
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-[var(--color-accent)]
                          shadow-[0_0_10px_var(--color-accent-glow)]
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-mono
                          font-bold
                          text-[var(--color-accent)]
                        "
                      >
                        {maxConfidence}% confidence
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="
                        text-[7rem]
                        sm:text-[8rem]
                        font-mono
                        font-black
                        leading-[0.8]
                        tracking-[-0.08em]
                        text-zinc-900
                      "
                    >
                      —
                    </div>

                    <span
                      className="
                        mt-5
                        text-[10px]
                        font-mono
                        uppercase
                        tracking-[0.16em]
                        text-zinc-700
                      "
                    >
                      Awaiting Input
                    </span>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* =========================================
            PROBABILITY SPECTRUM
        ========================================== */}

        <section
          className="
            w-full
            max-w-4xl
            mx-auto
            mt-8
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              mb-4
              px-1
            "
          >
            <span
              className="
                text-[10px]
                font-mono
                uppercase
                tracking-[0.14em]
                text-zinc-500
              "
            >
              Probability Spectrum
            </span>

            <span
              className="
                text-[9px]
                font-mono
                uppercase
                tracking-wider
                text-zinc-700
              "
            >
              Classes 0–9
            </span>
          </div>

          <div className="grid grid-cols-10 gap-2 sm:gap-3">
            {probabilities.map((probability, index) => {
              const isTop = prediction === index;
              const percentage = Math.round(probability * 100);

              return (
                <div
                  key={index}
                  className="
                    group
                    flex
                    flex-col
                    items-center
                  "
                >
                  {/* Bar */}
                  <div
                    className="
                      relative
                      flex
                      h-20
                      sm:h-24
                      w-full
                      items-end
                      overflow-hidden
                      border-b
                      border-zinc-800/80
                    "
                  >
                    <div
                      className={`
                        absolute
                        bottom-0
                        left-0
                        w-full
                        rounded-t-sm
                        transition-all
                        duration-500
                        ${
                          isTop
                            ? "bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent-glow)]"
                            : "bg-zinc-800 group-hover:bg-zinc-700"
                        }
                      `}
                      style={{
                        height: `${Math.max(
                          percentage,
                          probability > 0 ? 3 : 1,
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Class */}
                  <span
                    className={`
                      mt-2
                      text-[10px]
                      font-mono
                      transition-colors
                      ${
                        isTop
                          ? "font-bold text-[var(--color-accent)]"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      }
                    `}
                  >
                    {index}
                  </span>

                  {/* Percentage */}
                  <span
                    className={`
                      mt-0.5
                      text-[8px]
                      font-mono
                      ${isTop ? "text-[var(--color-accent)]" : "text-zinc-700"}
                    `}
                  >
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            TECHNICAL METRICS
        ========================================== */}

        <section
          className="
            w-full
            max-w-4xl
            mx-auto
            mt-9
            py-5
            border-y
            border-zinc-800/70
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-y-5
              sm:gap-y-0
            "
          >
            {/* Accuracy */}
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
                Accuracy
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
                98.8%
              </div>
            </div>

            {/* Loss */}
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
                Loss Function
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
                Cross-Entropy
              </div>
            </div>

            {/* Optimizer */}
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
                Optimizer
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
                Adam
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
              transition-colors
              hover:border-zinc-700
              hover:text-zinc-200
            "
          >
            <span>
              {showTechDetails
                ? "Hide Architecture Specs"
                : "Inspect Architecture Specs"}
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
          <div
            className="
              max-w-5xl
              mx-auto
              px-6
            "
          >
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
              {/* Network pipeline */}
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
                  Network Pipeline
                </div>

                <p className="mt-2 leading-relaxed">
                  Processes 28×28 grayscale inputs through 3×3 convolution
                  kernels, MaxPool downsampling, and dense Softmax layers.
                </p>
              </div>

              {/* Vectorization */}
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
                  Vectorization
                </div>

                <p className="mt-2 leading-relaxed">
                  Uses <code className="text-zinc-200 font-mono">im2col</code>{" "}
                  memory flattening to transform sliding convolutions into
                  matrix multiplications.
                </p>
              </div>

              {/* Model metrics */}
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
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Model Metrics
                </div>

                <div
                  className="
                    mt-3
                    font-mono
                    text-[11px]
                    text-zinc-300
                  "
                >
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-600">Accuracy</span>
                    <span className="text-emerald-400">98.8%</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-600">Loss</span>
                    <span>Cross-Entropy</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-zinc-600">Optimizer</span>
                    <span>Adam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
