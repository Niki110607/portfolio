from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def digit_status():
    return {"model": "CNN Digit Classifier", "status": "Ready"}