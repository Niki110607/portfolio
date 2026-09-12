import numpy as np
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.cnn.cnn_main import init_model

router = APIRouter(prefix="/cnn", tags=["chess"])

model = init_model()

class DigitPayload(BaseModel):
    pixels: list[float]

@router.post("/predict")
def predict_digit(payload: DigitPayload):

    X = np.array(payload.pixels, dtype=np.float32).reshape(1, 1, 28, 28)

    result = model.predict(X)

    digit = np.argmax(result, axis=1).item()

    probabilities = result.tolist()[0]

    return {"digit": digit, "probabilities": probabilities}