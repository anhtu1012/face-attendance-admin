/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import SignaturePad from "signature_pad";

// Import components
import FileUploader from "./_components/FileUploader";
import LoadingSpinner from "./_components/LoadingSpinner";
import OTPModal from "./_components/OTPModal";
import PDFViewer from "./_components/PDFViewer";
import PrintableDocument from "./_components/PrintableDocument";
import SuccessScreen from "./_components/SuccessScreen";
import Toolbox from "./_components/Toolbox";
import { DownloadIcon, PrintIcon } from "./_components/icons";

// Import types
import { ActiveTool, PageData, PdfElement, StagedItem } from "./types";

// Import coordinate converter
import { normalizeCoordinates } from "./utils/coordinateConverter";

// Import styles
import "./signature.scss";

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
  const printableRef = useRef<HTMLDivElement>(null);

  // --- PRINT FUNCTIONALITY ---
  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: pdfFile
      ? pdfFile.name.replace(/\.pdf$/i, "") + "-signed"
      : "signed-document",
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
    onAfterPrint: () => {
      console.log("Document printed successfully");
    },
  });

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
          : "rgb(255, 255, 255)";

      // Create new signature pad instance with mobile support
      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor:
          signatureBackground === "transparent" ? undefined : backgroundStyle,
        penColor: penColor,
        minWidth: 0.5,
        maxWidth: 2.5,
        throttle: 16, // Reduce lag on mobile
        minDistance: 5, // Minimum distance between points
        // Enable touch events for mobile
        velocityFilterWeight: 0.7,
        // dotSize: calculated automatically
      });

      // Clear any existing signature
      signaturePadRef.current.clear();
    }
  }, [activeTool, pdfFile, penColor, signatureBackground]);

  // Update pen color on the signature pad instance
  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.penColor = penColor;
    }
  }, [penColor]);

  // Persist elements when PDF pages change
  useEffect(() => {
    if (pdfPages.length > 0 && elements.length > 0) {
      const timer = setTimeout(() => {
        setElements((prev) => [...prev]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pdfPages.length, elements.length]);

  // Store elements in sessionStorage
  useEffect(() => {
    if (elements.length > 0) {
      sessionStorage.setItem(
        "pdf-signature-elements",
        JSON.stringify(elements)
      );
    }
  }, [elements]);

  // Restore elements from sessionStorage
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
  }, [elements.length]);

  // Storage functions
  const storeElements = (elements: PdfElement[]) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "pdf-signature-elements",
        JSON.stringify(elements)
      );
    }
  };

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
      if (typeof window !== "undefined") {
        if (!window.pdfjsLib) {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

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
          const scale = 1.5;
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

            const originalViewport = pdfPage.getViewport({ scale: 1.0 });
            pages.push({
              canvas,
              viewport: {
                ...viewport,
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
        width: 200,
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
    setElements((prev) => prev.filter((el) => el.id !== elementId));
    setStagedItem(null);
    setActiveTool("signature");

    setTimeout(() => {
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
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
            minWidth: 0.5,
            maxWidth: 2.5,
            throttle: 16,
            minDistance: 5,
            velocityFilterWeight: 0.7,
          });
        }
      }
    }, 100);
  };

  const deleteElement = (id: string) => {
    setElements((prev) => {
      const updatedElements = prev.filter((el) => el.id !== id);
      storeElements(updatedElements);
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
    const scrollLeft = pdfViewerRef.current.scrollLeft;

    // Calculate cursor position with scroll offset
    const cursorX = e.clientX - viewerRect.left + scrollLeft;
    const cursorY = e.clientY - viewerRect.top + scrollTop;

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
    const scrollLeft = pdfViewerRef.current.scrollLeft;

    // Calculate drop position relative to the viewer container
    const dropX = e.clientX - viewerRect.left + scrollLeft;
    const dropY = e.clientY - viewerRect.top + scrollTop;

    const finalLeft = dropX - dragOffset.x;
    const finalTop = dropY - dragOffset.y;

    // Calculate which page the element should be placed on using DOM elements
    let targetPageIndex = 0;
    let relativeY = finalTop;
    let relativeX = finalLeft;

    console.log("Drop position calculation:", {
      finalTop,
      finalLeft,
      scrollTop: pdfViewerRef.current?.scrollTop,
      scrollLeft: pdfViewerRef.current?.scrollLeft,
      viewerRect,
      dragOffset,
    });

    // Sử dụng DOM elements để tìm trang chính xác
    const pageElements = pdfViewerRef.current?.querySelectorAll(".page");
    if (pageElements) {
      let found = false;

      // Trước tiên, kiểm tra xem điểm thả có nằm trong phạm vi của trang nào không
      for (let i = 0; i < pageElements.length && !found; i++) {
        const pageElement = pageElements[i] as HTMLElement;

        // Tính toán vị trí trang tương đối với viewer và scroll
        const pageTop = pageElement.offsetTop;
        const pageBottom = pageTop + pageElement.offsetHeight;
        const pageLeft = pageElement.offsetLeft;
        const pageRight = pageLeft + pageElement.offsetWidth;

        console.log(`Page ${i} DOM:`, {
          pageTop,
          pageBottom,
          pageLeft,
          pageRight,
          pageHeight: pageElement.offsetHeight,
          pageWidth: pageElement.offsetWidth,
          finalTop,
          finalLeft,
          isInThisPage:
            finalTop >= pageTop &&
            finalTop < pageBottom &&
            finalLeft >= pageLeft &&
            finalLeft < pageRight,
        });

        // Kiểm tra xem điểm thả có nằm trong phạm vi của trang hiện tại không
        if (
          finalTop >= pageTop &&
          finalTop < pageBottom &&
          finalLeft >= pageLeft &&
          finalLeft < pageRight
        ) {
          targetPageIndex = i;
          relativeY = finalTop - pageTop;
          relativeX = finalLeft - pageLeft;
          found = true;
          console.log(
            `Element placed on page ${i}, relativeY: ${relativeY}, relativeX: ${relativeX}`
          );
        }
      }

      // Nếu không tìm thấy trang phù hợp, tìm trang gần nhất với điểm thả
      if (!found && pageElements.length > 0) {
        // Tìm trang gần nhất với điểm thả dựa trên khoảng cách
        let closestPage = 0;
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < pageElements.length; i++) {
          const pageElement = pageElements[i] as HTMLElement;
          const pageTop = pageElement.offsetTop;
          const pageLeft = pageElement.offsetLeft;
          const pageBottom = pageTop + pageElement.offsetHeight;
          const pageRight = pageLeft + pageElement.offsetWidth;

          // Tính khoảng cách từ điểm thả đến trang
          let dx = 0;
          let dy = 0;

          if (finalLeft < pageLeft) dx = pageLeft - finalLeft;
          else if (finalLeft > pageRight) dx = finalLeft - pageRight;

          if (finalTop < pageTop) dy = pageTop - finalTop;
          else if (finalTop > pageBottom) dy = finalTop - pageBottom;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            minDistance = distance;
            closestPage = i;
          }
        }

        targetPageIndex = closestPage;
        const closestPageElement = pageElements[targetPageIndex] as HTMLElement;

        // Đặt phần tử vào trong trang gần nhất, đảm bảo nó nằm trong giới hạn của trang
        relativeY = Math.max(
          0,
          Math.min(
            finalTop - closestPageElement.offsetTop,
            closestPageElement.offsetHeight - (stagedItem?.height || 0)
          )
        );
        relativeX = Math.max(
          0,
          Math.min(
            finalLeft - closestPageElement.offsetLeft,
            closestPageElement.offsetWidth - (stagedItem?.width || 0)
          )
        );

        console.log(
          `Element placed on closest page ${targetPageIndex}, relativeY: ${relativeY}, relativeX: ${relativeX}, distance: ${minDistance}`
        );
      }
    }

    // Ensure position is within page bounds
    if (targetPageIndex < pdfPages.length) {
      const pageCanvas = pdfPages[targetPageIndex].canvas;
      const maxY = pageCanvas.height - stagedItem.height;
      const maxX = pageCanvas.width - stagedItem.width;
      relativeY = Math.max(0, Math.min(relativeY, maxY));
      relativeX = Math.max(0, Math.min(relativeX, maxX));
    }

    // Get current page canvas for normalization
    const currentPageCanvas = pdfPages[targetPageIndex]?.canvas;
    const canvasWidth = currentPageCanvas?.width || 1;
    const canvasHeight = currentPageCanvas?.height || 1;

    // Normalize coordinates for consistent positioning
    const normalizedCoords = normalizeCoordinates(
      {
        x: relativeX,
        y: relativeY,
        width: stagedItem.width,
        height: stagedItem.height,
      },
      { width: canvasWidth, height: canvasHeight }
    );

    // Add element with both absolute and normalized coordinates
    const newElement: PdfElement = {
      ...stagedItem,
      id: `${Date.now()}-${Math.random()}`,
      pageIndex: targetPageIndex,
      x: relativeX, // Use calculated relative position within page
      y: relativeY, // Use calculated relative position within page
      // Store normalized coordinates for consistency
      normalizedX: normalizedCoords.x,
      normalizedY: normalizedCoords.y,
      normalizedWidth: normalizedCoords.width,
      normalizedHeight: normalizedCoords.height,
      // Store reference canvas dimensions
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
    };

    setElements((prev) => {
      const updated = [...prev, newElement];
      storeElements(updated);
      return updated;
    });

    setStagedItem(null);
    if (activeTool === "signature") signaturePadRef.current?.clear();
  };
  const resetState = () => {
    setPdfFile(null);
    setPdfPages([]);
    setStagedItem(null);
    setElements([]);
    setIsSigned(false);
    setActiveTool("signature");
    clearStoredElements();
  };

  // --- OTP HANDLERS ---
  const handleVerifySignature = () => {
    setShowOTPModal(true);
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
              <PDFViewer
                pdfPages={pdfPages}
                elements={elements}
                stagedItem={stagedItem}
                isDragging={isDragging}
                tempDragPos={tempDragPos}
                pdfFile={pdfFile}
                pdfViewerRef={pdfViewerRef}
                handleMouseMove={handleMouseMove}
                handleDrop={handleDrop}
                deleteElement={deleteElement}
                handleRedrawFromPlaced={handleRedrawFromPlaced}
              />

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
                      elements). Choose your preferred action below.
                    </p>

                    <button onClick={handlePrint} className="print-button">
                      <PrintIcon className="print-icon" />
                      Print Document (A4)
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

      {/* Hidden Printable Component */}
      <div style={{ display: "none" }}>
        <PrintableDocument
          ref={printableRef}
          pdfPages={pdfPages}
          elements={elements}
          fileName={pdfFile?.name}
        />
      </div>

      {/* OTP Modal */}
      <OTPModal
        showOTPModal={showOTPModal}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
        isVerifying={isVerifying}
        handleOTPSubmit={handleOTPSubmit}
        handleCloseOTPModal={handleCloseOTPModal}
        handleResendOTP={handleResendOTP}
      />
    </>
  );
};

export default Signature;
