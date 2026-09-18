import React, { useState } from "react";
import { Link } from "react-router-dom";

import ChessBoard from "../components/ChessBoard";
import { useApp } from "../context/AppContext";

export default function ChessPage() {
  const { langIsGerman, setLangIsGerman } = useApp();

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
        relative flex min-h-screen w-full flex-col
        overflow-x-hidden
        bg-[var(--bg-main,#09090b)]
        font-sans
        text-[var(--color-text,#f4f4f5)]
        selection:bg-[var(--color-accent-glow)]
        selection:text-[var(--color-accent)]
      "
    >
      {/* Ambient engine glow */}
      <div
        className="
          pointer-events-none
          fixed left-1/2 top-1/2
          h-[min(800px,140vw)] w-[min(800px,140vw)]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-[var(--color-accent-glow)]
          opacity-15
          blur-[220px]
        "
      />

      {/* TOP HEADER */}
      <header
        className="
          relative z-10
          mx-auto grid w-full max-w-5xl
          grid-cols-[auto_minmax(0,1fr)_auto]
          items-center gap-3
          px-4 py-6 sm:px-6
        "
      >
        <Link
          to="/"
          className="
            group
            flex items-center gap-2
            text-xs font-mono
            text-zinc-500
            transition-colors
            hover:text-white
          "
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          {langIsGerman ? "Portfolio" : "Portfolio"}
        </Link>

        <span
          className="
            text-[10px] font-mono uppercase
            tracking-[0.16em]
            text-zinc-400
            truncate text-center
            sm:text-xs
          "
        >
          {langIsGerman
            ? "MCTS + Transformer Engine"
            : "MCTS + Transformer Engine"}
        </span>

        <a
          href="https://github.com/Niki110607/chess_ai"
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex items-center gap-1.5
            text-xs font-mono
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

      {/* MAIN */}
      <main
        className="
          relative z-10
          mx-auto flex w-full max-w-5xl flex-1
          flex-col
          px-4 pb-16 sm:px-6
        "
      >
        {/* PROJECT TITLE */}
        <div
          className="
            pt-10 pb-9
            text-center
            sm:pt-12 sm:pb-10
          "
        >
          <h1
            className="
              text-3xl font-extrabold
              tracking-[-0.04em]
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            {langIsGerman
              ? "Transformer-Schachengine"
              : "Transformer Chess Engine"}
          </h1>

          <p
            className="
              mt-3
              overflow-hidden
              text-ellipsis
              whitespace-nowrap
              text-center
              text-xs font-mono
              text-zinc-400
              sm:text-sm
            "
          >
            {langIsGerman
              ? "6,5-Mio.-Parameter-Schachengine mit neuronaler Bewertung und MCTS"
              : "6.5M-parameter chess engine with neural evaluation and MCTS"}
          </p>
        </div>

        {/* WORKSPACE HEADER */}
        <div
          className="
            flex items-center justify-between
            border-b border-zinc-800/80
            px-1 pb-3
          "
        >
          <span
            className="
              text-[10px] font-mono uppercase
              tracking-[0.14em]
              text-zinc-500
              sm:text-[11px]
            "
          >
            {langIsGerman ? "Schachbrett" : "Chessboard"}
          </span>

          <div className="flex items-center gap-2">
            <span
              className="
                h-2 w-2
                animate-pulse
                rounded-full
                bg-[var(--color-accent)]
                shadow-[0_0_10px_var(--color-accent-glow)]
              "
            />

            <span className="text-[10px] font-mono text-zinc-300 sm:text-[11px]">
              {langIsGerman ? "Engine bereit" : "Engine Ready"}
            </span>
          </div>
        </div>

        {/* BOARD WORKSPACE */}
        <section className="w-full pt-5">
          <div className="mx-auto w-full max-w-xl">
            <div
              className="
                flex w-full
                items-stretch justify-center
                gap-3
                sm:gap-4
              "
            >
              <div className="min-w-0 flex-1">
                <ChessBoard key={boardKey} onEvalUpdate={setEvalScore} />
              </div>

              {showEval && (
                <div
                  className="
                    flex w-10 shrink-0
                    flex-col items-center justify-between
                    rounded-xl
                    border border-zinc-800/80
                    bg-zinc-950/80
                    py-3
                    shadow-inner
                    sm:w-11
                  "
                >
                  <span
                    className="
                      text-[10px] font-mono font-bold
                      leading-none
                      text-zinc-300
                    "
                  >
                    {formattedEval}
                  </span>

                  <div
                    className="
                      relative
                      my-3
                      min-h-[170px]
                      w-[6px]
                      flex-1
                      overflow-hidden
                      rounded-full
                      bg-zinc-900
                    "
                  >
                    <div
                      className="
                        absolute left-1/2 top-1/2 z-10
                        h-px w-3
                        -translate-x-1/2 -translate-y-1/2
                        bg-zinc-600
                      "
                    />

                    <div
                      className="
                        absolute bottom-0 left-0
                        w-full
                        rounded-full
                        bg-[var(--color-accent)]
                        shadow-[0_0_10px_var(--color-accent)]
                        transition-all duration-500
                      "
                      style={{ height: `${evalPercentage}%` }}
                    />
                  </div>

                  <span
                    className="
                      text-[8px] font-mono uppercase
                      tracking-[0.1em]
                      text-zinc-600
                    "
                  >
                    Eval
                  </span>
                </div>
              )}
            </div>

            {/* CONTROLS */}
            <div
              className="
                mt-5
                flex w-full max-w-xl
                items-center gap-5
              "
            >
              <button
                onClick={handleReset}
                className="
                  flex-1
                  rounded-xl
                  border border-zinc-800
                  bg-zinc-900
                  px-4 py-2.5
                  text-xs font-mono font-medium
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                  active:scale-95
                "
              >
                {langIsGerman ? "Reset Board" : "Reset Board"}
              </button>

              <button
                onClick={() => setShowEval((prev) => !prev)}
                className={`
                  flex-1
                  rounded-xl
                  border
                  px-4 py-2.5
                  text-xs font-mono font-medium
                  transition
                  active:scale-95
                  ${
                    showEval
                      ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }
                `}
              >
                {showEval
                  ? langIsGerman
                    ? "Hide Evaluation"
                    : "Hide Evaluation"
                  : langIsGerman
                    ? "Show Evaluation"
                    : "Show Evaluation"}
              </button>
            </div>
          </div>
        </section>

        {/* MODEL TELEMETRY */}
        <section
          className="
            mt-8
            w-full
            border-y border-zinc-800/70
            py-5
          "
        >
          <div
            className="
              grid grid-cols-2
              gap-y-5
              sm:grid-cols-4
              sm:gap-y-0
            "
          >
            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px] font-mono uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                {langIsGerman ? "Modellgröße" : "Model Size"}
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                6.5M Params
              </div>
            </div>

            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px] font-mono uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                {langIsGerman ? "Datensatz" : "Dataset"}
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                10M Positions
              </div>
            </div>

            <div className="text-center sm:border-r border-zinc-800/70">
              <div
                className="
                  text-[9px] font-mono uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                {langIsGerman ? "Geschwindigkeit" : "Speed"}
              </div>

              <div className="mt-1 text-sm font-mono font-bold text-white">
                500 pos/sec
              </div>
            </div>

            <div className="text-center">
              <div
                className="
                  text-[9px] font-mono uppercase
                  tracking-[0.14em]
                  text-zinc-600
                "
              >
                {langIsGerman ? "Spielstärke" : "Playing Strength"}
              </div>

              <div
                className="
                  mt-1
                  text-sm font-mono font-bold
                  text-[var(--color-accent)]
                "
              >
                2200–2400 ELO
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL DETAILS */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowTechDetails((prev) => !prev)}
            className="
              flex items-center gap-2
              rounded-full
              border border-zinc-800/80
              bg-zinc-900/40
              px-4 py-2
              text-xs font-mono
              text-zinc-500
              transition-colors
              hover:border-zinc-700
              hover:text-zinc-200
            "
          >
            <span>
              {showTechDetails
                ? langIsGerman
                  ? "Engine-Spezifikationen ausblenden"
                  : "Hide Engine Specs"
                : langIsGerman
                  ? "Engine-Spezifikationen anzeigen"
                  : "Inspect Engine Specs"}
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

      {/* TECHNICAL DRAWER */}
      {showTechDetails && (
        <footer
          className="
            relative z-10
            w-full
            border-t border-zinc-800/80
            bg-zinc-950/90
            py-10
            backdrop-blur-xl
          "
        >
          <div className="mx-auto max-w-5xl px-6">
            <div
              className="
                mb-7
                flex gap-6
                overflow-x-auto
                border-b border-zinc-800/80
                text-xs font-mono
              "
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition
                  ${
                    activeTab === "overview"
                      ? "border-[var(--color-accent)] font-bold text-[var(--color-accent)]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {langIsGerman
                  ? "Transformer-Architektur"
                  : "Transformer Architecture"}
              </button>

              <button
                onClick={() => setActiveTab("mcts")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition
                  ${
                    activeTab === "mcts"
                      ? "border-[var(--color-accent)] font-bold text-[var(--color-accent)]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {langIsGerman ? "MCTS-Integration" : "MCTS Integration"}
              </button>
            </div>

            {activeTab === "overview" && (
              <div
                className="
                  grid grid-cols-1
                  gap-8
                  text-xs text-zinc-400
                  md:grid-cols-2
                "
              >
                <div>
                  <div
                    className="
                      flex items-center gap-2
                      text-sm font-mono font-semibold
                      text-white
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    {langIsGerman ? "Brettdarstellung" : "Board Representation"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Jede Stellung wird als 19 × 64 Tensor dargestellt. Für jedes der 64 Felder werden 19 Merkmale codiert, sodass das Netzwerk die gesamte Stellung als strukturierte Eingabe verarbeiten kann."
                      : "Each position is represented as a 19 × 64 tensor. Every one of the 64 squares is described by 19 features, giving the network a structured representation of the full position."}
                  </p>
                </div>

                <div>
                  <div
                    className="
                      flex items-center gap-2
                      text-sm font-mono font-semibold
                      text-white
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    {langIsGerman ? "CNN + Transformer" : "CNN + Transformer"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Zuerst verarbeiten Convolutional Layers lokale Strukturen des Brettes. Danach betrachtet der Transformer mit 8 Layern und 16 Attention Heads die Beziehungen zwischen den Feldern und verbindet diese Informationen zu einer gemeinsamen Darstellung der Stellung."
                      : "Convolutional layers first process local board patterns. An 8-layer transformer with 16 attention heads then models relationships between squares and combines them into a shared representation of the position."}
                  </p>
                </div>

                <div>
                  <div
                    className="
                      flex items-center gap-2
                      text-sm font-mono font-semibold
                      text-white
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    {langIsGerman ? "Zwei Vorhersagen" : "Two Predictions"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Aus dieser Darstellung entstehen zwei Vorhersagen. Der Policy Head gibt legalen Zügen Wahrscheinlichkeiten und zeigt damit, welche Züge für die Suche interessant sind. Der Value Head liefert einen einzelnen Wert dafür, wie günstig die aktuelle Stellung ist."
                      : "This representation produces two predictions. The policy head assigns probabilities to legal moves, indicating which moves are worth exploring. The value head produces a single value describing how favorable the current position is."}
                  </p>
                </div>

                <div>
                  <div
                    className="
                      flex items-center gap-2
                      text-sm font-mono font-semibold
                      text-white
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                    {langIsGerman ? "Training" : "Training"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Trainiert wurde das Modell auf rund 10 Millionen Lichess-Stellungen. Starke Stockfish-Bewertungen dienen dabei als Trainingsdaten, sodass das Netzwerk lernt, sowohl die Qualität einer Stellung als auch vielversprechende Züge einzuschätzen."
                      : "The model was trained on around 10 million Lichess positions. Strong Stockfish evaluations provide the training labels, teaching the network to estimate both position quality and promising moves."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "mcts" && (
              <div>
                <p
                  className="
                    mb-8
                    max-w-3xl
                    text-xs
                    leading-relaxed
                    text-zinc-400
                    sm:text-sm
                  "
                >
                  {langIsGerman
                    ? "Das Netzwerk wählt den Zug nicht direkt. Es bewertet die Stellung und gibt jedem legalen Zug eine Wahrscheinlichkeit. MCTS nutzt beides, um den Spielbaum schrittweise zu durchsuchen und mehr Rechenzeit auf vielversprechende Varianten zu konzentrieren."
                    : "The network does not choose the move directly. It evaluates the position and assigns a probability to each legal move. MCTS uses both signals to search the game tree step by step and spend more computation on promising variations."}
                </p>

                <div
                  className="
                    grid grid-cols-1
                    gap-8
                    text-xs text-zinc-400
                    md:grid-cols-2
                  "
                >
                  <div>
                    <div
                      className="
                        flex items-center gap-2
                        text-sm font-mono font-semibold
                        text-white
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                      {langIsGerman ? "Auswahl" : "Selection"}
                    </div>

                    <p className="mt-2 leading-relaxed">
                      {langIsGerman
                        ? "MCTS beginnt am Root Node, dem Ausgangspunkt der aktuellen Suche, und folgt den Zügen, die nach bisherigen Ergebnissen und den Prioritäten des Netzwerks am interessantesten sind. Dabei wird zwischen bereits gut untersuchten Zügen und neuen Möglichkeiten abgewogen."
                        : "MCTS starts at the root node and follows moves that look most promising from previous results and the priors supplied by the network. It balances moves that have already performed well with less-explored alternatives."}
                    </p>
                  </div>

                  <div>
                    <div
                      className="
                        flex items-center gap-2
                        text-sm font-mono font-semibold
                        text-white
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                      {langIsGerman
                        ? "Netzwerkbewertung"
                        : "Network Evaluation"}
                    </div>

                    <p className="mt-2 leading-relaxed">
                      {langIsGerman
                        ? "Erreicht die Suche eine bisher nicht bewertete Stellung, übernimmt das Netzwerk die Einschätzung. Bis zu 16 solcher Stellungen werden gemeinsam verarbeitet, sodass mehrere Positionen pro Durchlauf effizient bewertet werden können."
                        : "When the search reaches a previously unevaluated position, the network evaluates it. Up to 16 such positions are processed together, allowing multiple positions to be evaluated efficiently in one batch."}
                    </p>
                  </div>

                  <div>
                    <div
                      className="
                        flex items-center gap-2
                        text-sm font-mono font-semibold
                        text-white
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                      {langIsGerman ? "Baum vergrößern" : "Expand the Tree"}
                    </div>

                    <p className="mt-2 leading-relaxed">
                      {langIsGerman
                        ? "Anschließend wird der neue Knoten um seine legalen Züge erweitert. Die vom Policy Head vorhergesagten Wahrscheinlichkeiten werden dabei als Prioritäten übernommen und bestimmen, welche Züge in den nächsten Suchschritten besonders berücksichtigt werden."
                        : "The new node is then expanded with its legal moves. The probabilities predicted by the policy head become priors that influence which moves receive more attention in the next search steps."}
                    </p>
                  </div>

                  <div>
                    <div
                      className="
                        flex items-center gap-2
                        text-sm font-mono font-semibold
                        text-white
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />

                      {langIsGerman ? "Backpropagation" : "Backpropagation"}
                    </div>

                    <p className="mt-2 leading-relaxed">
                      {langIsGerman
                        ? "Die Bewertung wird danach entlang des untersuchten Pfades zurück durch den Spielbaum geführt. Besuchszahlen und Bewertungen werden aktualisiert, sodass spätere Suchschritte besser einschätzen können, welche Varianten sich lohnen. Am Ende wird der meistbesuchte Zug am Root Node gespielt."
                        : "The evaluation is then propagated back through the explored path. Visit counts and value estimates are updated, helping later iterations identify which variations are worth exploring. Once the search is complete, the most-visited move at the root node is played."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
