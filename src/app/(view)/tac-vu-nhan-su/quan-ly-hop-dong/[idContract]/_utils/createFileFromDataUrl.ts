export const createFileFromDataUrl = async (
  dataUrl: string | null | undefined,
  filename: string
): Promise<File | null> => {
  if (!dataUrl) return null;
  try {
    // If it's a data URL or remote URL, fetch it as a blob and create a File
    const res = await fetch(dataUrl);
    if (!res.ok) {
      console.warn("Failed to fetch signature URL", res.status);
      return null;
    }
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  } catch (err) {
    // Fallback for data URLs without using fetch (older browsers/CSP)
    try {
      if (typeof dataUrl === "string" && dataUrl.startsWith("data:")) {
        const arr = dataUrl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      }
    } catch (e) {
      console.error("Failed to convert dataUrl to File", e);
    }
    console.error("createFileFromDataUrl error", err);
    return null;
  }
};
