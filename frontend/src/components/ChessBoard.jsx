import React, { useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function ChessBoard() {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  function makeRandomMove() {
    const possible_moves = chessGame.moves();

    if (chessGame.isGameOver()) return;

    const randomMove =
      possible_moves[Math.floor(Math.random() * possible_moves.length)];

    chessGame.move(randomMove);

    setChessPosition(chessGame.fen());
  }

  function onPieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare) return false;

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      setChessPosition(chessGame.fen());

      setTimeout(makeRandomMove, 500);

      return true;
    } catch {
      return false;
    }
  }

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "test",
  };

  return (
    <div className="w-full max-w-125 aspect-square">
      <Chessboard options={chessboardOptions} />
    </div>
  );
}
