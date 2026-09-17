import React from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";

const Projects = [
  {
    id: "cnn",
    title: "CNN from scratch",
    description:
      "Draw a number on an HTML5 canvas and watch a neural network predict it live.",
    technologies: [
      {
        name: "Python",
        img_path: "Python.png",
      },
      {
        name: "NumPy",
        img_path: "NumPy.png",
      },
    ],
    path: "/cnn",
  },

  {
    id: "blackjack",
    title: "Blackjack RL Agent",
    description:
      "A reinforcement learning agent trained through simulated Blackjack gameplay.",
    technologies: [
      {
        name: "Python",
        img_path: "Python.png",
      },
      {
        name: "PyTorch",
        img_path: "PyTorch.png",
      },
    ],
    path: "/blackjack",
  },

  {
    id: "chess",
    title: "Chess Engine",
    description:
      "Transformer-based chess engine combined with Monte Carlo tree search.",
    technologies: [
      {
        name: "Python",
        img_path: "Python.png",
      },
      {
        name: "PyTorch",
        img_path: "PyTorch.png",
      },
    ],
    path: "/chess",
  },

  {
    id: "craft",
    title: "Infinite Craft",
    description:
      "An element-combining sandbox powered by generative language-model logic.",
    technologies: [
      {
        name: "Python",
        img_path: "Python.png",
      },
      {
        name: "SQLite",
        img_path: "SQL.png",
      },
    ],
    path: "/craft",
  },
];

