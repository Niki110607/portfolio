import torch
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.blackjack.dqn_agent import DQN

router = APIRouter(prefix="/blackjack", tags=["blackjack"])

model = DQN()
model.load_state_dict(torch.load("models/blackjack_model_weights.pth"))

class BlackjackPayload(BaseModel):
    player_value: float
    dealer_value: float
    is_soft: bool
    can_double: bool
    can_split: bool

@router.post("/predict")
def predict_move(payload: BlackjackPayload):
    state = (float(payload.player_value), float(payload.dealer_value), float(payload.is_soft))
    state = torch.tensor(state).float().unsqueeze(0)

    with torch.no_grad():
        q_values = model(state).squeeze()

    if not payload.can_double:
        q_values[2] = -999.0
    if not payload.can_split:
        q_values[3] = -999.0

    probabilities = torch.softmax(q_values * 3, dim=0)

    return {"q_values": q_values.tolist(), "probabilities": probabilities.tolist()}