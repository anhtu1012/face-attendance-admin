/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

// Try to resolve pdfjs at runtime (may be provided on window, available via package, or loaded from CDN)
const PDFJS_CDN = {
  script: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  worker:
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
};

async function ensurePdfjsLib(): Promise<any> {
  if (typeof window === "undefined") return undefined;
  const w = window as any;
  if (w.pdfjsLib) return w.pdfjsLib;

  // Try dynamic import from installed package (preferred in bundled environments)
  try {
    // Importing top-level 'pdfjs-dist' may differ by bundler; try common entrypoints
    const mod = await import("pdfjs-dist");
    const lib = mod?.default ?? mod;
    if (lib) {
      w.pdfjsLib = lib;
      if (w.pdfjsLib.GlobalWorkerOptions) {
        try {
          w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN.worker;
        } catch {}
      }
      return w.pdfjsLib;
    }
  } catch {
    // dynamic import failed -> fall back to CDN
  }

  // Fallback: inject CDN script and wait for it to load
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src=\"${PDFJS_CDN.script}\"]`
    );
    if (existing) {
      // If script already present, wait a tick for pdfjsLib to be available
      const check = () => {
        if ((window as any).pdfjsLib) return resolve();
        setTimeout(check, 50);
      };
      check();
      return;
    }

    const script = document.createElement("script");
    script.src = PDFJS_CDN.script;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load pdfjs from CDN"));
    document.head.appendChild(script);
  });

  if ((window as any).pdfjsLib) {
    try {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN.worker;
    } catch {}
    return (window as any).pdfjsLib;
  }

  return undefined;
}

export const useCvProcessor = (file: File | null) => {
  const [cvContent, setCvContent] = useState<string | File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setCvContent(null);
      return;
    }

    const processFile = async () => {
      setIsProcessing(true);
      setProcessingError(null);
      setCvContent(null);

      // Ensure we have a native File before accessing .type
      if (!(file instanceof File)) {
        setProcessingError("Invalid file provided.");
        setIsProcessing(false);
        return;
      }

      if (file.type === "application/pdf") {
        // Handle PDF parsing
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target?.result) {
              const typedarray = new Uint8Array(
                event.target.result as ArrayBuffer
              );
              const lib = await ensurePdfjsLib();
              if (!lib) {
                throw new Error("PDF library is not available");
              }
              const pdf = await lib.getDocument(typedarray).promise;
              let fullText = "";
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                  .map((item: any) => item.str)
                  .join(" ");
                fullText += pageText + "\n";
              }
              setCvContent(fullText);
            }
          };
          reader.onerror = () => {
            setProcessingError("Failed to read the PDF file.");
          };
          reader.readAsArrayBuffer(file);
          // FIX: Moved reader.onloadend inside the try block where reader is defined.
          // This resolves the "Cannot find name 'reader'" error and correctly handles
          // the processing state without the need for a setTimeout hack.
          reader.onloadend = () => {
            setIsProcessing(false);
          };
        } catch (error) {
          console.error("Error parsing PDF:", error);
          setProcessingError(
            "Could not parse the PDF file. It might be corrupted."
          );
          setIsProcessing(false);
        }
      } else if (file.type.startsWith("image/")) {
        // Handle image, just set the file object
        setCvContent(file);
        setIsProcessing(false);
      } else {
        setProcessingError(`Unsupported file type: ${file.type}`);
        setIsProcessing(false);
      }
    };

    processFile();
  }, [file]);

  return { cvContent, isProcessing, processingError };
};
