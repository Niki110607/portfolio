// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ChessPage from "./pages/Chess";
import CnnPage from "./pages/Cnn";
import BlackjackPage from "./pages/Blackjack";
import InfinitePage from "./pages/InfiniteCraft";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chess" element={<ChessPage />} />
      <Route path="/cnn" element={<CnnPage />} />
      <Route path="/blackjack" element={<BlackjackPage />} />
      <Route path="/craft" element={<InfinitePage />} />
    </Routes>
  );
}
