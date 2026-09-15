import React, { useRef, useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function DrawingCanvas({ onPrediction, onClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(true);

  const initCanvas = useCallback((drawSample = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";

    if (drawSample) {
      ctx.beginPath();
      ctx.moveTo(7, 7);
      ctx.lineTo(21, 21);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    initCanvas(true);
    setHasDrawn(true);
  }, [initCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 0.9, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = async (e) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);

    await triggerPrediction();
  };

  const clearCanvas = () => {
    initCanvas(false);
    setHasDrawn(false);
    if (onClear) onClear();
  };

  const triggerPrediction = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, 28, 28).data;
    const pixels = [];

    for (let i = 0; i < imgData.length; i += 4) {
      pixels.push(imgData[i]);
    }

    setIsPredicting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/cnn/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixels }),
      });

      if (!response.ok) throw new Error("Inference failed");

      const data = await response.json();
      if (data && onPrediction) onPrediction(data);
    } catch (err) {
      console.error("Prediction Error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Canvas Header Bar */}
      <div className="flex items-center justify-between w-72 sm:w-80 text-[11px] font-mono text-zinc-500 px-1">
        <span>DRAW AREA (28x28)</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              hasDrawn ? "bg-[var(--color-accent)]" : "bg-zinc-600"
            }`}
          />
          <span className="text-zinc-300">{hasDrawn ? "Active" : "Ready"}</span>
        </div>
      </div>

      {/* Viewport with Light Border */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-black border border-zinc-800/60">
        <canvas
          ref={canvasRef}
          width={28}
          height={28}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none [image-rendering:pixelated] relative z-10"
        />

        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
              `,
              backgroundSize: "calc(100% / 28) calc(100% / 28)",
            }}
          />
        )}
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3 w-72 sm:w-80">
        <button
          onClick={clearCanvas}
          className="flex-1 py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[var(--color-border)] text-xs font-medium text-zinc-300 hover:text-white transition active:scale-95"
        >
          Clear Canvas
        </button>
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className={`py-2 px-4 rounded-xl border text-xs font-medium transition active:scale-95 ${
            showGrid
              ? "bg-[var(--color-accent-glow)] border-[var(--color-accent)] text-[var(--color-accent)]"
              : "bg-zinc-900 hover:bg-zinc-800 border-[var(--color-border)] text-zinc-300 hover:text-white"
          }`}
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
      </div>
    </div>
  );
}
