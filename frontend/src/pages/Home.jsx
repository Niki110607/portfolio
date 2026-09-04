import React from "react";
import ProjectCard from "../components/ProjectCard";

const Projects = [
  {
    id: "cnn",
    title: "CNN from scratch",
    description:
      "Draw a number on an HTML5 canvas and watch a neural network predict it live.",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "Numpy", img_path: "NumPy.png" },
    ],
    path: "/cnn",
  },
  {
    id: "blackjack",
    title: "Blackjack RL Agent",
    description:
      "A reinforcement learning agent that mastered the game over 1 million simulated hands.",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "PyTorch", img_path: "PyTorch.png" },
    ],
    path: "/blackjack",
  },
  {
    id: "chess",
    title: "Chess Engine",
    description:
      "Transformer-based engine combined with Monte Carlo tree search reaching 2000+ Elo.",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "PyTorch", img_path: "PyTorch.png" },
    ],
    path: "/chess",
  },
  {
    id: "craft",
    title: "Infinite-Craft Clone",
    description:
      "An element-combining sandbox environment powered by generative LLM combination logic.",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "SQLite", img_path: "SQL.png" },
    ],
    path: "/craft",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-color-main text-color-text flex items-center justify-center p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {Projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </main>
  );
}
