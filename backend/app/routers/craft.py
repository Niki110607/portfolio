from fastapi import APIRouter
from pydantic import BaseModel

from app.services.infinite_craft.database import CombinationDb
from app.services.infinite_craft.model import Qwen

db = CombinationDb()
model = Qwen()

item_emoji_dic = {}

router = APIRouter(prefix="/craft", tags=["infinite_craft"])

class CraftPayload(BaseModel):
    item1: str
    item2: str

@router.post("/predict")
def combine_items(payload: CraftPayload):
    return get_combination(payload.item1, payload.item2)


def get_combination(item1, item2):
    combination = db.get_combination(item1, item2)

    if combination:
        return combination

    combination = model.combine_items(item1, item2)

    name = combination["name"]

    if name not in item_emoji_dic:
        item_emoji_dic[name] = combination["emoji"]

    combination["emoji"] = item_emoji_dic[name]

    db.save_combination(item1, item2, combination["name"], combination["emoji"])

    return combination