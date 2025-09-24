"use client";

import React, { useEffect, useRef, useState } from "react";

// Assumes pdfjsLib is loaded from CDN
declare const pdfjsLib: {
  getDocument: (data: ArrayBuffer | { data: ArrayBuffer }) => {
    promise: Promise<{
      numPages: number;
      getPage: (pageNum: number) => Promise<{
        getViewport: (options: { scale: number }) => {
          width: number;
          height: number;
        };
        render: (options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    }>;
  };
  GlobalWorkerOptions: {
    workerSrc: string;
  };
};

interface PdfViewerProps {
  file: File;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || typeof pdfjsLib === "undefined") {
      setError("PDF library is not available.");
      setLoading(false);
      return;
    }

    const renderPdf = async () => {
      setLoading(true);
      setError(null);
      if (!canvasContainerRef.current) return;
      canvasContainerRef.current.innerHTML = ""; // Clear previous renders

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          canvas.className = "pdf-page";
          const context = canvas.getContext("2d");

          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
            canvasContainerRef.current?.appendChild(canvas);
          }
        }
      } catch (err) {
        console.error("Failed to render PDF:", err);
        setError("Failed to load or render the PDF file.");
      } finally {
        setLoading(false);
      }
    };

    renderPdf();
  }, [file]);

  if (loading) {
    return (
      <div className="text-center p-8 text-slate-500">
        Loading PDF Preview...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-rose-500">{error}</div>;
  }

  return <div ref={canvasContainerRef} />;
};
