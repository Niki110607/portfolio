import React from "react";
import { Link } from "react-router-dom";

const PROJECT_THEMES = {
  cnn: {
    theme: "cnn",
    label: "MACHINE LEARNING",
    number: "01",
  },
  blackjack: {
    theme: "casino",
    label: "REINFORCEMENT LEARNING",
    number: "02",
  },
  chess: {
    theme: "chess",
    label: "GAME AI",
    number: "03",
  },
  craft: {
    theme: "craft",
    label: "GENERATIVE SYSTEM",
    number: "04",
  },
};

export default function ProjectCard({
  id,
  title,
  description,
  technologies,
  path,
}) {
  const project = PROJECT_THEMES[id] || {
    theme: "craft",
    label: "PROJECT",
    number: "—",
  };

  return (
    <Link
      to={path}
      data-theme={project.theme}
      className="
        group
        relative
        block
        w-full
        border-t
        border-zinc-800/80
        py-7
        sm:py-8
        transition-all
        duration-300
      "
    >
      {/* Accent line */}
      <div
        className="
          absolute
          left-0
          top-0
          h-px
          w-0
          bg-[var(--color-accent)]
          transition-all
          duration-500
          group-hover:w-full
        "
      />

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[72px_minmax(0,1fr)_220px]
          gap-5
          md:gap-8
          items-start
        "
      >
        {/* Number */}
        <div
          className="
            flex
            md:block
            items-center
            gap-3
          "
        >
          <span
            className="
              text-[10px]
              font-mono
              uppercase
              tracking-[0.16em]
              text-zinc-600
              transition-colors
              group-hover:text-[var(--color-accent)]
            "
          >
            {project.number}
          </span>

          <span
            className="
              md:hidden
              h-px
              w-8
              bg-zinc-800
            "
          />

          <span
            className="
              md:hidden
              text-[9px]
              font-mono
              uppercase
              tracking-[0.14em]
              text-zinc-600
            "
          >
            {project.label}
          </span>
        </div>

        {/* Main project information */}
        <div className="min-w-0">
          <div
            className="
              hidden
              md:block
              mb-2
              text-[9px]
              font-mono
              uppercase
              tracking-[0.16em]
              text-zinc-600
            "
          >
            {project.label}
          </div>

          <div className="flex items-center gap-3">
            <h2
              className="
                text-xl
                sm:text-2xl
                md:text-3xl
                font-bold
                tracking-[-0.03em]
                text-white
                transition-colors
                duration-200
                group-hover:text-[var(--color-accent)]
              "
            >
              {title}
            </h2>

            <span
              className="
                hidden
                sm:inline
                text-lg
                text-zinc-700
                transition-all
                duration-300
                group-hover:text-[var(--color-accent)]
                group-hover:translate-x-1
              "
            >
              ↗
            </span>
          </div>

          <p
            className="
              mt-3
              max-w-2xl
              text-xs
              sm:text-sm
              leading-relaxed
              text-zinc-500
            "
          >
            {description}
          </p>
        </div>

        {/* Project metadata */}
        <div
          className="
            flex
            flex-col
            items-start
            md:items-end
            gap-3
            md:pt-5
          "
        >
          <div
            className="
              flex
              flex-wrap
              md:justify-end
              gap-x-3
              gap-y-2
            "
          >
            {technologies?.map((tech) => (
              <span
                key={tech.name}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-mono
                  text-zinc-500
                  transition-colors
                  group-hover:text-zinc-300
                "
              >
                {tech.img_path && (
                  <img
                    src={tech.img_path}
                    alt=""
                    className="
                      h-3.5
                      w-3.5
                      object-contain
                      opacity-70
                      grayscale
                      transition-all
                      duration-200
                      group-hover:opacity-100
                      group-hover:grayscale-0
                    "
                  />
                )}

                {tech.name}
              </span>
            ))}
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-mono
              uppercase
              tracking-[0.16em]
              text-zinc-700
              transition-colors
              group-hover:text-zinc-500
            "
          >
            Open Project
            <span className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
