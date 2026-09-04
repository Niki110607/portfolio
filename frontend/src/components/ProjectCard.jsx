import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({
  title,
  description,
  technologies,
  path,
}) {
  return (
    <Link
      to={path}
      className="group relative flex flex-col justify-between h-full p-8 rounded-xl bg-color-secondary/80 border border-color-border transition-all duration-300 ease-out hover:-translate-y-1 hover:border-color-accent hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-100 group-hover:text-color-accent transition-colors duration-200">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-400 font-normal">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-color-border/60 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-1.5 text-xs font-medium bg-color-main/90 border border-color-border/80 px-2.5 py-1 rounded-md text-gray-300"
            >
              <img
                src={tech.img_path}
                alt={tech.name}
                className="h-3.5 w-3.5 object-contain"
              />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-color-accent">
          <span>View Project</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

//https://techicons.dev/?search=python
