"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { EraseIcon, SaveIcon } from "./IconComponents";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        setContext(ctx);
      }
    }
  }, []);

  const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!context) return;
      event.preventDefault();
      const { x, y } = getCoords(event);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    },
    [context]
  );

  const draw = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !context) return;
      event.preventDefault();
      const { x, y } = getCoords(event);
      context.lineTo(x, y);
      context.stroke();
    },
    [isDrawing, context]
  );

  const stopDrawing = useCallback(() => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  }, [context]);

  const handleClear = () => {
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      // Check if the canvas has any drawing by comparing to empty canvas
      const emptyCanvas = document.createElement("canvas");
      emptyCanvas.width = canvasRef.current.width;
      emptyCanvas.height = canvasRef.current.height;
      const emptyDataUrl = emptyCanvas.toDataURL("image/png");

      if (dataUrl !== emptyDataUrl) {
        onSave(dataUrl);
      } else {
        alert("Please draw your signature before saving.");
      }
    }
  };

  return (
    <div className="signature-pad">
      <canvas
        ref={canvasRef}
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="button-container">
        <button onClick={handleClear} className="clear-btn">
          <EraseIcon />
          Clear
        </button>
        <button onClick={handleSave} className="save-btn">
          <SaveIcon />
          Save
        </button>
      </div>
    </div>
  );
};
