import React, { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const PIECE_TYPES = ["P", "N", "B", "R", "Q", "K"];

const pieceImageSrc = (pieceCode) => `/chessPieces/${pieceCode}.svg`;

const STARTING_POSITION = new Chess().fen();

// Custom piece renderer with distinct drop-shadows for black and white SVG assets
const createPiece = (pieceCode) =>
  function ChessPiece({ svgStyle }) {
    const isBlack = pieceCode.startsWith("b");
    return (
      <div
        aria-hidden="true"
        style={{
          ...svgStyle,
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <img
          src={pieceImageSrc(pieceCode)}
          alt=""
          draggable={false}
          style={{
            width: "88%",
            height: "88%",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  };

const customPieces = Object.fromEntries(
  ["w", "b"].flatMap((side) =>
    PIECE_TYPES.map((type) => {
      const pieceCode = `${side}${type}`;
      return [pieceCode, createPiece(pieceCode)];
    }),
  ),
);

export default function ChessBoard({
  onEvalUpdate,
  onStatusChange,
  resetSignal,
}) {
  const chessGameRef = useRef(new Chess());
  const [chessPosition, setChessPosition] = useState(STARTING_POSITION);
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    chessGameRef.current = new Chess();
    setChessPosition(chessGameRef.current.fen());
    setLastMove(null);
    setIsThinking(false);
    onEvalUpdate?.(0);
    onStatusChange?.("Ready for your move");
  }, [resetSignal, onEvalUpdate, onStatusChange]);

  const getEngineMove = async () => {
    setIsThinking(true);
    onStatusChange?.("Engine is analyzing");

    try {
      const response = await fetch("http://127.0.0.1:8000/chess/eval/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: chessGameRef.current.fen() }),
      });

      if (!response.ok) throw new Error("Engine request failed");

      const data = await response.json();
      const engineMove = chessGameRef.current.move(data.best_move);

      if (!engineMove) throw new Error("Invalid engine move");

      onEvalUpdate?.(data.evaluation);
      setLastMove({ from: engineMove.from, to: engineMove.to });
      setChessPosition(chessGameRef.current.fen());
      onStatusChange?.(
        chessGameRef.current.isGameOver()
          ? "Game complete"
          : "Your turn — make a move",
      );
    } catch {
      onStatusChange?.("Engine unavailable — try again shortly");
    } finally {
      setIsThinking(false);
    }
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }) => {
    if (!targetSquare || isThinking) return false;

    try {
      const playerMove = chessGameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!playerMove) return false;

      setLastMove({ from: playerMove.from, to: playerMove.to });
      setChessPosition(chessGameRef.current.fen());

      if (chessGameRef.current.isGameOver()) {
        onStatusChange?.("Game complete");
      } else {
        void getEngineMove();
      }

      return true;
    } catch {
      return false;
    }
  };

  // Move highlights tuned for the slate tile background
  const squareStyles = lastMove
    ? {
        [lastMove.from]: {
          backgroundColor: "rgba(245, 158, 11, 0.22)",
        },
        [lastMove.to]: {
          backgroundColor: "rgba(245, 158, 11, 0.40)",
        },
      }
    : {};

  return (
    <div
      className="relative w-full aspect-square bg-zinc-950 p-2 rounded-2xl border border-zinc-800/80 shadow-2xl group"
      style={{ containerType: "inline-size" }}
    >
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-500/80 rounded-tl-sm opacity-60 group-hover:opacity-100 transition-opacity z-20" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-500/80 rounded-tr-sm opacity-60 group-hover:opacity-100 transition-opacity z-20" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-500/80 rounded-bl-sm opacity-60 group-hover:opacity-100 transition-opacity z-20" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-500/80 rounded-br-sm opacity-60 group-hover:opacity-100 transition-opacity z-20" />

      <Chessboard
        options={{
          id: "studio-chessboard",
          position: chessPosition,
          onPieceDrop,
          pieces: customPieces,
          allowDragging: !isThinking,
          allowDrawingArrows: true,
          animationDurationInMs: 220,
          showNotation: true,
          darkSquareStyle: { backgroundColor: "#2b303c" },
          lightSquareStyle: { backgroundColor: "#4a5264" },
          darkSquareNotationStyle: {
            color: "rgba(255, 255, 255, 0.35)",
            fontSize: "10px",
          },
          lightSquareNotationStyle: {
            color: "rgba(255, 255, 255, 0.25)",
            fontSize: "10px",
          },
          boardStyle: {
            borderRadius: "0.75rem",
            boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.9)",
            overflow: "hidden",
          },
          squareStyles,
        }}
      />
    </div>
  );
}
