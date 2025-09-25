import React from 'react';
import { PageData, PdfElement, StagedItem } from '../types';
import { Trash2Icon, RotateCcwIcon } from './icons';

interface PDFViewerProps {
  pdfPages: PageData[];
  elements: PdfElement[];
  stagedItem: StagedItem | null;
  isDragging: boolean;
  tempDragPos: { top: number; left: number } | null;
  pdfFile: File | null;
  pdfViewerRef: React.RefObject<HTMLDivElement | null>;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.MouseEvent<HTMLDivElement>) => void;
  deleteElement: (id: string) => void;
  handleRedrawFromPlaced: (elementId: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfPages,
  elements,
  stagedItem,
  isDragging,
  tempDragPos,
  pdfFile,
  pdfViewerRef,
  handleMouseMove,
  handleDrop,
  deleteElement,
  handleRedrawFromPlaced,
}) => {
  return (
    <div
      className="pdf-viewer"
      ref={pdfViewerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDrop}
      onMouseLeave={() => isDragging && false} // Note: this was setIsDragging(false) in original
    >
      {pdfPages.map((page, index) => (
        <div
          key={`page-${index}`}
          className="page"
          id={`page-${index}`}
        >
          <canvas
            key={`canvas-${index}-${pdfFile?.name}`}
            ref={(node) => {
              if (node && page.canvas) {
                const context = node.getContext("2d");
                if (context) {
                  // Clear canvas first
                  context.clearRect(0, 0, node.width, node.height);
                  // Draw PDF page
                  context.drawImage(page.canvas, 0, 0);
                }
              }
            }}
            width={page.canvas.width}
            height={page.canvas.height}
          />
          {elements
            .filter((el) => el.pageIndex === index)
            .map((el) => (
              <div
                key={el.id}
                className="element"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                }}
              >
                {el.type === "signature" ? (
                  <img src={el.dataUrl} alt="Signature" />
                ) : (
                  <span
                    style={{
                      fontSize: el.fontSize,
                      color: el.color,
                    }}
                  >
                    {el.text}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(el.id);
                  }}
                  className="delete-button"
                >
                  <Trash2Icon className="w-3 h-3" />
                </button>
                {el.type === "signature" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRedrawFromPlaced(el.id);
                    }}
                    className="redraw-button"
                    title="Ký lại"
                  >
                    <RotateCcwIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
        </div>
      ))}
      {isDragging && tempDragPos && stagedItem && (
        <div
          className="dragging-preview"
          style={{
            left: tempDragPos.left,
            top: tempDragPos.top,
            width: stagedItem.width,
            height: stagedItem.height,
          }}
        >
          {stagedItem.type === "signature" ? (
            <img
              src={stagedItem.dataUrl}
              alt="Dragging Signature"
            />
          ) : (
            <span
              style={{
                fontSize: stagedItem.fontSize,
                color: stagedItem.color,
              }}
            >
              {stagedItem.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
