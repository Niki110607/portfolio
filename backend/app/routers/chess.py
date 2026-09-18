from threading import Lock

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chess_engine.mcts import MCTS

router = APIRouter(prefix="/chess", tags=["chess"])

game = MCTS()
game_lock = Lock()


class EvalRequest(BaseModel):
    fen: str


@router.post("/eval")
def evaluate_position(payload: EvalRequest):
    with game_lock:
        game.play_game(payload.fen)
        best_move, evaluation = game.evaluate_position()

    return {
        "best_move": best_move.uci(),
        "evaluation": evaluation,
    }