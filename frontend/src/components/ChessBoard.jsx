import React, { useEffect, useRef, useState } from "react";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { API_BASE_URL } from "../lib/api";

const PIECE_TYPES = ["P", "N", "B", "R", "Q", "K"];

const pieceImageSrc = (pieceCode) => `/chessPieces/${pieceCode}.svg`;

const STARTING_POSITION = new Chess().fen();

/* Custom piece renderer */
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
            /* Keep pieces separated from the board without a heavy shadow. */
            filter: isBlack
              ? "drop-shadow(0 2px 2px rgba(0,0,0,0.45))"
              : "drop-shadow(0 2px 2px rgba(0,0,0,0.28))",
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
      const response = await fetch(`${API_BASE_URL}/chess/eval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen: chessGameRef.current.fen(),
        }),
      });

      if (!response.ok) {
        throw new Error("Engine request failed");
      }

      const data = await response.json();
      const engineMove = chessGameRef.current.move(data.best_move);

      if (!engineMove) {
        throw new Error("Invalid engine move");
      }

      onEvalUpdate?.(data.evaluation);

      setLastMove({
        from: engineMove.from,
        to: engineMove.to,
      });

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
    if (!targetSquare || isThinking) {
      return false;
    }

    try {
      const playerMove = chessGameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!playerMove) {
        return false;
      }

      setLastMove({
        from: playerMove.from,
        to: playerMove.to,
      });

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

  /* Amber move indicators against the graphite board */
  const squareStyles = lastMove
    ? {
        [lastMove.from]: {
          backgroundColor: "rgba(217, 119, 6, 0.16)",
          boxShadow: "inset 0 0 0 1px rgba(217,119,6,0.16)",
        },
        [lastMove.to]: {
          backgroundColor: "rgba(217, 119, 6, 0.34)",
          boxShadow: "inset 0 0 0 1px rgba(217,119,6,0.22)",
        },
      }
    : {};

  return (
    <div
      className="
        relative
        w-full
        aspect-square
        bg-zinc-950
        p-2
        rounded-2xl
        border
        border-zinc-800/80
        shadow-2xl
        group
      "
      style={{
        containerType: "inline-size",
        touchAction: "none",
      }}
      data-theme="chess"
    >
      {/* =========================================
          CHESSBOARD
      ========================================== */}
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

          /* Neutral graphite palette */
          darkSquareStyle: {
            backgroundColor: "#252932",
          },
          lightSquareStyle: {
            backgroundColor: "#3f4551",
          },

          /* Understated notation */
          darkSquareNotationStyle: {
            color: "rgba(255,255,255,0.32)",
            fontSize: "10px",
          },
          lightSquareNotationStyle: {
            color: "rgba(255,255,255,0.22)",
            fontSize: "10px",
          },

          boardStyle: {
            borderRadius: "0.75rem",

            /* Soft inner depth */
            boxShadow: "inset 0 0 16px rgba(0,0,0,0.48)",
            overflow: "hidden",
          },
          squareStyles,
        }}
      />
    </div>
  );
}
