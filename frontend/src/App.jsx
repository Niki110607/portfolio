import React from "react";
import ProjectCard from "./components/project_card";

const Projects = [
  {
    id: "cnn",
    title: "CNN from scratch",
    description:
      "Draw a number on an HTML5 canvas and watch a neural network predict it live",
    path: "/cnn",
  },
  {
    id: "blackjack",
    title: "Blackjack rl agent",
    description:
      "A blackjack agent that learned the game over 1 million hands and is pretty good",
    path: "/blackjack",
  },
  {
    id: "chess",
    title: "Chess Engine",
    description:
      "Transformer based chess engine. It is combined with a tree search algorithm and reaches 2000+ elo",
    path: "/chess",
  },
  {
    id: "craft",
    title: "Infinite-Craft clone",
    description:
      "An element-combining sandbox powered by LLM combination logic",
    path: "/craft",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-y-20 h-full w-screen items-center bg-color-main text-color-text">
      {Projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
