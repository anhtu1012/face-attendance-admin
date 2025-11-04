/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PenLineIcon, UndoIcon } from "./icons";

interface SignatureToolboxProps {
  signatureType: "partyA" | "partyB";
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  signaturePadRef: React.MutableRefObject<any>;
  penColor: string;
  setPenColor: (color: string) => void;
  handleConfirmSignature: () => void;
  hasSignature: boolean;
  signatureDataUrl: string | null;
}

const SignatureToolbox: React.FC<SignatureToolboxProps> = ({
  signatureType,
  canvasRef,
  signaturePadRef,
  penColor,
  setPenColor,
  handleConfirmSignature,
  hasSignature,
  signatureDataUrl,
}) => {
  return (
    <div className="signature-toolbox">
      <div className="toolbox-header">
        <PenLineIcon className="icon" />
        <h3>
          {signatureType === "partyA"
            ? "Chữ ký Bên A (Giám đốc)"
            : "Chữ ký Bên B (Nhân viên)"}
        </h3>
      </div>

      {hasSignature && signatureDataUrl ? (
        <div className="signature-preview">
          <p>Đã ký</p>
          <img src={signatureDataUrl} alt={`Chữ ký ${signatureType}`} />
          <button
            onClick={() => signaturePadRef.current?.clear()}
            className="clear-button"
          >
            Ký lại
          </button>
        </div>
      ) : (
        <>
          <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
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
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => signaturePadRef.current?.clear()}
              className="clear"
            >
              Xóa
            </button>
            <button onClick={handleConfirmSignature} className="confirm">
              Xác nhận chữ ký
            </button>
          </div>
        </>
      )}
    </div>
  );
};

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

export default SignatureToolbox;
