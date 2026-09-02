import React, { useEffect, useState } from "react";

export default function App() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus("Backend Offline"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400">
          Interactive AI Arcade
        </h1>
        <p className="mt-2 text-slate-400">
          Portfolio backend connection status:{" "}
          <span className="font-mono text-emerald-400">{apiStatus}</span>
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-indigo-300">
            1. Digit Recognizer
          </h2>
          <p className="text-slate-400 text-sm">
            Draw a number on the canvas for my pure NumPy CNN.
          </p>
        </div>

        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-indigo-300">
            2. Transformer Chess
          </h2>
          <p className="text-slate-400 text-sm">
            Play live moves against my custom trained Transformer.
          </p>
        </div>

        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-indigo-300">
            3. Blackjack RL
          </h2>
          <p className="text-slate-400 text-sm">
            Watch or play against an optimal Q-learning policy.
          </p>
        </div>

        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-indigo-300">
            4. Infinite Craft
          </h2>
          <p className="text-slate-400 text-sm">
            Combine elements dynamically driven by AI.
          </p>
        </div>
      </main>
    </div>
  );
}
