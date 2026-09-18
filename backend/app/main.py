from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.blackjack import router as bj_router
from app.routers.chess import router as chess_router
from app.routers.cnn import router as cnn_router
from app.routers.craft import router as craft_router

app = FastAPI(title="AI Arcade Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://portfolio-frontend-yqf4.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chess_router)
app.include_router(cnn_router)
app.include_router(bj_router)
app.include_router(craft_router)

@app.get("/")
async def root():
    return {"status": "online", "message": "Portfolio API operational"}

@app.get("/health")
def health():
    return {"status": "ok"}