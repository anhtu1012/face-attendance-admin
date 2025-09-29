import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import {
  applyPdfOptimizedStyles,
  removePdfOptimizedStyles,
  optimizeContentForPdf,
  getA4Dimensions,
  resetAncestorTransforms,
} from "../utils/pdfOptimization";

export const generatePdfFromHtml = async (
  element: HTMLElement,
  fileName: string = "contract.pdf"
): Promise<void> => {
  if (!element) {
    console.error("PDF generation failed: target element not found.");
    return;
  }

  // Save original styles
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    transform: element.style.transform,
    position: element.style.position,
    overflow: element.style.overflow,
    padding: element.style.padding,
    margin: element.style.margin,
    fontSize: element.style.fontSize,
  };

  // Apply PDF-optimized styles
  applyPdfOptimizedStyles(element, {
    fontSize: "10pt",
    padding: "15mm 10mm",
    margin: "0",
    lineHeight: "1.4",
  });

  // Optimize content within the element
  optimizeContentForPdf(element);

  // Reset ancestor transforms and get cleanup function
  const cleanupTransforms = resetAncestorTransforms(element);

  // Wait for styles to be applied
  await new Promise((resolve) => setTimeout(resolve, 150));

  const a4Dims = getA4Dimensions();

  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
    background: "#ffffff",
    width: a4Dims.widthPx,
    height: undefined, // Let height be auto-calculated
    allowTaint: true,
  });

  // Cleanup: restore transforms and original styles
  cleanupTransforms();
  removePdfOptimizedStyles(element, originalStyles);

  // Create PDF with A4 dimensions
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  // Calculate scaling to fit A4 width
  const scale = Math.min(a4Dims.widthPt / canvas.width, 1);
  const scaledWidth = canvas.width * scale;
  const scaledHeight = canvas.height * scale;

  // Calculate number of pages needed
  const numPages = Math.ceil(scaledHeight / a4Dims.heightPt);

  for (let i = 0; i < numPages; i++) {
    const pageCanvas = document.createElement("canvas");
    const pageHeight = Math.min(
      a4Dims.heightPt / scale,
      canvas.height - (i * a4Dims.heightPt) / scale
    );

    pageCanvas.width = canvas.width;
    pageCanvas.height = pageHeight;
    const ctx = pageCanvas.getContext("2d")!;

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    const sourceY = i * (a4Dims.heightPt / scale);

    ctx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      pageHeight,
      0,
      0,
      canvas.width,
      pageHeight
    );

    const pageImgData = pageCanvas.toDataURL("image/png");

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(pageImgData, "PNG", 0, 0, scaledWidth, pageHeight * scale);
  }

  // Sanitize filename
  const safeFileName = fileName.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
  if (!safeFileName.endsWith(".pdf")) {
    pdf.save(safeFileName + ".pdf");
  } else {
    pdf.save(safeFileName);
  }
};

export const addSignaturesToPdf = async (
  pdfFile: File,
  signatureA: string | null,
  signatureB: string | null
): Promise<void> => {
  const existingPdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const embedSignature = async (signatureDataUrl: string) => {
    // Fetch the PNG image bytes from the data URL
    const pngImageBytes = await fetch(signatureDataUrl).then((res) =>
      res.arrayBuffer()
    );
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
    return pngImage;
  };

  if (signatureA || signatureB) {
    const pages = pdfDoc.getPages();
    // Add signatures to the last page.
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    const signatureHeight = 40;
    const yPosition = 80;
    const xMargin = 50;

    if (signatureA) {
      const pngImageA = await embedSignature(signatureA);
      const pngDimsA = pngImageA.scale(signatureHeight / pngImageA.height);
      lastPage.drawImage(pngImageA, {
        x: xMargin,
        y: yPosition,
        width: pngDimsA.width,
        height: pngDimsA.height,
      });
    }

    if (signatureB) {
      const pngImageB = await embedSignature(signatureB);
      const pngDimsB = pngImageB.scale(signatureHeight / pngImageB.height);
      lastPage.drawImage(pngImageB, {
        x: width - pngDimsB.width - xMargin,
        y: yPosition,
        width: pngDimsB.width,
        height: pngDimsB.height,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `signed-${pdfFile.name}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
