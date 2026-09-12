from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chess_engine.mcts import MCTS

router = APIRouter(prefix="/chess", tags=["chess"])

class EvalRequest(BaseModel):
    fen: str

@router.post("/eval")
def evaluate_position(payload: EvalRequest):
    game = MCTS()
    game.play_game()
    best_move, evaluation = game.evaluate_position(payload.fen)
    return {"best_move": best_move.uci(), "evaluation": evaluation}