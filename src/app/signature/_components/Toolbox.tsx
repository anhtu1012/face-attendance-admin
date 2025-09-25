/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ActiveTool, StagedItem } from "../types";
import { PenLineIcon, TypeIcon, UndoIcon, RotateCcwIcon } from "./icons";

interface ToolboxProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  signatureCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  signaturePadRef: React.MutableRefObject<any>;
  penColor: string;
  setPenColor: (color: string) => void;
  signatureBackground: string;
  setSignatureBackground: (background: string) => void;
  handleConfirmSignature: () => void;
  textInput: string;
  setTextInput: (text: string) => void;
  handleCreateText: () => void;
  stagedItem: StagedItem | null;
  stagedItemRef: React.RefObject<HTMLDivElement | null>;
  handleDragStart: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRedraw: () => void;
  handleUndoLastElement: () => void;
}

const Toolbox: React.FC<ToolboxProps> = ({
  activeTool,
  setActiveTool,
  signatureCanvasRef,
  signaturePadRef,
  penColor,
  setPenColor,
  handleConfirmSignature,
  textInput,
  setTextInput,
  handleCreateText,
  stagedItem,
  stagedItemRef,
  handleDragStart,
  handleRedraw,
  handleUndoLastElement,
}) => {
  return (
    <div className="toolbox">
      <div className="tool-buttons">
        <ToolButton
          icon={<PenLineIcon />}
          label="Signature"
          isActive={activeTool === "signature"}
          onClick={() => setActiveTool("signature")}
        />
        <ToolButton
          icon={<TypeIcon />}
          label="Text"
          isActive={activeTool === "text"}
          onClick={() => setActiveTool("text")}
        />
      </div>

      {stagedItem ? (
        <div className="staged-item">
          <p>Your item is ready to be placed.</p>
          <div
            ref={stagedItemRef}
            onMouseDown={handleDragStart}
            className="item-preview"
          >
            {stagedItem.type === "signature" ? (
              <img
                src={stagedItem.dataUrl}
                alt="Your Signature"
                style={{ width: stagedItem.width, height: stagedItem.height }}
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
            <p>Drag me onto the document!</p>
          </div>
          <button onClick={handleRedraw}>Cancel</button>
        </div>
      ) : activeTool === "signature" ? (
        <div className="signature-tool">
          <div className="canvas-container">
            <canvas ref={signatureCanvasRef}></canvas>
          </div>
          <div className="controls">
            <div className="color-buttons">
              <ColorButton
                color="black"
                selectedColor={penColor}
                onClick={() => setPenColor("black")}
              />
              <ColorButton
                color="blue"
                selectedColor={penColor}
                onClick={() => setPenColor("blue")}
              />
              <ColorButton
                color="red"
                selectedColor={penColor}
                onClick={() => setPenColor("red")}
              />
            </div>
            <div className="action-controls">
              <button
                onClick={() => signaturePadRef.current?.undo()}
                title="Hoàn tác"
                className="undo-button"
              >
                <UndoIcon />
              </button>
              <button
                onClick={handleUndoLastElement}
                title="Xóa chữ ký cuối"
                className="undo-element-button"
              >
                <RotateCcwIcon />
              </button>
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => signaturePadRef.current?.clear()}
              className="clear"
            >
              Clear
            </button>
            <button onClick={handleConfirmSignature} className="confirm">
              Confirm Signature
            </button>
          </div>
        </div>
      ) : (
        <div className="text-tool">
          <label htmlFor="text-input">Text to add:</label>
          <input
            id="text-input"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button onClick={handleCreateText}>Create Text Item</button>
        </div>
      )}
    </div>
  );
};

const ToolButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={isActive ? "tool-button active" : "tool-button"}
  >
    <div className="icon">{icon}</div>
    <span>{label}</span>
  </button>
);

const ColorButton: React.FC<{
  color: string;
  selectedColor: string;
  onClick: () => void;
}> = ({ color, selectedColor, onClick }) => (
  <button
    onClick={onClick}
    className={
      selectedColor === color ? "color-button selected" : "color-button"
    }
    style={{ backgroundColor: color }}
    title={color}
  />
);

export default Toolbox;
