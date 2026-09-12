import React from "react";
import { Link } from "react-router-dom";
import PlayingBoard from "../components/PlayingBoard";

export default function BlackjackPage() {
  return (
    <div className="min-h-screen bg-color-main text-color-text flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <header className="border-b border-color-border/60 bg-color-secondary/80 px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium text-color-text/70 hover:text-color-accent transition flex items-center gap-2"
        >
          ← Back to Portfolio
        </Link>
      </header>

      {/* 2. Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 flex flex-col items-center justify-center">
        {/* Playing Board Container Rectangle */}
        <div className="w-full max-w-4xl bg-color-secondary border border-color-border/80 rounded-2xl p-6 sm:p-10 shadow-xl flex flex-col items-center justify-center">
          <PlayingBoard />
        </div>
      </main>
    </div>
  );
}
