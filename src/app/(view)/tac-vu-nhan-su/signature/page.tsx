/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloudIcon,
  PenLineIcon,
  DownloadIcon,
  CheckCircleIcon,
  TypeIcon,
  UndoIcon,
  Trash2Icon,
} from "./_components/icons";
import type { PageViewport } from "pdfjs-dist";

// TypeScript declarations for libraries loaded from CDN
declare const pdfjsLib: any;
declare const PDFLib: any;
declare const SignaturePad: any;

// --- TYPE DEFINITIONS ---
interface PageData {
  canvas: HTMLCanvasElement;
  viewport: PageViewport;
}

interface PdfElement {
  id: string;
  type: "signature" | "text";
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  // Signature-specific
  dataUrl?: string;
  // Text-specific
  text?: string;
  fontSize?: number;
  color?: string;
}

type StagedItem = Omit<PdfElement, "id" | "pageIndex" | "x" | "y">;
type ActiveTool = "signature" | "text";

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // State Hooks
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<PageData[]>([]);
  const [elements, setElements] = useState<PdfElement[]>([]);
  const [stagedItem, setStagedItem] = useState<StagedItem | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>("signature");

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempDragPos, setTempDragPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);

  // Signature Pad State
  const [penColor, setPenColor] = useState("black");
  const [textInput, setTextInput] = useState("Your Text Here");

  // Refs
  const signaturePadRef = useRef<any>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const stagedItemRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  // Initialize or re-initialize signature pad when the active tool is 'signature'
  useEffect(() => {
    if (activeTool === "signature" && signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(241, 245, 249)",
        penColor: penColor,
      });
    }
  }, [activeTool, pdfFile]); // Rerun when a new PDF is loaded

  // Update pen color on the signature pad instance
  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.penColor = penColor;
    }
  }, [penColor]);

  // --- PDF HANDLING ---
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setIsLoading(true);
      setPdfFile(file);
      await renderPdf(file);
      setIsLoading(false);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const renderPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: PageData[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const pdfPage = await pdfDoc.getPage(i);
      const viewport = pdfPage.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await pdfPage.render({ canvasContext: context, viewport: viewport })
          .promise;
        pages.push({ canvas, viewport });
      }
    }
    setPdfPages(pages);
  };

  // --- TOOLBOX ACTIONS ---
  const handleConfirmSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      setStagedItem({
        type: "signature",
        dataUrl: signaturePadRef.current.toDataURL("image/png"),
        width: 150,
        height: 75,
      });
    } else {
      alert("Please draw a signature first.");
    }
  };

  const handleCreateText = () => {
    if (textInput.trim()) {
      setStagedItem({
        type: "text",
        text: textInput,
        fontSize: 24,
        width: 200, // Adjust width based on text length if desired
        height: 30,
        color: "black",
      });
    } else {
      alert("Please enter some text.");
    }
  };

  const handleRedraw = () => {
    setStagedItem(null);
    setTimeout(() => {
      signaturePadRef.current?.clear();
    }, 0);
  };

  // --- DRAG & DROP ---
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stagedItemRef.current) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !pdfViewerRef.current) return;
    const viewerRect = pdfViewerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - viewerRect.left;
    const cursorY = e.clientY - viewerRect.top + pdfViewerRef.current.scrollTop;

    setTempDragPos({
      left: cursorX - dragOffset.x,
      top: cursorY - dragOffset.y,
    });
  };

  const handleDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !pdfViewerRef.current || !stagedItem) return;

    setIsDragging(false);
    setTempDragPos(null);

    const viewerRect = pdfViewerRef.current.getBoundingClientRect();
    const dropX = e.clientX - viewerRect.left;
    const dropY = e.clientY - viewerRect.top + pdfViewerRef.current.scrollTop;

    const finalLeft = dropX - dragOffset.x;
    const finalTop = dropY - dragOffset.y;

    let cumulativeHeight = 0;
    for (let i = 0; i < pdfPages.length; i++) {
      const page = pdfPages[i];
      const pageHeight = page.canvas.height;
      // 20 is for margin between pages
      if (
        finalTop >= cumulativeHeight &&
        finalTop < cumulativeHeight + pageHeight
      ) {
        setElements((prev) => [
          ...prev,
          {
            ...stagedItem,
            id: `${Date.now()}`,
            pageIndex: i,
            x: finalLeft,
            y: finalTop - cumulativeHeight,
          },
        ]);
        setStagedItem(null);
        if (activeTool === "signature") signaturePadRef.current?.clear();
        return;
      }
      cumulativeHeight += pageHeight + 20;
    }
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  // --- FINALIZATION ---
  const handleDownload = async () => {
    if (!pdfFile || elements.length === 0) {
      alert(
        "Please add at least one signature or text element to the document."
      );
      return;
    }

    setIsLoading(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = PDFLib;
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      for (const element of elements) {
        const targetPage = pages[element.pageIndex];
        const pageData = pdfPages[element.pageIndex];
        const scaleX = targetPage.getWidth() / pageData.canvas.width;
        const scaleY = targetPage.getHeight() / pageData.canvas.height;

        const elX = element.x * scaleX;
        const elY =
          targetPage.getHeight() - element.y * scaleY - element.height * scaleY;

        if (element.type === "signature" && element.dataUrl) {
          const pngImageBytes = await fetch(element.dataUrl).then((res) =>
            res.arrayBuffer()
          );
          const pngImage = await pdfDoc.embedPng(pngImageBytes);
          targetPage.drawImage(pngImage, {
            x: elX,
            y: elY,
            width: element.width * scaleX,
            height: element.height * scaleY,
          });
        } else if (element.type === "text" && element.text) {
          const colorMap = {
            black: rgb(0, 0, 0),
            blue: rgb(0, 0.3, 0.7),
            red: rgb(0.8, 0, 0),
          };
          targetPage.drawText(element.text, {
            x: elX,
            y: elY,
            font: helveticaFont,
            size: (element.fontSize || 24) * scaleY,
            color:
              colorMap[element.color as keyof typeof colorMap] || rgb(0, 0, 0),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${pdfFile.name.replace(/\.pdf$/i, "")}-signed.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      setIsSigned(true);
    } catch (error) {
      console.error("Error signing PDF:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setPdfFile(null);
    setPdfPages([]);
    setStagedItem(null);
    setElements([]);
    setIsSigned(false);
    setActiveTool("signature");
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            PDF Signature Pro
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Sign documents digitally, securely, and entirely in your browser.
          </p>
        </header>

        {isLoading && <LoadingSpinner />}

        {!pdfFile ? (
          <FileUploader onFileChange={handleFileChange} />
        ) : isSigned ? (
          <SuccessScreen onReset={resetState} />
        ) : (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div
              className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-200 dark:border-slate-700 overflow-auto max-h-[80vh] relative"
              ref={pdfViewerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDrop}
              onMouseLeave={() => isDragging && setIsDragging(false)}
            >
              {pdfPages.map((page, index) => (
                <div
                  key={index}
                  className="relative mb-5 shadow-lg"
                  id={`page-${index}`}
                >
                  <canvas
                    ref={(node) => {
                      if (node)
                        node.getContext("2d")?.drawImage(page.canvas, 0, 0);
                    }}
                    width={page.canvas.width}
                    height={page.canvas.height}
                  />
                  {elements
                    .filter((el) => el.pageIndex === index)
                    .map((el) => (
                      <div
                        key={el.id}
                        className="absolute group"
                        style={{
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                        }}
                      >
                        {el.type === "signature" ? (
                          <img
                            src={el.dataUrl}
                            alt="Signature"
                            className="w-full h-full"
                          />
                        ) : (
                          <span
                            style={{ fontSize: el.fontSize, color: el.color }}
                            className="select-none"
                          >
                            {el.text}
                          </span>
                        )}
                        <button
                          onClick={() => deleteElement(el.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2Icon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>
              ))}
              {isDragging && tempDragPos && stagedItem && (
                <div
                  className="absolute pointer-events-none z-50 opacity-70"
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
                      className="w-full h-full"
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

            <div className="lg:col-span-1 space-y-6">
              <Toolbox
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                signatureCanvasRef={signatureCanvasRef}
                signaturePadRef={signaturePadRef}
                penColor={penColor}
                setPenColor={setPenColor}
                handleConfirmSignature={handleConfirmSignature}
                textInput={textInput}
                setTextInput={setTextInput}
                handleCreateText={handleCreateText}
                stagedItem={stagedItem}
                stagedItemRef={stagedItemRef}
                handleDragStart={handleDragStart}
                handleRedraw={handleRedraw}
              />
              {elements.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-green-500/50 dark:border-green-400/50 transition-all animate-fade-in-up">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-green-600 dark:text-green-400">
                    <DownloadIcon className="mr-2" /> Finalize & Download
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Your elements have been placed. Click below to download the
                    signed PDF.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                  >
                    Download Signed PDF
                  </button>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Toolbox: React.FC<any> = ({
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
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-2 gap-2 mb-6">
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
        <div>
          <p className="text-slate-600 dark:text-slate-400 mb-2 text-center">
            Your item is ready to be placed.
          </p>
          <div
            ref={stagedItemRef}
            onMouseDown={handleDragStart}
            className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md border-2 border-dashed border-blue-400 flex flex-col items-center cursor-grab"
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Drag me onto the document!
            </p>
          </div>
          <button
            onClick={handleRedraw}
            className="mt-4 w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : activeTool === "signature" ? (
        <div>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-md border border-dashed border-slate-300 dark:border-slate-600">
            <canvas
              ref={signatureCanvasRef}
              className="w-full h-40 cursor-crosshair"
            ></canvas>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
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
            <button
              onClick={() => signaturePadRef.current?.undo()}
              title="Undo"
              className="p-2 text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              <UndoIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => signaturePadRef.current?.clear()}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              Clear
            </button>
            <button
              onClick={handleConfirmSignature}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Confirm Signature
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label
            htmlFor="text-input"
            className="block font-medium text-slate-700 dark:text-slate-300"
          >
            Text to add:
          </label>
          <input
            id="text-input"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateText}
            className="w-full px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Create Text Item
          </button>
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
    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
      isActive
        ? "bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-600 dark:text-blue-400"
        : "bg-slate-100 dark:bg-slate-700 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span className="text-sm font-medium mt-1">{label}</span>
  </button>
);

const ColorButton: React.FC<{
  color: string;
  selectedColor: string;
  onClick: () => void;
}> = ({ color, selectedColor, onClick }) => (
  <button
    onClick={onClick}
    className={`w-6 h-6 rounded-full border-2 ${
      selectedColor === color ? "border-blue-500" : "border-transparent"
    }`}
    style={{ backgroundColor: color }}
    title={color}
  />
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
    <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-slate-200 rounded-full animate-spin"></div>
    <p className="text-white text-lg mt-4">Processing your document...</p>
  </div>
);

const SuccessScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 sm:p-12 text-center flex flex-col items-center border border-slate-200 dark:border-slate-700">
    <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
    <h2 className="text-3xl font-bold mb-2">
      Document Finalized Successfully!
    </h2>
    <p className="text-slate-600 dark:text-slate-400 mb-6">
      Your signed PDF has been downloaded.
    </p>
    <button
      onClick={onReset}
      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
    >
      Sign Another Document
    </button>
  </div>
);

const FileUploader: React.FC<{
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex justify-center w-full h-64 px-4 transition bg-white dark:bg-slate-800 border-2 ${
          isDragging
            ? "border-blue-500"
            : "border-slate-300 dark:border-slate-600"
        } border-dashed rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500`}
      >
        <div className="flex flex-col items-center justify-center">
          <UploadCloudIcon
            className={`w-16 h-16 text-slate-400 dark:text-slate-500 transition-colors ${
              isDragging ? "text-blue-500" : ""
            }`}
          />
          <span className="font-medium text-slate-600 dark:text-slate-300">
            <span className="text-blue-600 dark:text-blue-400">
              Click to upload
            </span>{" "}
            or drag and drop
          </span>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            PDF (max. 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={onFileChange}
          />
        </div>
      </label>
    </div>
  );
};

export default App;
