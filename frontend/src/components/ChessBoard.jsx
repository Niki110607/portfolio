import React, { useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function ChessBoard({ onEvalUpdate }) {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  const get_engine_move = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chess/eval/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: chessGame.fen() }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      make_engine_move({ data });
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const make_engine_move = ({ data }) => {
    if (onEvalUpdate) onEvalUpdate(data.evaluation);

    const engine_move = data.best_move;

    chessGame.move(engine_move);

    setChessPosition(chessGame.fen());
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }) => {
    if (!targetSquare) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      setChessPosition(chessGame.fen());

      if (!chessGame.isCheckmate()) get_engine_move();

      return true;
    } catch {
      return false;
    }
  };

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "test",
  };

  return (
    <div className="w-full aspect-square">
      <Chessboard options={chessboardOptions} />
    </div>
  );
}
