import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PlayingBoard from "../components/PlayingBoard";
import { useApp } from "../context/AppContext";

export default function BlackjackPage() {
  const { langIsGerman } = useApp();

  const [hintData, setHintData] = useState(null);
  const [showPolicy, setShowPolicy] = useState(true);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const actionLabels = langIsGerman
    ? ["Stand", "Hit", "Double", "Split"]
    : ["Stand", "Hit", "Double", "Split"];

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

    return { bestActionIdx, probabilities, validFlags };
  }, [hintData]);

  return (
    <div
      data-theme="casino"
      className="min-h-screen bg-[var(--bg-main,#09090b)] text-[var(--color-text,#f4f4f5)] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400 relative overflow-x-hidden"
    >
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-emerald-500/[0.035] blur-[220px] pointer-events-none" />

      <header className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span>{langIsGerman ? "Portfolio" : "Portfolio"}</span>
        </Link>

        <span className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-[0.18em]">
          DQN + Blackjack Agent
        </span>

        <a
          href="https://github.com/Niki110607/blackjack_rl"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.78-1.34-1.78-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 7.03c1.02 0 2.05.14 3.01.42 2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z" />
          </svg>
          <span>GitHub</span>
          <span className="text-[10px]">↗</span>
        </a>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 pb-16 relative z-10">
        <div className="text-center pt-10 sm:pt-14 pb-10 sm:pb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-white">
            Blackjack RL Agent
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono">
            {langIsGerman
              ? "Deep-Q-Learning-Agent, trainiert auf 3 Millionen Blackjack-Händen"
              : "Deep Q-Learning agent trained on 3 million Blackjack hands"}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-[0.14em]">
            {langIsGerman ? "Blackjack-Tisch" : "Blackjack Table"}
          </span>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">
              {langIsGerman ? "Agent bereit" : "Agent Ready"}
            </span>
          </div>
        </div>

        <section className="w-full border-t border-b border-zinc-800/80 py-4 sm:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="min-w-0 pr-0 lg:pr-7">
              <PlayingBoard onHint={handleData} />
            </div>

            <aside
              className={`${showPolicy ? "block" : "hidden"} mt-5 lg:mt-0 lg:border-l border-zinc-800/80 pt-6 lg:pt-2 lg:pl-6`}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.14em]">
                  {langIsGerman ? "AI-Policy" : "AI Policy"}
                </span>
                {analysis && analysis.bestActionIdx !== -1 ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                    {langIsGerman ? "Aktiv" : "Live"}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    {langIsGerman ? "Wartet" : "Waiting"}
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
                          className={`${isBest ? "text-emerald-400 font-bold" : isLegal ? "text-zinc-300" : "text-zinc-700"} text-[10px] font-mono uppercase tracking-wider`}
                        >
                          {action}
                        </span>
                        <span
                          className={`${isBest ? "text-emerald-400 font-bold" : isLegal ? "text-zinc-500" : "text-zinc-700"} text-[10px] font-mono`}
                        >
                          {!isLegal ? "N/A" : `${percentage}%`}
                        </span>
                      </div>
                      <div className="h-1 bg-zinc-900 overflow-hidden rounded-full">
                        <div
                          className={`${isBest ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : isLegal ? "bg-zinc-700" : "bg-transparent"} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-800/70">
                <span className="block text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-600 mb-2">
                  {langIsGerman ? "Empfehlung" : "Recommendation"}
                </span>
                <div className="text-xl font-mono font-bold text-white">
                  {analysis && analysis.bestActionIdx !== -1
                    ? actionLabels[analysis.bestActionIdx]
                    : "—"}
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-600 font-mono">
                  {langIsGerman
                    ? "Die Balken zeigen, wie stark der DQN-Agent die möglichen Aktionen für die aktuelle Hand bewertet."
                    : "The bars show how strongly the DQN agent values each available action for the current hand."}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowPolicy((prev) => !prev)}
            className={`${showPolicy ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/[0.05]" : "border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700"} text-[10px] sm:text-xs font-mono uppercase tracking-wider py-2 px-4 border rounded-full transition-all`}
          >
            {showPolicy
              ? langIsGerman
                ? "Policy ausblenden"
                : "Hide Policy"
              : langIsGerman
                ? "Policy anzeigen"
                : "Show Policy"}
          </button>
        </div>

        <div className="w-full max-w-5xl mx-auto mt-10 py-5 border-y border-zinc-800/70 grid grid-cols-2 sm:grid-cols-4 gap-y-5 sm:gap-y-0">
          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              {langIsGerman ? "Training" : "Training"}
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              3.0M Hands
            </div>
          </div>
          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              {langIsGerman ? "Auswertung" : "Evaluation"}
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              100k Games
            </div>
          </div>
          <div className="text-center sm:border-r border-zinc-800/70">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              {langIsGerman ? "Winrate" : "Win Rate"}
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-white">
              43.7%
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.14em]">
              {langIsGerman ? "Erwartungswert" : "Expected Value"}
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-emerald-400">
              ≈ 0.00 EV
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowTechDetails((prev) => !prev)}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2 py-2 px-4 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
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
              className={`transition-transform duration-200 ${showTechDetails ? "rotate-180" : ""}`}
            >
              ↓
            </span>
          </button>
        </div>
      </main>

      {showTechDetails && (
        <footer className="w-full bg-zinc-950/90 border-t border-zinc-800/80 backdrop-blur-xl relative z-10 py-10">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="flex overflow-x-auto border-b border-zinc-800/80 gap-6 text-xs font-mono mb-6">
              {[
                ["overview", langIsGerman ? "DQN-Aufbau" : "DQN Architecture"],
                ["env", langIsGerman ? "Umgebung" : "Blackjack Environment"],
                [
                  "performance",
                  langIsGerman ? "Training & Strategie" : "Training & Strategy",
                ],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`${activeTab === id ? "border-emerald-400 text-emerald-400 font-bold" : "border-transparent text-zinc-500 hover:text-zinc-300"} pb-3 whitespace-nowrap border-b-2 transition`}
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
                    {langIsGerman
                      ? "Von der Hand zur Aktion"
                      : "From Hand to Action"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Der DQN-Agent bekommt drei zentrale Werte der aktuellen Situation: den Wert der eigenen Hand, die offene Karte des Dealers und ob ein Ass als 11 gezählt wird. Das Netzwerk verarbeitet diese Eingabe mit zwei Hidden Layers mit jeweils 64 Neuronen und gibt für Stand, Hit, Double und Split je einen Q-Wert aus. Der höchste gültige Q-Wert bestimmt die empfohlene Aktion."
                      : "The DQN agent receives three key parts of the current situation: the player's hand value, the dealer's visible card, and whether the hand contains a soft ace. Two hidden layers with 64 neurons process this input and produce one Q-value for Stand, Hit, Double, and Split. The highest valid Q-value determines the recommended action."}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {langIsGerman ? "Stabiles Q-Learning" : "Stable Q-Learning"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Während des Trainings speichert ein Replay Buffer bis zu 100.000 Erfahrungen. Daraus werden zufällige Batches von 128 Übergängen gezogen, damit das Netzwerk nicht nur aus direkt aufeinanderfolgenden Händen lernt. Ein separates Target Network wird alle 5.000 Hände aktualisiert und macht die Lernziele stabiler."
                      : "During training, a replay buffer stores up to 100,000 experiences. Random batches of 128 transitions are sampled so the network does not learn only from consecutive hands. A separate target network is updated every 5,000 hands to make the learning targets more stable."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "env" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-400">
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {langIsGerman ? "Spielzustand" : "Game State"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Die Umgebung bildet Blackjack gezielt für das Lernen ab. Neben den drei Modellwerten werden zusätzlich die verfügbaren Aktionen Double und Split markiert. Dadurch kann der Agent illegale Aktionen während der Auswahl und des Trainings ausblenden."
                      : "The environment represents Blackjack specifically for learning. In addition to the three model inputs, it tracks whether Double and Split are currently available. This lets the agent mask actions that are not legal in the current hand during action selection and training."}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {langIsGerman ? "Regeln & Rewards" : "Rules & Rewards"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Jede neue Hand wird mit einem frisch gemischten Deck gestartet. Der Dealer bleibt bei Soft 17 stehen, ein Natural Blackjack wird mit 3:2 ausgezahlt und Double kann den Gewinn oder Verlust der Hand verdoppeln. Zusätzlich unterstützt die Umgebung Split als vierte Aktion."
                      : "Each new hand starts with a freshly shuffled deck. The dealer stands on soft 17, a natural Blackjack pays 3:2, and Double can double the hand's win or loss. The environment also supports Split as a fourth action."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-zinc-400">
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {langIsGerman ? "3 Millionen Hände" : "3 Million Hands"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Der Agent trainiert über 3 Millionen Blackjack-Hände. Zu Beginn werden Aktionen zufällig gewählt, danach übernimmt das Netzwerk zunehmend die Entscheidungen, während die Exploration schrittweise reduziert wird."
                      : "The agent trains for 3 million Blackjack hands. At the beginning, actions are chosen randomly; later, the network increasingly controls the decisions while exploration is gradually reduced."}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-white text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {langIsGerman ? "Gelernte Strategie" : "Learned Strategy"}
                  </div>
                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Nach dem Training wird der Agent über 100.000 Spiele ausgewertet. Die gelernte Policy nähert sich dabei der etablierten Blackjack Basic Strategy an; die erwartete Auszahlung liegt bei ungefähr 0, was darauf hindeutet, dass der Agent den langfristigen Nachteil des Spielers weitgehend minimiert."
                      : "After training, the agent is evaluated over 100,000 games. The learned policy approaches established Blackjack basic strategy, while the expected return is close to 0, indicating that the agent largely minimizes the player's long-term disadvantage under this ruleset."}
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
