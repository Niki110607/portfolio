import React from "react";
import { useApp } from "../context/AppContext";
import ProjectCard from "../components/ProjectCard";

const getProjects = (langIsGerman) => [
  {
    id: "cnn",
    title: "CNN from Scratch",
    description: langIsGerman
      ? "Ein CNN zur Erkennung handschriftlicher Ziffern, komplett mit NumPy implementiert"
      : "A CNN for handwritten digit recognition, built entirely with NumPy",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "NumPy", img_path: "NumPy.png" },
    ],
    path: "/cnn",
  },
  {
    id: "blackjack",
    title: "Blackjack RL Agent",
    description: langIsGerman
      ? "Deep-Q-Learning-Agent, trainiert auf 3 Millionen Blackjack-Händen"
      : "Deep Q-Learning agent trained on 3 million Blackjack hands",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "PyTorch", img_path: "PyTorch.png" },
    ],
    path: "/blackjack",
  },
  {
    id: "chess",
    title: langIsGerman
      ? "Transformer-Schachengine"
      : "Transformer Chess Engine",
    description: langIsGerman
      ? "6,5-Mio.-Parameter-Schachengine mit neuronaler Bewertung und MCTS"
      : "6.5M-parameter chess engine with neural evaluation and MCTS",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "PyTorch", img_path: "PyTorch.png" },
    ],
    path: "/chess",
  },
  {
    id: "craft",
    title: "Infinite Craft Clone",
    description: langIsGerman
      ? "KI-gestützte Kombinations-Engine mit Qwen und SQLite"
      : "AI-powered combination engine using Qwen and SQLite",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "SQLite", img_path: "SQL.png" },
    ],
    path: "/craft",
  },
];

