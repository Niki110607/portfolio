import React from "react";
import ProjectCard from "./components/project_card";

const Projects = [
  {
    id: "cnn",
    title: "CNN from scratch",
    description:
      "Draw a number on an HTML5 canvas and watch a neural network predict it live",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "Numpy", img_path: "NumPy.png" },
    ],
    path: "/cnn",
  },
  {
    id: "blackjack",
    title: "Blackjack rl agent",
    description:
      "A blackjack agent that learned the game over 1 million hands and is pretty good",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "Pytorch", img_path: "PyTorch.png" },
    ],
    path: "/blackjack",
  },
  {
    id: "chess",
    title: "Chess Engine",
    description:
      "Transformer based chess engine. It is combined with a tree search algorithm and reaches 2000+ elo",
    technologies: [
      { name: "Python", img_path: "Python.png" },
      { name: "Pytorch", img_path: "PyTorch.png" },
    ],
    path: "/chess",
  },
  {
    id: "craft",
    title: "Infinite-Craft clone",
    description:
      "An element-combining sandbox powered by LLM combination logic",
    technologies: [
      { name: "Python", img_path: "python-2.png" },
      { name: "SQL-lite", img_path: "SQL.png" },
    ],
    path: "/craft",
  },
];

export default function Home() {
  return (
    <main className="flex items-center justify-center p-6 md:p-12 min-h-screen w-full bg-color-main text-color-text">
      <div className="grid md:grid-cols-2 gap-6 items-center justify-center w-full max-w-5xl">
        {Projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </main>
  );
}
