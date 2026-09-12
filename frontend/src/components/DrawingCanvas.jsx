import React, { useRef, useState, useEffect } from "react";

export default function DrawingCanvas({ onPrediction, onClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adjusted stroke width for 28x28 resolution
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white";
  }, []);

  // Helper to map mouse coordinates from the large display size down to the 28x28 grid
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate scale factors between display size and internal 28x28 grid
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = async () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);

    const pixels = getPixels();
    const data = await predictDigit(pixels);

    if (data && onPrediction) {
      onPrediction(data);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (onClear) onClear();
  };

  const getPixels = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imgData = ctx.getImageData(0, 0, 28, 28).data;
    const normalized = [];

    for (let i = 1; i < imgData.length; i += 4) {
      const redValue = imgData[i];
      normalized.push(redValue);
    }

    return normalized;
  };

  const predictDigit = async (pixels) => {
    const response = await fetch("http://127.0.0.1:8000/cnn/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pixels: pixels }),
    });
    const data = await response.json();

    return data;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas Container with Overlay Grid */}
      <div className="relative rounded-xl overflow-hidden border border-color-border/80 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={28}
          height={28}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-72 h-72 cursor-crosshair touch-none [image-rendering:pixelated]"
        />

        {/* Pointer-events-none grid overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "calc(100% / 28) calc(100% / 28)",
            }}
          />
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 w-72">
        <button
          onClick={clearCanvas}
          className="flex-1 py-2 px-3 bg-color-main/60 hover:border-color-accent border border-color-border/60 text-xs font-mono rounded-lg transition"
        >
          Clear
        </button>
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className="flex-1 py-2 px-3 bg-color-main/60 hover:border-color-accent border border-color-border/60 text-xs font-mono rounded-lg transition"
        >
          {showGrid ? "Hide Grid" : "Show Grid"}
        </button>
      </div>
    </div>
  );
}
