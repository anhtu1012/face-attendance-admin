/* eslint-disable @typescript-eslint/no-explicit-any */
// Coordinate conversion utilities for PDF signature positioning

export interface CoordinateSystem {
  width: number;
  height: number;
  scale?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Element {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convert coordinates from canvas display space to PDF points space
 * Canvas: origin top-left, coordinates in pixels
 * PDF: origin bottom-left, coordinates in points (1/72 inch)
 */
export function canvasToPdfCoordinates(
  element: Element,
  canvasSystem: CoordinateSystem,
  pdfSystem: CoordinateSystem
): Element {
  // Phương pháp cải tiến: Sử dụng vị trí tương đối (%) kết hợp với điều chỉnh theo vùng
  // Điều này đảm bảo vị trí chữ ký trên PDF sẽ giống hệt vị trí trên màn hình

  // Lấy tọa độ chuẩn hóa (0-1 range) nếu có
  const normalizedX =
    (element as any).normalizedX !== undefined
      ? (element as any).normalizedX
      : element.x / canvasSystem.width;

  const normalizedY =
    (element as any).normalizedY !== undefined
      ? (element as any).normalizedY
      : element.y / canvasSystem.height;

  const normalizedWidth =
    (element as any).normalizedWidth !== undefined
      ? (element as any).normalizedWidth
      : element.width / canvasSystem.width;

  const normalizedHeight =
    (element as any).normalizedHeight !== undefined
      ? (element as any).normalizedHeight
      : element.height / canvasSystem.height;

  // Hệ số điều chỉnh chung - giải quyết vấn đề chữ ký nhảy lên khi in
  const globalYAdjustmentFactor = 1.0; // Không điều chỉnh tổng thể

  // Áp dụng hệ số điều chỉnh cho tọa độ Y chuẩn hóa
  // Dựa vào log, chữ ký đang ở trang 1, vị trí Y khoảng 905-951
  // Đây là vùng cuối trang (> 80% chiều cao trang)
  const adjustedNormalizedY = normalizedY * globalYAdjustmentFactor;

  // Tính toán vị trí trên PDF dựa trên tọa độ tương đối đã điều chỉnh
  const pdfX = normalizedX * pdfSystem.width;

  // Đối với tọa độ Y, cần lưu ý PDF có gốc tọa độ ở góc dưới bên trái
  // trong khi canvas có gốc tọa độ ở góc trên bên trái
  // Sử dụng tọa độ Y đã điều chỉnh
  const pdfY =
    pdfSystem.height -
    adjustedNormalizedY * pdfSystem.height -
    normalizedHeight * pdfSystem.height;

  // Tính kích thước trên PDF dựa trên kích thước tương đối
  const pdfWidth = normalizedWidth * pdfSystem.width;
  const pdfHeight = normalizedHeight * pdfSystem.height;

  // Điều chỉnh vị trí đặc biệt cho các phần tử ở cuối trang
  // Vấn đề chính là vị trí cuối trang thường bị lệch nhiều nhất

  // Kiểm tra xem đây có phải là trang cuối không
  const isLastPage =
    (element as any).pageIndex === (element as any).pageCount - 1;

  // Phân loại vị trí trên trang để áp dụng điều chỉnh khác nhau
  const isTopArea = normalizedY < 0.3; // Vùng trên (30% đầu trang)
  const isMiddleArea = normalizedY >= 0.3 && normalizedY <= 0.6; // Vùng giữa (30-60%)
  const isBottomArea = normalizedY > 0.6; // Vùng dưới (40% cuối trang)
  const isVeryBottomArea = normalizedY > 0.85; // Vùng rất gần cuối trang (15% cuối)

  // Kiểm tra vị trí chính xác hơn
  // const isExtremeBottom = normalizedY > 0.95; // 5% cuối cùng của trang

  // Điều chỉnh offset dựa trên vị trí và trang
  // Phần tử càng gần cuối trang, offset càng lớn
  let bottomOffset = 0;
  const horizontalOffset = 0;

  // Dựa trên log, chữ ký đang ở trang 1, vị trí Y khoảng 905-951 (>80% chiều cao trang)
  // Chúng ta cần điều chỉnh chính xác cho vị trí này

  // Khởi tạo bottomOffset với giá trị cơ bản
  bottomOffset = 0; // Bắt đầu với không điều chỉnh

  // Điều chỉnh đặc biệt cho PDF có nhiều trang
  const pageIndex = (element as any).pageIndex || 0;

  // Điều chỉnh dựa trên vị trí trang
  if (pageIndex > 0) {
    // Nếu không phải trang đầu tiên
    // Offset âm để đẩy chữ ký xuống
    bottomOffset = -pdfHeight * 0.02; // -2% cho các trang sau trang đầu
  }

  // Điều chỉnh thêm cho vùng cuối trang
  if (isBottomArea) {
    // Dựa vào log, chữ ký đang ở trang 1, vị trí Y khoảng 905-951
    // Đây là khoảng 82-86% chiều cao trang (905/1108 ≈ 0.82)

    // Điều chỉnh dựa trên vị trí Y trong trang
    if (normalizedY > 0.8 && normalizedY < 0.9) {
      // Vùng 80-90% từ trên xuống - offset nhỏ
      bottomOffset -= pdfHeight * 0.04; // -4% của chiều cao PDF
    } else if (normalizedY >= 0.9) {
      // Vùng 90-100% từ trên xuống - offset lớn hơn
      bottomOffset -= pdfHeight * 0.07; // -7% của chiều cao PDF
    } else {
      // Vùng 60-80% từ trên xuống - offset rất nhỏ
      bottomOffset -= pdfHeight * 0.02; // -2% của chiều cao PDF
    }

    // Điều chỉnh đặc biệt cho trang cuối
    if (isLastPage) {
      // Tăng thêm 50% offset cho trang cuối
      bottomOffset *= 1.5;
    }
  }

  // Điều chỉnh cho vùng giữa trang
  else if (isMiddleArea) {
    // Dựa vào log, chúng ta cần điều chỉnh nhẹ cho vùng giữa

    // Áp dụng offset âm nhỏ cho vùng giữa (để đẩy xuống)
    bottomOffset -= pdfHeight * 0.01; // -1% của chiều cao PDF

    // Điều chỉnh dần theo vị trí Y
    if (normalizedY > 0.45) {
      // Gần với vùng dưới
      bottomOffset -= pdfHeight * 0.01; // Thêm -1%
    }

    // Điều chỉnh đặc biệt cho trang cuối
    if (isLastPage) {
      bottomOffset -= pdfHeight * 0.01; // Thêm -1% cho trang cuối
    }
  }

  // Điều chỉnh nhỏ cho vùng đầu trang
  else if (isTopArea) {
    // Dựa vào log, chúng ta cần điều chỉnh rất nhẹ cho vùng đầu

    // Không cần điều chỉnh nhiều cho vùng đầu trang
    bottomOffset = 0;

    // Điều chỉnh nhẹ cho phần cuối của vùng đầu
    if (normalizedY > 0.2) {
      bottomOffset -= pdfHeight * 0.005; // -0.5% của chiều cao PDF
    }
  }

  // Điều chỉnh vị trí Y để đảm bảo phần tử không bị lệch ở cuối trang
  const adjustedPdfY = Math.max(0, pdfY - bottomOffset);

  // Điều chỉnh vị trí X nếu cần (hiện tại chưa cần)
  const adjustedPdfX = pdfX + horizontalOffset;

  console.log("Position adjustment:", {
    position: {
      top: isTopArea ? "top" : isMiddleArea ? "middle" : "bottom",
      veryBottom: isVeryBottomArea,
      lastPage: isLastPage,
    },
    normalizedY,
    offsets: {
      bottom: bottomOffset,
      horizontal: horizontalOffset,
    },
    original: {
      x: pdfX,
      y: pdfY,
    },
    adjusted: {
      x: adjustedPdfX,
      y: adjustedPdfY,
    },
  });

  console.log("PDF Coordinate Conversion (Improved):", {
    original: element,
    normalized: {
      x: normalizedX,
      y: normalizedY,
      width: normalizedWidth,
      height: normalizedHeight,
    },
    pdfCoordinates: {
      x: adjustedPdfX,
      y: adjustedPdfY,
      width: pdfWidth,
      height: pdfHeight,
    },
    systems: { canvas: canvasSystem, pdf: pdfSystem },
    position: {
      isTopArea,
      isMiddleArea,
      isBottomArea,
      isVeryBottomArea,
      isLastPage,
    },
    offsets: {
      bottom: bottomOffset,
      horizontal: horizontalOffset,
    },
  });

  // Trả về tọa độ đã điều chỉnh
  return {
    x: Math.max(0, adjustedPdfX), // Sử dụng vị trí X đã điều chỉnh
    y: Math.max(0, adjustedPdfY), // Sử dụng vị trí Y đã điều chỉnh
    width: Math.max(1, pdfWidth),
    height: Math.max(1, pdfHeight),
  };
}

/**
 * Convert coordinates from PDF points space to canvas display space
 * Used for positioning elements correctly on screen
 */
export function pdfToCanvasCoordinates(
  element: Element,
  pdfSystem: CoordinateSystem,
  canvasSystem: CoordinateSystem
): Element {
  // Calculate scale factors
  const scaleX = canvasSystem.width / pdfSystem.width;
  const scaleY = canvasSystem.height / pdfSystem.height;

  // Convert X coordinate (same origin)
  const canvasX = element.x * scaleX;

  // Convert Y coordinate (flip origin from bottom-left to top-left)
  const pdfY = element.y;
  const canvasY = canvasSystem.height - pdfY * scaleY - element.height * scaleY;

  // Convert size
  const canvasWidth = element.width * scaleX;
  const canvasHeight = element.height * scaleY;

  return {
    x: Math.max(0, canvasX),
    y: Math.max(0, canvasY),
    width: Math.max(1, canvasWidth),
    height: Math.max(1, canvasHeight),
  };
}

/**
 * Normalize coordinates to relative positions (0-1 range)
 * This ensures consistency across different display sizes
 */
export function normalizeCoordinates(
  element: Element,
  containerSystem: CoordinateSystem
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  return {
    x: element.x / containerSystem.width,
    y: element.y / containerSystem.height,
    width: element.width / containerSystem.width,
    height: element.height / containerSystem.height,
  };
}

/**
 * Denormalize coordinates from relative positions (0-1 range) to absolute pixels
 */
export function denormalizeCoordinates(
  normalizedElement: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  containerSystem: CoordinateSystem
): Element {
  return {
    x: normalizedElement.x * containerSystem.width,
    y: normalizedElement.y * containerSystem.height,
    width: normalizedElement.width * containerSystem.width,
    height: normalizedElement.height * containerSystem.height,
  };
}

/**
 * Debug function to log coordinate conversion details
 */
export function debugCoordinateConversion(
  element: Element,
  canvasSystem: CoordinateSystem,
  pdfSystem: CoordinateSystem
) {
  const converted = canvasToPdfCoordinates(element, canvasSystem, pdfSystem);

  console.log("Coordinate Conversion Debug:", {
    original: element,
    canvasSystem,
    pdfSystem,
    converted,
    scaleFactors: {
      x: pdfSystem.width / canvasSystem.width,
      y: pdfSystem.height / canvasSystem.height,
    },
  });

  return converted;
}

/**
 * Adjust element position for end-of-page elements
 * This helps fix positioning issues when elements are placed at the bottom of pages
 */
export function adjustEndOfPagePosition(
  element: Element,
  pageData: {
    pageIndex: number;
    pageCount: number;
    pageHeight: number;
    pageWidth: number;
  }
): Element {
  const { pageIndex, pageCount, pageHeight } = pageData;
  const isLastPage = pageIndex === pageCount - 1;
  const isNearBottom = element.y > pageHeight * 0.8; // Element in bottom 20% of page

  // If element is near the bottom of the last page, adjust position
  if (isLastPage && isNearBottom) {
    const bottomMargin = pageHeight * 0.05; // 5% margin from bottom
    const adjustedY = Math.min(
      element.y,
      pageHeight - element.height - bottomMargin
    );

    console.log("Adjusting end-of-page element:", {
      original: { y: element.y },
      adjusted: { y: adjustedY },
      pageHeight,
      isLastPage,
      isNearBottom,
    });

    return {
      ...element,
      y: adjustedY,
    };
  }

  return element;
}
