// PDF Optimization Utilities
export interface PdfOptimizationOptions {
  fontSize?: string;
  padding?: string;
  margin?: string;
  lineHeight?: string;
  pageBreakInside?: string;
}

/**
 * Apply PDF-optimized styles to an element for better A4 rendering
 */
export const applyPdfOptimizedStyles = (
  element: HTMLElement,
  options: PdfOptimizationOptions = {}
): void => {
  const defaultOptions: Required<PdfOptimizationOptions> = {
    fontSize: "10pt",
    padding: "15mm 10mm",
    margin: "0",
    lineHeight: "1.4",
    pageBreakInside: "avoid",
  };

  const opts = { ...defaultOptions, ...options };

  // Apply base PDF styles
  const styles = {
    width: "210mm",
    minHeight: "297mm",
    maxWidth: "210mm",
    padding: opts.padding,
    margin: opts.margin,
    fontSize: opts.fontSize,
    lineHeight: opts.lineHeight,
    backgroundColor: "white",
    color: "black",
    boxSizing: "border-box",
    boxShadow: "none",
    border: "none",
    transform: "none",
    position: "static",
    overflow: "visible",
    pageBreakInside: opts.pageBreakInside,
    fontFamily: "serif",
    "-webkit-print-color-adjust": "exact",
    "print-color-adjust": "exact",
  } as const;

  Object.assign(element.style, styles);
  element.classList.add("pdf-render-mode");
};

/**
 * Remove PDF optimization styles from an element
 */
export const removePdfOptimizedStyles = (
  element: HTMLElement,
  originalStyles: Partial<CSSStyleDeclaration> = {}
): void => {
  element.classList.remove("pdf-render-mode");

  // Restore original styles
  Object.assign(element.style, originalStyles);
};

/**
 * Optimize content for PDF rendering by adjusting font sizes and spacing
 */
export const optimizeContentForPdf = (element: HTMLElement): void => {
  // Headers
  const headers = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headers.forEach((header) => {
    const htmlHeader = header as HTMLElement;
    htmlHeader.style.fontSize = "11pt";
    htmlHeader.style.fontWeight = "bold";
    htmlHeader.style.marginTop = "6mm";
    htmlHeader.style.marginBottom = "3mm";
    htmlHeader.style.pageBreakAfter = "avoid";
    htmlHeader.style.pageBreakInside = "avoid";
  });

  // Paragraphs
  const paragraphs = element.querySelectorAll("p");
  paragraphs.forEach((p) => {
    const htmlP = p as HTMLElement;
    htmlP.style.fontSize = "10pt";
    htmlP.style.lineHeight = "1.4";
    htmlP.style.marginBottom = "3mm";
    htmlP.style.textAlign = "justify";
    htmlP.style.wordWrap = "break-word";
  });

  // Lists
  const lists = element.querySelectorAll("ul, ol");
  lists.forEach((list) => {
    const htmlList = list as HTMLElement;
    htmlList.style.marginBottom = "4mm";
    htmlList.style.paddingLeft = "8mm";

    const listItems = list.querySelectorAll("li");
    listItems.forEach((li) => {
      const htmlLi = li as HTMLElement;
      htmlLi.style.fontSize = "10pt";
      htmlLi.style.lineHeight = "1.4";
      htmlLi.style.marginBottom = "2mm";
    });
  });

  // Tables
  const tables = element.querySelectorAll("table");
  tables.forEach((table) => {
    const htmlTable = table as HTMLElement;
    htmlTable.style.width = "100%";
    htmlTable.style.borderCollapse = "collapse";
    htmlTable.style.marginBottom = "5mm";
    htmlTable.style.fontSize = "9pt";
    htmlTable.style.pageBreakInside = "avoid";

    const cells = table.querySelectorAll("th, td");
    cells.forEach((cell) => {
      const htmlCell = cell as HTMLElement;
      htmlCell.style.border = "0.5pt solid black";
      htmlCell.style.padding = "2mm";
      htmlCell.style.textAlign = "left";

      if (cell.tagName === "TH") {
        htmlCell.style.fontWeight = "bold";
        htmlCell.style.backgroundColor = "#f5f5f5";
      }
    });
  });

  // Strong and emphasis
  const strongElements = element.querySelectorAll("strong, b");
  strongElements.forEach((strong) => {
    (strong as HTMLElement).style.fontWeight = "bold";
  });

  const emElements = element.querySelectorAll("em, i");
  emElements.forEach((em) => {
    (em as HTMLElement).style.fontStyle = "italic";
  });
};

/**
 * Calculate optimal page dimensions for A4 printing
 */
export const getA4Dimensions = () => {
  return {
    // A4 dimensions in mm
    widthMM: 210,
    heightMM: 297,
    // A4 dimensions in points (72 DPI)
    widthPt: 595,
    heightPt: 842,
    // A4 dimensions in pixels (96 DPI)
    widthPx: 794,
    heightPx: 1123,
    // Margins in mm
    marginTop: 15,
    marginRight: 20,
    marginBottom: 15,
    marginLeft: 20,
    // Content area in mm
    contentWidth: 170, // 210 - 20 - 20
    contentHeight: 267, // 297 - 15 - 15
  };
};

/**
 * Reset all ancestor transforms to prevent PDF scaling issues
 */
export const resetAncestorTransforms = (element: HTMLElement): (() => void) => {
  const transforms: { element: HTMLElement; transform: string }[] = [];
  let current = element.parentElement;

  while (current) {
    if (current.style.transform && current.style.transform !== "none") {
      transforms.push({ element: current, transform: current.style.transform });
      current.style.transform = "none";
    }
    current = current.parentElement;
  }

  // Return cleanup function
  return () => {
    for (const { element, transform } of transforms) {
      element.style.transform = transform;
    }
  };
};
