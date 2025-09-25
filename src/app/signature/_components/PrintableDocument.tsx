/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// Type definitions
interface PageData {
  canvas: HTMLCanvasElement;
  viewport: any;
}

interface PdfElement {
  id: string;
  type: "signature" | "text";
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl?: string;
  text?: string;
  fontSize?: number;
  color?: string;
}

interface PrintableDocumentProps {
  pdfPages: PageData[];
  elements: PdfElement[];
  fileName?: string;
}

const PrintableDocument = React.forwardRef<
  HTMLDivElement,
  PrintableDocumentProps
>(({ pdfPages, elements }, ref) => {
  return (
    <div ref={ref} className="printable-document">
      {/* Exact replica of what user sees on screen */}
      {pdfPages.map((page, pageIndex) => (
        <div key={`print-page-${pageIndex}`} className="print-page">
          <div className="page-content" style={{ position: "relative" }}>
            <canvas
              ref={(node) => {
                if (node && page.canvas) {
                  const context = node.getContext("2d");
                  if (context) {
                    // Clear canvas first
                    context.clearRect(0, 0, node.width, node.height);
                    // Draw PDF page exactly as shown on screen
                    context.drawImage(page.canvas, 0, 0);
                  }
                }
              }}
              width={page.canvas.width}
              height={page.canvas.height}
              style={{
                width: page.canvas.width,
                height: page.canvas.height,
                display: "block",
              }}
            />

            {/* Render elements exactly as positioned on screen */}
            {elements
              .filter((el) => el.pageIndex === pageIndex)
              .map((el) => (
                <div
                  key={`print-element-${el.id}`}
                  style={{
                    position: "absolute",
                    left: el.x + 30,
                    top: el.y + 145,
                    width: el.width,
                    height: el.height,
                    pointerEvents: "none", // Prevent interaction during print
                  }}
                >
                  {el.type === "signature" && el.dataUrl ? (
                    <img
                      src={el.dataUrl}
                      alt="Signature"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : el.type === "text" && el.text ? (
                    <span
                      style={{
                        fontSize: el.fontSize,
                        color: el.color,
                        display: "block",
                        width: "100%",
                        height: "100%",
                        fontFamily: "inherit",
                      }}
                    >
                      {el.text}
                    </span>
                  ) : null}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
});

PrintableDocument.displayName = "PrintableDocument";

export default PrintableDocument;
