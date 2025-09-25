// Type definitions for signature components

export interface PageData {
  canvas: HTMLCanvasElement;
  viewport: any; // Use any instead of PageViewport to avoid import issues
}

export interface PdfElement {
  id: string;
  type: "signature" | "text";
  pageIndex: number;
  x: number; // Canvas coordinates
  y: number; // Canvas coordinates
  width: number; // Canvas size
  height: number; // Canvas size
  // Normalized coordinates (0-1 range) for consistency across different scales
  normalizedX?: number;
  normalizedY?: number;
  normalizedWidth?: number;
  normalizedHeight?: number;
  // Reference canvas dimensions when element was created
  canvasWidth?: number;
  canvasHeight?: number;
  // Signature-specific
  dataUrl?: string;
  // Text-specific
  text?: string;
  fontSize?: number;
  color?: string;
}

export type StagedItem = Omit<PdfElement, "id" | "pageIndex" | "x" | "y">;
export type ActiveTool = "signature" | "text";

// Extend Window interface to include pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}
