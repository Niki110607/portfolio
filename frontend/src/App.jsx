// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import ChessPage from "./pages/Chess";
import CnnPage from "./pages/Cnn";
import BlackjackPage from "./pages/Blackjack";
import InfinitePage from "./pages/InfiniteCraft";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chess" element={<ChessPage />} />
        <Route path="/cnn" element={<CnnPage />} />
        <Route path="/blackjack" element={<BlackjackPage />} />
        <Route path="/craft" element={<InfinitePage />} />
      </Routes>
    </>
  );
}