export default function Home() {
  return (
    <div
      className="
        min-h-screen
        bg-[#09090b]
        text-zinc-100
        font-sans
        overflow-x-hidden
      "
    >
      {/* =========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <div
        className="
          fixed
          left-1/2
          top-[-260px]
          -translate-x-1/2
          w-[650px]
          h-[650px]
          rounded-full
          bg-indigo-500/[0.025]
          blur-[180px]
          pointer-events-none
        "
      />

      {/* =========================================
          HEADER
      ========================================== */}

      <header
        className="
          relative
          z-10
          w-full
          max-w-5xl
          mx-auto
          px-6
          py-6
          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            text-xs
            font-mono
            uppercase
            tracking-[0.16em]
            text-zinc-300
          "
        >
          Portfolio
        </span>

        <nav className="flex items-center gap-5 sm:gap-7">
          <a
            href="#work"
            className="
              text-[10px]
              sm:text-xs
              font-mono
              uppercase
              tracking-wider
              text-zinc-600
              hover:text-zinc-200
              transition-colors
            "
          >
            Work
          </a>

          <a
            href="#about"
            className="
              text-[10px]
              sm:text-xs
              font-mono
              uppercase
              tracking-wider
              text-zinc-600
              hover:text-zinc-200
              transition-colors
            "
          >
            About
          </a>

          <a
            href="#contact"
            className="
              text-[10px]
              sm:text-xs
              font-mono
              uppercase
              tracking-wider
              text-zinc-600
              hover:text-zinc-200
              transition-colors
            "
          >
            Contact
          </a>
        </nav>
      </header>

      <main className="relative z-10">
        {/* =========================================
            HERO
        ========================================== */}

        <section
          className="
            w-full
            max-w-5xl
            mx-auto
            px-6
            pt-24
            sm:pt-32
            pb-28
            sm:pb-36
          "
        >
          <div
            className="
              max-w-3xl
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-zinc-500
                "
              />

              <span
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Placeholder / Introduction
              </span>
            </div>

            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-extrabold
                tracking-[-0.055em]
                leading-[0.95]
                text-white
              "
            >
              Building intelligent
              <br />
              interactive systems.
            </h1>

            <p
              className="
                mt-7
                max-w-2xl
                text-sm
                sm:text-base
                leading-relaxed
                text-zinc-500
              "
            >
              Placeholder for your personal introduction. This space can explain
              who you are, what you build, and the kind of problems you like
              working on.
            </p>

            <div
              className="
                mt-9
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <a
                href="#work"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-zinc-800
                  bg-zinc-900
                  px-4
                  py-2.5
                  text-xs
                  font-mono
                  uppercase
                  tracking-wider
                  text-zinc-300
                  transition
                  hover:border-zinc-700
                  hover:bg-zinc-800
                  hover:text-white
                  active:scale-95
                "
              >
                Explore Work
                <span>↓</span>
              </a>

              <a
                href="#contact"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-zinc-800
                  bg-transparent
                  px-4
                  py-2.5
                  text-xs
                  font-mono
                  uppercase
                  tracking-wider
                  text-zinc-500
                  transition
                  hover:border-zinc-700
                  hover:text-zinc-200
                  active:scale-95
                "
              >
                Get in Touch
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            WORK
        ========================================== */}

        <section
          id="work"
          className="
            w-full
            max-w-5xl
            mx-auto
            px-6
            pb-28
            sm:pb-36
            scroll-mt-10
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              pb-4
              border-b
              border-zinc-800/80
            "
          >
            <div>
              <div
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Selected Work
              </div>

              <h2
                className="
                  mt-2
                  text-xl
                  sm:text-2xl
                  font-bold
                  tracking-[-0.03em]
                  text-white
                "
              >
                Projects
              </h2>
            </div>

            <span
              className="
                text-[9px]
                font-mono
                uppercase
                tracking-[0.16em]
                text-zinc-700
              "
            >
              04 Projects
            </span>
          </div>

          <div>
            {Projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>

        {/* =========================================
            ABOUT
        ========================================== */}

        <section
          id="about"
          className="
            w-full
            border-y
            border-zinc-800/70
            scroll-mt-10
          "
        >
          <div
            className="
              max-w-5xl
              mx-auto
              px-6
              py-24
              sm:py-28
              grid
              grid-cols-1
              md:grid-cols-[180px_minmax(0,1fr)]
              gap-10
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                About
              </span>
            </div>

            <div className="max-w-3xl">
              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  tracking-[-0.035em]
                  text-white
                "
              >
                Placeholder for your story.
              </h2>

              <p
                className="
                  mt-5
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-zinc-500
                "
              >
                Placeholder text for a short biography, background, education,
                interests, or whatever context you want visitors to know before
                exploring the individual projects.
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-zinc-500
                "
              >
                A second paragraph can describe how you approach building
                things, what technologies you enjoy, or what kind of work you
                are currently interested in.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            FOCUS / CAPABILITIES
        ========================================== */}

        <section
          className="
            w-full
            max-w-5xl
            mx-auto
            px-6
            py-24
            sm:py-28
          "
        >
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-12
              md:gap-20
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Focus
              </span>

              <h2
                className="
                  mt-2
                  text-2xl
                  sm:text-3xl
                  font-bold
                  tracking-[-0.035em]
                  text-white
                "
              >
                Placeholder for your
                <br />
                technical focus.
              </h2>
            </div>

            <div>
              <div
                className="
                  divide-y
                  divide-zinc-800/70
                  border-y
                  border-zinc-800/70
                "
              >
                {[
                  "Machine Learning",
                  "Reinforcement Learning",
                  "Interactive Systems",
                  "Generative AI",
                  "Full-Stack Development",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      justify-between
                      py-4
                    "
                  >
                    <span
                      className="
                        text-xs
                        sm:text-sm
                        font-mono
                        text-zinc-400
                      "
                    >
                      {item}
                    </span>

                    <span
                      className="
                        text-[9px]
                        font-mono
                        text-zinc-700
                      "
                    >
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>

              <p
                className="
                  mt-6
                  text-xs
                  leading-relaxed
                  text-zinc-600
                "
              >
                Placeholder copy for additional context about your technical
                interests and the kinds of systems represented in this
                portfolio.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CONTACT
        ========================================== */}

        <section
          id="contact"
          className="
            w-full
            border-t
            border-zinc-800/70
            scroll-mt-10
          "
        >
          <div
            className="
              max-w-5xl
              mx-auto
              px-6
              py-24
              sm:py-28
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-10
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-[0.18em]
                  text-zinc-600
                "
              >
                Contact
              </span>

              <h2
                className="
                  mt-2
                  text-3xl
                  sm:text-4xl
                  font-bold
                  tracking-[-0.04em]
                  text-white
                "
              >
                Placeholder for
                <br />
                contact information.
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <a
                href="mailto:placeholder@example.com"
                className="
                  text-sm
                  sm:text-base
                  font-mono
                  text-zinc-300
                  hover:text-white
                  transition-colors
                "
              >
                placeholder@example.com
              </a>

              <span
                className="
                  text-[10px]
                  font-mono
                  uppercase
                  tracking-wider
                  text-zinc-700
                "
              >
                Replace with your preferred contact method
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          FOOTER
      ========================================== */}

      <footer
        className="
          border-t
          border-zinc-900
          px-6
          py-6
        "
      >
        <div
          className="
            max-w-5xl
            mx-auto
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          "
        >
          <span
            className="
              text-[9px]
              font-mono
              uppercase
              tracking-[0.16em]
              text-zinc-700
            "
          >
            Portfolio / Placeholder
          </span>

          <span
            className="
              text-[9px]
              font-mono
              uppercase
              tracking-[0.16em]
              text-zinc-800
            "
          >
            Built with React
          </span>
        </div>
      </footer>
    </div>
  );
}
