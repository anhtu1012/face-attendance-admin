// This assumes jsPDF, html2canvas, and PDFLib are loaded from CDN and available on the window object.
declare const jspdf: {
  jsPDF: new (options: { orientation: string; unit: string; format: string }) => {
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    addImage: (imgData: string, format: string, x: number, y: number, width: number, height: number) => void;
    save: (filename: string) => void;
  };
};
declare const html2canvas: (element: HTMLElement, options: {
  scale: number;
  useCORS: boolean;
  logging: boolean;
  backgroundColor: string;
}) => Promise<{
  width: number;
  height: number;
  toDataURL: (format: string) => string;
}>;
declare const PDFLib: {
  PDFDocument: {
    load: (bytes: ArrayBuffer) => Promise<{
      getPages: () => Array<{
        getSize: () => { width: number };
        drawImage: (image: unknown, options: { x: number; y: number; width: number; height: number }) => void;
      }>;
      embedPng: (bytes: ArrayBuffer) => Promise<{
        height: number;
        scale: (ratio: number) => { width: number; height: number };
      }>;
      save: () => Promise<Uint8Array>;
    }>;
  };
};

export const generatePdfFromHtml = async (
  element: HTMLElement,
  fileName: string = "contract.pdf"
): Promise<void> => {
  if (!element) {
    console.error("PDF generation failed: target element not found.");
    return;
  }

  // Use a temporary class to ensure consistent rendering for PDF generation
  element.classList.add("pdf-render-mode");

  const originalWidth = element.style.width;
  // Set a fixed width for consistent rendering during PDF generation
  element.style.width = "210mm";

  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // Restore original styles
  element.classList.remove("pdf-render-mode");
  element.style.width = originalWidth;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4", // Standard A4 size
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const ratio = canvasWidth / canvasHeight;
  const pdfRatio = pdfWidth / pdfHeight;

  let finalWidth, finalHeight;

  // Fit image to page
  if (ratio > pdfRatio) {
    finalWidth = pdfWidth;
    finalHeight = pdfWidth / ratio;
  } else {
    finalHeight = pdfHeight;
    finalWidth = pdfHeight * ratio;
  }

  const x = (pdfWidth - finalWidth) / 2;
  const y = 0; // Align to top

  pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

  // Sanitize filename
  const safeFileName =
    fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".pdf";
  pdf.save(safeFileName);
};

export const addSignaturesToPdf = async (
  pdfFile: File,
  signatureA: string | null,
  signatureB: string | null
): Promise<void> => {
  const { PDFDocument } = PDFLib;

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
