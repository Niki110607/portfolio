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
      className="group flex flex-col justify-between h-full bg-color-secondary border rounded-xl border-color-border hover:border-color-accent transition-all duration-200 p-6"
    >
      <div className="flex flex-col gap-3">
        <h2 className="uppercase text-left text-xl text-color-title font-bold tracking-wide">
          {title}
        </h2>
        <p className="text-left text-sm text-color-text leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-color-border">
        <div className="flex flex-wrap items-center gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-1.5 text-xs bg-color-main/50 px-2.5 py-1 rounded-md"
            >
              <img src={tech.img_path} className="h-4 w-4 object-contain" />
              <p>{tech.name}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 text-sm font-medium group-hover:text-color-accent transition-colors">
          <p>View Project</p>
          <p className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </p>
        </div>
      </div>
    </Link>
  );
}

//https://techicons.dev/?search=python
