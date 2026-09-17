import React, { useCallback, useEffect, useRef, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function DrawingCanvas({ onPrediction, onClear }) {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX;
    const clientY = e.clientY;

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

    try {
      const response = await fetch(`${API_BASE_URL}/cnn/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pixels }),
      });

      if (!response.ok) throw new Error("Inference failed");

      const data = await response.json();

      if (data && onPrediction) onPrediction(data);
    } catch (err) {
      console.error("Prediction Error:", err);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Viewport with Light Border */}
      <div
        className="
          relative
          h-72
          w-72
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800/60
          bg-black
          sm:h-80
          sm:w-80
        "
      >
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
          className="
            relative
            z-10
            h-full
            w-full
            cursor-crosshair
            touch-none
            [image-rendering:pixelated]
          "
        />

        {showGrid && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
              opacity-20
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  to right,
                  rgba(255,255,255,0.4) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.4) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "calc(100% / 28) calc(100% / 28)",
            }}
          />
        )}
      </div>

      {/* Control Actions */}
      <div className="flex w-72 items-center gap-3 sm:w-80">
        <button
          onClick={clearCanvas}
          className="
            flex-1
            rounded-xl
            border
            border-[var(--color-border)]
            bg-zinc-900
            px-4
            py-2
            text-xs
            font-medium
            text-zinc-300
            transition
            active:scale-95
            hover:bg-zinc-800
            hover:text-white
          "
        >
          Clear Canvas
        </button>

        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className={`
            rounded-xl
            border
            px-4
            py-2
            text-xs
            font-medium
            transition
            active:scale-95
            ${
              showGrid
                ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }
          `}
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
      </div>
    </div>
  );
}
