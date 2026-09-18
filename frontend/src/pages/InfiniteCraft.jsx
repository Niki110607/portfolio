import React, { useState } from "react";
import { Link } from "react-router-dom";

import CraftBoard from "../components/CraftBoard";
import { useApp } from "../context/AppContext";

export default function InfinitePage() {
  const { langIsGerman } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div
      data-theme="craft"
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-col
        overflow-x-hidden
        bg-[var(--bg-main,#09090b)]
        font-sans
        text-[var(--color-text,#f4f4f5)]
        selection:bg-[var(--color-accent-glow)]
        selection:text-[var(--color-accent)]
      "
    >
      <div
        className="
          pointer-events-none
          fixed
          top-1/2
          left-1/2
          h-[min(850px,140vw)]
          w-[min(850px,140vw)]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[var(--color-accent-glow)]
          opacity-20
          blur-[220px]
        "
      />

      <header
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-5xl
          items-center
          grid
          grid-cols-[auto_minmax(0,1fr)_auto]
          gap-3
          px-4
          py-6
          sm:px-6
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
            truncate
            text-center
            sm:text-xs
          "
        >
          LLM + SQLite Engine
        </span>

        <a
          href="https://github.com/Niki110607/infinite_craft"
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

      <main
        className="
          relative
          z-10
          mx-auto
          flex
          flex-col
          w-full
          max-w-5xl
          flex-1
          px-4
          pb-16
          sm:px-6
        "
      >
        <div
          className="
            pt-10
            pb-10
            text-center
            sm:pt-14
            sm:pb-12
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
            Infinite Craft Clone
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
              ? "KI-gestützte Kombinations-Engine mit Qwen und SQLite"
              : "AI-powered combination engine using Qwen and SQLite"}
          </p>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-zinc-800/80
            px-1
            pb-3
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
            {langIsGerman ? "Craft Workspace" : "Craft Workspace"}
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
              {langIsGerman ? "Engine bereit" : "Engine Ready"}
            </span>
          </div>
        </div>

        <section className="w-full pt-5">
          <CraftBoard />
        </section>

        <section
          className="
            mt-10
            w-full
            border-y
            border-zinc-800/70
            py-5
          "
        >
          <div className="grid grid-cols-3 gap-y-5">
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
                {langIsGerman ? "Cache" : "Cache"}
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
                SQLite
              </div>
            </div>

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
                {langIsGerman ? "LLM-Latenz" : "LLM Latency"}
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
                ~200 ms
              </div>
            </div>

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
                {langIsGerman ? "LLM-Modell" : "LLM Model"}
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
                Qwen 27B
              </div>
            </div>
          </div>
        </section>

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
              transition-all
              hover:border-zinc-700
              hover:text-zinc-200
            "
          >
            <span>
              {showTechDetails
                ? langIsGerman
                  ? "System-Spezifikationen ausblenden"
                  : "Hide System Specs"
                : langIsGerman
                  ? "System-Spezifikationen anzeigen"
                  : "Inspect System Specs"}
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
                mb-7
                flex
                gap-6
                overflow-x-auto
                border-b
                border-zinc-800/80
                text-xs
                font-mono
              "
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition-colors
                  ${
                    activeTab === "overview"
                      ? "border-[var(--color-accent)] font-bold text-[var(--color-accent)]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {langIsGerman ? "Kombinationsablauf" : "Combination Flow"}
              </button>

              <button
                onClick={() => setActiveTab("llm")}
                className={`
                  whitespace-nowrap
                  border-b-2
                  pb-3
                  transition-colors
                  ${
                    activeTab === "llm"
                      ? "border-[var(--color-accent)] font-bold text-[var(--color-accent)]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }
                `}
              >
                {langIsGerman ? "LLM Engine" : "LLM Engine"}
              </button>
            </div>

            {activeTab === "overview" && (
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

                    {langIsGerman
                      ? "Eingaben normalisieren"
                      : "Normalize Inputs"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Die beiden Item-Namen werden vereinheitlicht und alphabetisch sortiert. Dadurch wird aus Fire + Water und Water + Fire derselbe Schlüssel und beide Anfragen greifen auf dieselbe Kombination zu."
                      : "The two item names are normalized and sorted alphabetically. This turns Fire + Water and Water + Fire into the same key, so both requests resolve to the same combination."}
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
                      ? "SQLite zuerst prüfen"
                      : "Check SQLite First"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Bevor das Sprachmodell aufgerufen wird, sucht der Backend-Service nach dem normalisierten Paar in SQLite. Bereits entdeckte Kombinationen werden direkt zurückgegeben und benötigen keinen weiteren Modellaufruf."
                      : "Before calling the language model, the backend looks up the normalized pair in SQLite. Previously discovered combinations are returned immediately without another model call."}
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

                    {langIsGerman ? "Ergebnis speichern" : "Store the Result"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Bei einer neuen Kombination erzeugt Qwen einen Namen und ein passendes Emoji. Beides wird zusammen mit dem Paar dauerhaft in SQLite gespeichert, sodass das Ergebnis bei zukünftigen Anfragen wiederverwendet werden kann."
                      : "For a new combination, Qwen generates an item name and a matching emoji. Both are stored with the pair in SQLite, so the result can be reused for future requests."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "llm" && (
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

                    {langIsGerman ? "Qwen via Groq" : "Qwen via Groq"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Das Backend verwendet Qwen 3.8 27B, um aus zwei Begriffen einen einzelnen, logisch oder kreativ passenden neuen Begriff abzuleiten."
                      : "The backend uses Qwen 3.8 27B to turn two concepts into a single result that is logically or creatively connected to both inputs."}
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

                    {langIsGerman ? "Prompt-Vorgaben" : "Prompt Rules"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Ein System-Prompt legt fest, dass Ergebnisse kurz, verständlich und nicht einfach zusammengesetzte Wörter sein sollen. Für passende Fälle sind auch Popkultur- und Gaming-Referenzen erlaubt."
                      : "A system prompt requires results to be concise, recognizable, and more meaningful than simply concatenating the two input words. Pop-culture and gaming references are allowed when the inputs strongly support them."}
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
                      ? "Strukturierte Antwort"
                      : "Structured Output"}
                  </div>

                  <p className="mt-2 leading-relaxed">
                    {langIsGerman
                      ? "Das Modell liefert ausschließlich JSON mit einem Ergebnisnamen und einem Emoji. Das Backend kann die Antwort dadurch direkt parsen, speichern und an den nächsten Verarbeitungsschritt weitergeben."
                      : "The model returns JSON containing only the result name and an emoji. The backend can parse, store, and pass the response directly to the next step."}
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
