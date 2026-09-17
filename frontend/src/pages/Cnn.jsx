import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useApp } from "../context/AppContext";
import DrawingCanvas from "../components/DrawingCanvas";

export default function CnnPage() {
  const { langIsGerman } = useApp();

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
        relative
        flex
        min-h-screen
        w-full
        flex-col
        overflow-x-hidden
        bg-[var(--bg-main)]
        font-sans
        text-[var(--color-text)]
        selection:bg-[var(--color-accent-glow)]
        selection:text-[var(--color-accent)]
      "
    >
      {/* =========================================
          AMBIENT BACKGROUND
      ========================================== */}
      <div
        className="
          pointer-events-none
          fixed
          top-1/2
          left-1/2
          h-[850px]
          w-[850px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[var(--color-accent-glow)]
          blur-[220px]
          opacity-20
        "
      />

      {/* =========================================
          TOP HEADER
      ========================================== */}
      <header
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-5xl
          items-center
          justify-between
          px-6
          py-6
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
            font-mono
            uppercase
            tracking-[0.16em]
            text-zinc-400
            sm:text-xs
          "
        >
          CNN Vision Engine
        </span>

        <a
          href="https://github.com/Niki110607/CNN-from-scratch-numpy-"
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-mono
            text-zinc-500
            transition-colors
            hover:text-white
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
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
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-5xl
          flex-1
          px-6
          pb-16
        "
      >
        {/* =========================================
            PROJECT INTRO
        ========================================== */}
        <div
          className="
            pt-10
            pb-11
            text-center
            sm:pt-14
            sm:pb-13
          "
        >
          <h1
            className="
              text-3xl
              font-extrabold
              tracking-[-0.04em]
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            {langIsGerman ? "CNN from Scratch" : "CNN from Scratch"}
          </h1>

          <p
            className="
              mt-3
              text-xs
              font-mono
              text-zinc-400
              sm:text-sm
            "
          >
            {langIsGerman
              ? "Ein CNN zur Erkennung handschriftlicher Ziffern, komplett mit NumPy implementiert"
              : "A CNN for handwritten digit recognition, built entirely with NumPy"}
          </p>
        </div>

        {/* =========================================
            WORKSPACE LABEL
        ========================================== */}
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
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
              sm:text-[11px]
            "
          >
            {langIsGerman ? "Ziffern-Eingabe" : "Digit Input"}
          </span>

          <div className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-[var(--color-accent)]
                shadow-[0_0_10px_var(--color-accent-glow)]
              "
            />

            <span
              className="
                text-[10px]
                font-mono
                text-zinc-300
                sm:text-[11px]
              "
            >
              {langIsGerman ? "Bereit zur Erkennung" : "Inference Ready"}
            </span>
          </div>
        </div>

        {/* =========================================
            MAIN VISION WORKSPACE
        ========================================== */}
        <section
          className="
            mx-auto
            w-full
            max-w-4xl
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
              items-center
              lg:grid-cols-[minmax(0,1fr)_220px]
            "
          >
            {/* =====================================
                DRAWING STAGE
            ====================================== */}
            <div
              className="
                flex
                min-w-0
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
                border-t
                border-zinc-800/70
                pt-7
                lg:mt-0
                lg:border-t-0
                lg:border-l
                lg:pl-7
                lg:pt-0
              "
            >
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
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
                  {langIsGerman ? "Vorhersage" : "Prediction"}
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
                    {langIsGerman ? "Ergebnis" : "Result"}
                  </span>
                )}
              </div>

              <div
                className="
                  flex
                  min-h-[150px]
                  flex-col
                  justify-center
                  transition-all
                  duration-300
                "
              >
                {prediction !== null ? (
                  <>
                    <div
                      className="
                        text-[7rem]
                        font-mono
                        font-black
                        leading-[0.8]
                        tracking-[-0.08em]
                        text-white
                        sm:text-[8rem]
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
                        {maxConfidence}%{" "}
                        {langIsGerman ? "Wahrscheinlichkeit" : "probability"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`
                        text-[7rem]
                        font-mono
                        font-black
                        leading-[0.8]
                        tracking-[-0.08em]
                        text-zinc-900
                        sm:text-[8rem]
                        ${prediction !== null ? "opacity-100" : "opacity-0"}
                      `}
                    >
                      placeholder
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
                      {langIsGerman ? "Ziffer zeichnen" : "Draw a digit"}
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
        <section className="mx-auto mt-8 w-full max-w-4xl">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
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
              Prediction Probabilities
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
              {langIsGerman ? "Ziffern 0–9" : "Digits 0–9"}
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
                      w-full
                      items-end
                      overflow-hidden
                      border-b
                      border-zinc-800/80
                      sm:h-24
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
            mx-auto
            mt-9
            w-full
            max-w-4xl
            border-y
            border-zinc-800/70
            py-5
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-y-5
              sm:grid-cols-4
              sm:gap-y-0
            "
          >
            {/* Dataset */}
            <div
              className="
                text-center
                sm:border-r
                sm:border-zinc-800/70
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
                {langIsGerman ? "Datensatz" : "Dataset"}
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
                MNIST
              </div>
            </div>

            {/* Loss */}
            <div
              className="
                text-center
                sm:border-r
                sm:border-zinc-800/70
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
                {langIsGerman ? "Loss-Funktion" : "Loss Function"}
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

            {/* Parameters */}
            <div
              className="
                text-center
                sm:border-r
                sm:border-zinc-800/70
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
                {langIsGerman ? "Parameter" : "Parameters"}
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
                206,922
              </div>
            </div>

            {/* Accuracy */}
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
                {langIsGerman ? "Genauigkeit" : "Accuracy"}
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
                98.5%
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            TECHNICAL DETAILS TRIGGER
        ========================================== */}
        <div className="mt-10 flex justify-center">
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
                ? langIsGerman
                  ? "Architektur ausblenden"
                  : "Hide Architecture Specs"
                : langIsGerman
                  ? "Architektur ansehen"
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
            relative
            z-10
            w-full
            border-t
            border-zinc-800/80
            bg-zinc-950/95
            py-10
            backdrop-blur-xl
          "
        >
          <div className="mx-auto max-w-5xl px-6">
            <div
              className="
                grid
                grid-cols-1
                gap-8
                text-xs
                text-zinc-400
                md:grid-cols-3
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
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-[var(--color-accent)]
                    "
                  />

                  {langIsGerman ? "Merkmale erkennen" : "Extract Features"}
                </div>

                <p className="mt-2 leading-relaxed">
                  {langIsGerman
                    ? "Das 28×28 Graustufenbild wird durch zwei Convolution-Schichten verarbeitet. Die erste nutzt 16, die zweite 32 Filter mit 3×3-Kern. Max Pooling reduziert danach jeweils die Bildgröße und lässt die wichtigsten Merkmale erhalten."
                    : "The 28×28 grayscale image passes through two convolution layers. The first uses 16 and the second 32 filters with 3×3 kernels. Max Pooling then reduces the image size while keeping the most important features."}
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
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-[var(--color-accent)]
                    "
                  />

                  {langIsGerman
                    ? "Berechnung beschleunigen"
                    : "Speed Up the Computation"}
                </div>

                <p className="mt-2 leading-relaxed">
                  {langIsGerman ? (
                    <>
                      Die Layer und ihre Backpropagation sind vollständig selbst
                      mit NumPy implementiert.{" "}
                      <code className="font-mono text-zinc-200">im2col</code>{" "}
                      ordnet die kleinen Bildausschnitte so an, dass die
                      Convolution mit schneller Matrixmultiplikation berechnet
                      werden kann.
                    </>
                  ) : (
                    <>
                      The layers and their backpropagation are implemented
                      directly with NumPy.{" "}
                      <code className="font-mono text-zinc-200">im2col</code>{" "}
                      rearranges the small image regions so convolution can be
                      computed with fast matrix multiplication.
                    </>
                  )}
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
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-[var(--color-accent)]
                    "
                  />

                  {langIsGerman ? "Ziffer vorhersagen" : "Predict the Digit"}
                </div>

                <p className="mt-2 leading-relaxed">
                  {langIsGerman
                    ? "Nach dem Pooling bleiben 32 Feature Maps mit 7×7 Pixeln übrig. Diese 1568 Werte gehen durch 128 Neuronen und anschließend auf zehn Ausgaben – eine für jede Ziffer von 0 bis 9. Softmax wandelt sie in Wahrscheinlichkeiten um. Beim Training misst Cross-Entropy den Fehler, und Adam aktualisiert die Gewichte anhand der von Backpropagation berechneten Gradienten."
                    : "After pooling, 32 feature maps of 7×7 pixels remain, giving 1568 values. They pass through 128 neurons and then to ten outputs, one for each digit from 0 to 9. Softmax turns them into probabilities. During training, cross-entropy measures the error, while Adam updates the weights using gradients computed by backpropagation."}
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