export default function Home() {
  const { langIsGerman, setLangIsGerman } = useApp();
  const projects = getProjects(langIsGerman);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans overflow-x-hidden">
      <div className="fixed left-1/2 top-[-260px] -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-indigo-500/[0.025] blur-[180px] pointer-events-none" />

      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-300">
          Portfolio
        </span>
        <nav className="flex items-center gap-5 sm:gap-7">
          <a
            href="#work"
            className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-200 transition-colors"
          >
            {langIsGerman ? "Projekte" : "Projects"}
          </a>
          <a
            href="#skills"
            className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-200 transition-colors"
          >
            {langIsGerman ? "Skills" : "Skills"}
          </a>
          <a
            href="#education"
            className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-200 transition-colors"
          >
            {langIsGerman ? "Studium" : "Education"}
          </a>
          <a
            href="#contact"
            className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-200 transition-colors"
          >
            {langIsGerman ? "Kontakt" : "Contact"}
          </a>
        </nav>
      </header>

      <main className="relative z-10">
        <div className="w-full max-w-5xl mx-auto px-6 pt-2 flex justify-end">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/70 p-1">
            <button
              type="button"
              aria-pressed={langIsGerman}
              onClick={() => setLangIsGerman(true)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${langIsGerman ? "bg-zinc-100/10 text-zinc-100 border border-zinc-100/15" : "text-zinc-600 hover:text-zinc-300"}`}
            >
              DE
            </button>
            <button
              type="button"
              aria-pressed={!langIsGerman}
              onClick={() => setLangIsGerman(false)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${!langIsGerman ? "bg-zinc-100/10 text-zinc-100 border border-zinc-100/15" : "text-zinc-600 hover:text-zinc-300"}`}
            >
              EN
            </button>
          </div>
        </div>
        <section className="w-full max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.055em] leading-[0.95] text-white">
              Niklas Pichler
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono text-zinc-600">
              <span>
                {langIsGerman
                  ? "Informatik · JKU Linz · ab Oktober 2026"
                  : "Computer Science · JKU Linz · starting October 2026"}
              </span>
              <span className="text-zinc-800">/</span>
              <span>
                {langIsGerman
                  ? "Seitenstetten, Österreich"
                  : "Seitenstetten, Austria"}
              </span>
            </div>

            <h2 className="mt-9 text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-tight text-white">
              {langIsGerman
                ? "Ich baue intelligente Systeme, um zu verstehen, wie sie funktionieren."
                : "I build intelligent systems to understand how they work."}
            </h2>

            <div className="mt-6 text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] text-zinc-600">
              Machine Learning · Deep Learning · Algorithms
            </div>
          </div>
        </section>
        <section
          id="work"
          className="w-full max-w-5xl mx-auto px-6 pb-24 sm:pb-32 scroll-mt-10"
        >
          <div className="flex items-end justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-[-0.03em] text-white">
                {langIsGerman ? "Ausgewählte Projekte" : "Selected Projects"}
              </h2>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-700">
              04 {langIsGerman ? "Projekte" : "Projects"}
            </span>
          </div>

          <div>
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
        <section
          id="skills"
          className="w-full border-y border-zinc-800/70 scroll-mt-10"
        >
          <div className="max-w-5xl mx-auto px-6 py-20 sm:py-24 grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                {langIsGerman ? "Technischer Fokus" : "Technical Focus"}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.035em] text-white">
                {langIsGerman
                  ? "Werkzeuge für eigene Systeme."
                  : "Tools for building systems."}
              </h2>
            </div>

            <div>
              <div className="divide-y divide-zinc-800/70 border-y border-zinc-800/70">
                <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm font-mono text-zinc-500">
                    {langIsGerman ? "Machine Learning" : "Machine Learning"}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-300">
                    PyTorch · NumPy · Deep Learning
                  </span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm font-mono text-zinc-500">
                    {langIsGerman ? "Algorithmen" : "Algorithms"}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-300">
                    Neural Networks · Reinforcement Learning
                  </span>
                </div>
                <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm font-mono text-zinc-500">
                    {langIsGerman ? "Programmierung" : "Programming"}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-300">
                    Python · JavaScript · Git
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="education"
          className="w-full max-w-5xl mx-auto px-6 py-20 sm:py-24 scroll-mt-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                {langIsGerman ? "Studium" : "Education"}
              </span>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.035em] text-white">
                JKU Linz
              </h2>

              <div className="mt-2 text-sm sm:text-base font-mono text-zinc-400">
                {langIsGerman
                  ? "BSc Informatik · ab Oktober 2026"
                  : "BSc Computer Science · starting October 2026"}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                {langIsGerman ? "Auszeichnung" : "Achievement"}
              </span>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.035em] text-white">
                Känguru der Mathematik
              </h2>

              <div className="mt-2 text-sm sm:text-base font-mono text-zinc-400 leading-relaxed">
                {langIsGerman ? (
                  <>
                    2025 · 1. Platz Niederösterreich · 5. Platz österreichweit
                    <br />
                    2024 · 2. Platz Niederösterreich
                    <br />
                    2019–2023 · Mehrfache Top-3-Platzierungen auf Landesebene
                  </>
                ) : (
                  <>
                    2025 · 1st place in Lower Austria · 5th place in Austria
                    <br />
                    2024 · 2nd place in Lower Austria
                    <br />
                    2019–2023 · Multiple top-3 finishes at state level
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="w-full border-t border-zinc-800/70 scroll-mt-10"
        >
          <div className="max-w-5xl mx-auto px-6 py-20 sm:py-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-600">
                {langIsGerman ? "Kontakt" : "Contact"}
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-white">
                {langIsGerman
                  ? "Interesse an meiner Arbeit?"
                  : "Interested in my work?"}
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-600">
                E-Mail
              </span>
              <a
                href="mailto:pichlerniklas@icloud.com"
                className="text-sm sm:text-base font-mono text-zinc-300 hover:text-white transition-colors"
              >
                pichlerniklas@icloud.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-700">
            {langIsGerman ? "Portfolio / Projekte" : "Portfolio / Projects"}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-800">
            Built with React
          </span>
        </div>
      </footer>
    </div>
  );
}
