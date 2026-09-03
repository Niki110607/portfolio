import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard({ title, description, path }) {
  return (
    <Link
      to={path}
      className="flex flex-col p-10 gap-4 w-1/3 h-60 text-center bg-color-secondary border border-color-border hover:border-color-accent"
    >
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
}
