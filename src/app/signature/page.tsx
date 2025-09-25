/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import {
  CheckCircleIcon,
  DownloadIcon,
  PenLineIcon,
  RotateCcwIcon,
  Trash2Icon,
  TypeIcon,
  UndoIcon,
  UploadCloudIcon,
} from "./_components/icons";
import "./signature.scss";

// Extend Window interface to include pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// --- TYPE DEFINITIONS ---
interface PageData {
  canvas: HTMLCanvasElement;
  viewport: any; // Use any instead of PageViewport to avoid import issues
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
const Signature: React.FC = () => {
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
  const [signatureBackground, setSignatureBackground] = useState("transparent");
  const [textInput, setTextInput] = useState("Your Text Here");

  // OTP Modal State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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

      // Reset canvas dimensions
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const backgroundStyle =
        signatureBackground === "white"
          ? "rgb(255, 255, 255)"
          : "rgb(241, 245, 249)";

      // Create new signature pad instance
      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor:
          signatureBackground === "transparent" ? undefined : backgroundStyle,
        penColor: penColor,
        minWidth: 0.5,
        maxWidth: 2.5,
      });

      // Clear any existing signature
      signaturePadRef.current.clear();
    }
  }, [activeTool, pdfFile, penColor, signatureBackground]); // Rerun when a new PDF is loaded or penColor changes

  // Update pen color on the signature pad instance
  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.penColor = penColor;
    }
  }, [penColor]);

  // Persist elements when PDF pages change (to prevent losing signatures during search/zoom)
  useEffect(() => {
    if (pdfPages.length > 0 && elements.length > 0) {
      // Force re-render of elements by triggering a small state update
      const timer = setTimeout(() => {
        setElements((prev) => [...prev]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pdfPages.length, elements.length]); // Include both dependencies

  // Store elements in sessionStorage to prevent loss during navigation/refresh
  useEffect(() => {
    if (elements.length > 0) {
      sessionStorage.setItem(
        "pdf-signature-elements",
        JSON.stringify(elements)
      );
    }
  }, [elements]);

  // Restore elements from sessionStorage when component mounts
  useEffect(() => {
    const savedElements = sessionStorage.getItem("pdf-signature-elements");
    if (savedElements) {
      try {
        const parsedElements = JSON.parse(savedElements);
        if (parsedElements.length > 0 && elements.length === 0) {
          setElements(parsedElements);
        }
      } catch (error) {
        console.error("Error restoring elements:", error);
      }
    }
  }, [elements.length]); // Depend on elements length to avoid setting when already populated

  // Storage functions
  const storeElements = (elements: PdfElement[]) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "pdf-signature-elements",
        JSON.stringify(elements)
      );
    }
  };

  // Clear sessionStorage when resetting
  const clearStoredElements = () => {
    sessionStorage.removeItem("pdf-signature-elements");
  };

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
    try {
      // Use CDN approach to avoid webpack issues with pdfjs-dist
      if (typeof window !== "undefined") {
        // Load PDF.js from CDN if not already loaded
        if (!window.pdfjsLib) {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          document.head.appendChild(script);

          // Wait for script to load
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Set worker
        if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const pages: PageData[] = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const pdfPage = await pdfDoc.getPage(i);
          // Use consistent scale for accurate coordinate mapping
          const scale = 1.5; // Increased scale for better quality while maintaining accuracy
          const viewport = pdfPage.getViewport({ scale: scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            const renderTask = pdfPage.render({
              canvasContext: context,
              viewport: viewport,
            });
            await renderTask.promise;

            // Store the original PDF dimensions for accurate coordinate conversion
            const originalViewport = pdfPage.getViewport({ scale: 1.0 });
            pages.push({
              canvas,
              viewport: {
                ...viewport,
                // Store original dimensions for coordinate calculation
                originalWidth: originalViewport.width,
                originalHeight: originalViewport.height,
                scale: scale,
              },
            });
          }
        }
        setPdfPages(pages);
      }
    } catch (error) {
      console.error("Error rendering PDF:", error);
      alert("Error loading PDF. Please try again.");
    }
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

  const handleUndoLastElement = () => {
    if (elements.length > 0) {
      setElements((prev) => prev.slice(0, -1));
    }
  };

  const handleRedrawFromPlaced = (elementId: string) => {
    // Remove element from the list
    setElements((prev) => prev.filter((el) => el.id !== elementId));

    // Clear any staged item
    setStagedItem(null);

    // Set tool to signature for re-signing
    setActiveTool("signature");

    // Clear and reinitialize signature pad
    setTimeout(() => {
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
        // Force re-initialization of signature pad
        if (signatureCanvasRef.current) {
          const canvas = signatureCanvasRef.current;
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.scale(ratio, ratio);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          const backgroundStyle =
            signatureBackground === "white"
              ? "rgb(255, 255, 255)"
              : "rgb(241, 245, 249)";

          signaturePadRef.current = new SignaturePad(canvas, {
            backgroundColor:
              signatureBackground === "transparent"
                ? undefined
                : backgroundStyle,
            penColor: penColor,
          });
        }
      }
    }, 100);
  };

  const deleteElement = (id: string) => {
    console.log("Deleting element with id:", id); // Debug log
    setElements((prev) => {
      const updatedElements = prev.filter((el) => el.id !== id);
      console.log("Elements before delete:", prev.length); // Debug log
      console.log("Elements after delete:", updatedElements.length); // Debug log
      storeElements(updatedElements); // Cập nhật sessionStorage sau khi xóa
      return updatedElements;
    });
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
    const scrollTop = pdfViewerRef.current.scrollTop;
    const cursorX = e.clientX - viewerRect.left;
    const cursorY = e.clientY - viewerRect.top + scrollTop;

    // Allow free positioning - don't constrain to viewer bounds
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
    const scrollTop = pdfViewerRef.current.scrollTop;
    const dropX = e.clientX - viewerRect.left;
    const dropY = e.clientY - viewerRect.top + scrollTop;

    // Use exact drop position without constraints
    const finalLeft = dropX - dragOffset.x;
    const finalTop = dropY - dragOffset.y;

    // Simple page calculation - find which page the Y position falls into
    let cumulativeHeight = 0;
    let targetPageIndex = 0;
    let relativeY = finalTop;

    for (let i = 0; i < pdfPages.length; i++) {
      const page = pdfPages[i];
      const pageHeight = page.canvas.height;
      const pageMargin = 20; // margin between pages

      if (
        finalTop >= cumulativeHeight &&
        finalTop < cumulativeHeight + pageHeight
      ) {
        targetPageIndex = i;
        relativeY = finalTop - cumulativeHeight;
        break;
      }

      cumulativeHeight += pageHeight + pageMargin;
    }

    // If position is beyond all pages, place on last page
    if (
      targetPageIndex === 0 &&
      finalTop >= cumulativeHeight &&
      pdfPages.length > 0
    ) {
      targetPageIndex = pdfPages.length - 1;
      // Calculate position on last page
      let lastPageStart = 0;
      for (let i = 0; i < pdfPages.length - 1; i++) {
        lastPageStart += pdfPages[i].canvas.height + 20;
      }
      relativeY = finalTop - lastPageStart;
    }

    // Add element at exact position without adjustments
    const newElement = {
      ...stagedItem,
      id: `${Date.now()}-${Math.random()}`,
      pageIndex: targetPageIndex,
      x: finalLeft,
      y: relativeY,
    };

    console.log("Adding new element:", newElement);

    setElements((prev) => {
      const updated = [...prev, newElement];
      console.log("Updated elements:", updated);
      storeElements(updated);
      return updated;
    });

    setStagedItem(null);
    if (activeTool === "signature") signaturePadRef.current?.clear();
  };

  // --- FINALIZATION ---
  const handleDownload = async () => {
    if (!pdfFile) {
      return;
    }

    if (elements.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      let processedElements = 0;

      for (const element of elements) {
        if (
          element.pageIndex >= pages.length ||
          element.pageIndex >= pdfPages.length
        ) {
          continue;
        }

        const targetPage = pages[element.pageIndex];
        const pageData = pdfPages[element.pageIndex];

        // Get actual PDF page dimensions
        const pdfWidth = targetPage.getWidth();
        const pdfHeight = targetPage.getHeight();

        // Calculate actual displayed canvas dimensions
        const displayedWidth = pageData.canvas.width;
        const displayedHeight = pageData.canvas.height;

        // Calculate scale factors from displayed canvas to PDF
        const scaleX = pdfWidth / displayedWidth;
        const scaleY = pdfHeight / displayedHeight;

        // Convert coordinates from canvas space to PDF space
        const elX = Math.max(0, element.x * scaleX);

        // PDF coordinate system has origin at bottom-left, canvas at top-left
        // So we need to flip Y coordinate correctly
        const canvasY = element.y;
        const pdfY = pdfHeight - canvasY * scaleY - element.height * scaleY;
        const elY = Math.max(0, pdfY);

        if (element.type === "signature" && element.dataUrl) {
          try {
            const response = await fetch(element.dataUrl);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch signature data: ${response.statusText}`
              );
            }

            const pngImageBytes = await response.arrayBuffer();

            const pngImage = await pdfDoc.embedPng(pngImageBytes);

            targetPage.drawImage(pngImage, {
              x: elX,
              y: elY,
              width: Math.max(1, element.width * scaleX),
              height: Math.max(1, element.height * scaleY),
            });

            processedElements++;
          } catch (imgError) {
            console.error("Error processing signature image:", imgError);
          }
        } else if (element.type === "text" && element.text) {
          try {
            const colorMap = {
              black: rgb(0, 0, 0),
              blue: rgb(0, 0.3, 0.7),
              red: rgb(0.8, 0, 0),
            };

            targetPage.drawText(element.text, {
              x: elX,
              y: elY,
              font: helveticaFont,
              size: Math.max(1, (element.fontSize || 24) * scaleY),
              color:
                colorMap[element.color as keyof typeof colorMap] ||
                rgb(0, 0, 0),
            });

            processedElements++;
          } catch (textError) {
            console.error("Error processing text:", textError);
          }
        } else {
          console.warn("Skipping element - missing data:", element);
        }
      }

      if (processedElements === 0) {
        return;
      }

      console.log("Saving PDF...");
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });

      const filename = `${pdfFile.name.replace(/\.pdf$/i, "")}-signed.pdf`;
      saveAs(blob, filename);

      setIsSigned(true);
    } catch (error) {
      console.error("Error generating signed PDF:", error);
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
    clearStoredElements(); // Clear stored elements when resetting
  };

  // --- OTP HANDLERS ---
  const handleVerifySignature = () => {
    setShowOTPModal(true);
    // Auto focus first input after modal renders
    setTimeout(() => {
      const firstInput = document.querySelector(
        'input[data-index="0"]'
      ) as HTMLInputElement;
      firstInput?.focus();
    }, 100);
  };

  const handleOTPSubmit = async () => {
    if (otpValue.length !== 6) {
      alert("Vui lòng nhập đầy đủ 6 chữ số OTP");
      return;
    }

    setIsVerifying(true);

    // Simulate OTP verification - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock verification success
      if (otpValue === "123456") {
        alert("Xác thực thành công!");
        setShowOTPModal(false);
        setOtpValue("");
      } else {
        alert("OTP không đúng. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setOtpValue("");
  };

  const handleResendOTP = async () => {
    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Mã OTP đã được gửi lại!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  // --- RENDER ---
  return (
    <>
      <div className="app-container">
        <div className="app-inner">
          <header className="header">
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
            <main className="main-grid">
              <div
                className="pdf-viewer"
                ref={pdfViewerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDrop}
                onMouseLeave={() => isDragging && setIsDragging(false)}
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
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={el.dataUrl} alt="Signature" />
                            </>
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
                              e.stopPropagation(); // Tránh event bubbling
                              deleteElement(el.id);
                            }}
                            className="delete-button"
                          >
                            <Trash2Icon className="w-3 h-3" />
                          </button>
                          {el.type === "signature" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Tránh event bubbling
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
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stagedItem.dataUrl}
                          alt="Dragging Signature"
                        />
                      </>
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

              <div>
                <Toolbox
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                  signatureCanvasRef={signatureCanvasRef}
                  signaturePadRef={signaturePadRef}
                  penColor={penColor}
                  setPenColor={setPenColor}
                  signatureBackground={signatureBackground}
                  setSignatureBackground={setSignatureBackground}
                  handleConfirmSignature={handleConfirmSignature}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  handleCreateText={handleCreateText}
                  stagedItem={stagedItem}
                  stagedItemRef={stagedItemRef}
                  handleDragStart={handleDragStart}
                  handleRedraw={handleRedraw}
                  handleUndoLastElement={handleUndoLastElement}
                />
                {elements.length > 0 && (
                  <div className="finalize-section">
                    <h2>
                      <DownloadIcon className="icon" /> Finalize & Download
                    </h2>
                    <p>
                      Your elements have been placed ({elements.length}{" "}
                      elements). Click below to download the signed PDF.
                    </p>
                    <button onClick={handleDownload}>
                      Download Signed PDF
                    </button>
                    <button
                      onClick={handleVerifySignature}
                      className="verify-button"
                    >
                      Xác thực chữ ký
                    </button>
                  </div>
                )}
              </div>
            </main>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác thực chữ ký</h3>
              <button onClick={handleCloseOTPModal} className="close-button">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="otp-icon">
                <div className="security-icon">🔒</div>
              </div>
              <h4>Xác thực bảo mật</h4>
              <p>
                Chúng tôi đã gửi mã OTP 6 chữ số đến thiết bị của bạn. Vui lòng
                nhập mã để xác thực chữ ký:
              </p>

              <div className="otp-input-container">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    value={otpValue[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 1) {
                        const newOtp = otpValue.split("");
                        newOtp[index] = value;
                        const finalOtp = newOtp.join("").slice(0, 6);
                        setOtpValue(finalOtp);

                        // Auto focus next input
                        if (value && index < 5) {
                          const nextInput = document.querySelector(
                            `input[data-index="${index + 1}"]`
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !otpValue[index] &&
                        index > 0
                      ) {
                        const prevInput = document.querySelector(
                          `input[data-index="${index - 1}"]`
                        ) as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteData = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtpValue(pasteData);

                      // Focus the last filled input or first empty one
                      const targetIndex = Math.min(pasteData.length - 1, 5);
                      const targetInput = document.querySelector(
                        `input[data-index="${targetIndex}"]`
                      ) as HTMLInputElement;
                      targetInput?.focus();
                    }}
                    className="otp-digit"
                    maxLength={1}
                    data-index={index}
                    disabled={isVerifying}
                  />
                ))}
              </div>

              <div className="otp-info">
                <small>
                  Không nhận được mã?{" "}
                  <button
                    type="button"
                    className="resend-link"
                    onClick={handleResendOTP}
                  >
                    Gửi lại
                  </button>
                </small>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleCloseOTPModal}
                  className="cancel-button"
                  disabled={isVerifying}
                >
                  Hủy
                </button>
                <button
                  onClick={handleOTPSubmit}
                  className="submit-button"
                  disabled={isVerifying || otpValue.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <span className="verify-icon">✓</span>
                      Xác thực
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stagedItem.dataUrl}
                  alt="Your Signature"
                  style={{ width: stagedItem.width, height: stagedItem.height }}
                />
              </>
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

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Processing your document...</p>
  </div>
);

const SuccessScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="success-screen">
    <CheckCircleIcon className="icon" />
    <h2>Document Finalized Successfully!</h2>
    <p>Your signed PDF has been downloaded.</p>
    <button onClick={onReset}>Sign Another Document</button>
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

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleLabelClick}
        className={isDragging ? "dragging" : ""}
      >
        <div>
          <UploadCloudIcon className={isDragging ? "icon dragging" : "icon"} />
          <span>
            <span className="highlight">Click to upload</span> or drag and drop
          </span>
          <p>PDF (max. 10MB)</p>
        </div>
      </label>
    </div>
  );
};

export default Signature;
