/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, ReactNode, useEffect, useRef } from "react";
import "./style.scss";
import FloatButton from "../floatButton";

interface CloseOpenModalProps {
  children?: ReactNode;
  defaultOpen?: boolean;
  layoutType: number;
  fullScreen?: boolean;
  floatButton?: boolean;
  hideContent?: number;
}

// Interface cho layout configuration
interface LayoutConfig {
  type: string;
  panels: string[];
  ratios?: number[];
  widths?: string[];
  adjustable?: boolean;
}

// Mapping tỉ lệ và cấu trúc của từng layout type
const LAYOUT_CONFIG: Record<number, LayoutConfig> = {
  1: { type: "single", panels: ["content1"] },
  2: {
    type: "horizontal",
    panels: ["content1", "content2"],
    ratios: [6.5, 3.5],
    widths: ["65%", "35%"],
  },
  3: { type: "vertical", panels: ["content1", "content2"], ratios: [2, 8] },
  4: { type: "vertical", panels: ["content1", "content2"], ratios: [7, 3] },
  5: {
    type: "horizontal",
    panels: ["content1", "content2"],
    ratios: [1.8, 8.2],
    adjustable: true,
  },
  6: {
    type: "complex",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [6.5, 3.5, 1, 1],
  },
  7: {
    type: "left-column",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [1, 1, 1, 1],
    widths: ["70%", "30%"],
  },
  8: {
    type: "top-left-right",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [1, 1, 1, 1],
    widths: ["70%", "30%"],
  },
  9: {
    type: "top-left",
    panels: ["content1", "content2", "content3"],
    ratios: [1, 1, 1],
    widths: ["70%"],
  },
  10: {
    type: "top-sidebar",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [1, 2, 8, 1],
    widths: ["20%", "80%"],
  },
  11: {
    type: "top-sidebar",
    panels: ["content1", "content2", "content3"],
    ratios: [1, 6.5, 3.5],
    widths: ["20%", "80%"],
  },
  12: {
    type: "top-equal",
    panels: ["content1", "content2", "content3"],
    ratios: [1, 5, 5],
    widths: ["20%", "80%"],
  },
  13: {
    type: "top-adjustable",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [1, 2, 8, 1],
    widths: ["30%", "70%"],
    adjustable: true,
  },
  14: {
    type: "top-three",
    panels: ["content1", "content2", "content3", "content4"],
    ratios: [1, 3, 3, 3],
    widths: ["30%", "70%"],
  },
  15: {
    type: "top-sidebar",
    panels: ["content1", "content2", "content3"],
    ratios: [1, 0.3, 1],
    widths: ["30%", "70%"],
  },
  16: {
    type: "top-left-right",
    panels: ["content1", "content2", "content3"],
    ratios: [1, 7, 3],
    widths: ["70%", "30%"],
  },
  113: {
    type: "complex-113",
    panels: ["content1", "content2", "content3"],
    ratios: [2, 3, 5],
    widths: ["20%", "30%", "50%"],
    adjustable: true,
  },
};

export default function CloseOpenModal({
  layoutType,
  children,
  floatButton = false,
  defaultOpen = true,
  hideContent,
}: CloseOpenModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [fullScreenEnabled, setFullScreenEnabled] = useState(false);
  const [pushPanel, setPushPanel] = useState(false);
  const [contentClasses, setContentClasses] = useState<string[]>([]); // Mảng chứa danh sách class hợp lệ
  const [toggleInput, setToggleInput] = useState<boolean[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lấy cấu hình layout hiện tại
  const currentLayout = LAYOUT_CONFIG[layoutType];

  // --- FULLSCREEN API HANDLING - Được tối ưu hóa ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check for fullscreen element with browser prefix support
      const isFullScreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setFullScreenMode(isFullScreen);

      // Tối ưu hóa việc xử lý body styles
      if (isFullScreen) {
        document.body.classList.add("fullscreen-app");
        // Chỉ set overflow hidden khi thực sự cần thiết
        if (document.body.style.overflow !== "hidden") {
          document.body.style.overflow = "hidden";
        }
      } else {
        document.body.classList.remove("fullscreen-app");
        // Khôi phục scroll body một cách an toàn
        if (document.body.style.overflow === "hidden") {
          document.body.style.overflow = "";
        }
      }
    };

    // Add event listeners for all browser prefixes
    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      // Cleanup event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });

      // Cleanup body styles
      document.body.classList.remove("fullscreen-app");
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  useEffect(() => {
    setToggleInput((prev) => {
      if (prev.length !== contentClasses.length) {
        const newToggleInput = new Array(contentClasses.length).fill(false);

        // Nếu có hideContent, ẩn content đó ngay từ đầu
        if (hideContent && hideContent <= contentClasses.length) {
          newToggleInput[hideContent - 1] = true;
        }

        return newToggleInput;
      }
      return prev;
    });
  }, [contentClasses, hideContent]);

  useEffect(() => {
    if (containerRef.current) {
      const elements =
        containerRef.current.querySelectorAll<HTMLElement>(
          "[class*='content']"
        );

      elements.forEach((el, index) => {
        const className = el.className;

        if (/\bcontent\d+\b/.test(className)) {
          const contentIndex =
            parseInt(className.replace("content", ""), 10) - 1;

          // Kiểm tra nếu content này bị ẩn bởi hideContent option
          const isHiddenByOption = contentIndex + 1 === hideContent;

          if (toggleInput[contentIndex] || isHiddenByOption) {
            el.classList.add("hide");
            // Tối ưu hóa: chỉ xóa style inline khi cần thiết
            const inlineStyles = [
              "opacity",
              "transform",
              "pointer-events",
              "overflow",
            ];
            inlineStyles.forEach((style) => {
              if (el.style[style as any]) {
                el.style.removeProperty(style);
              }
            });
          } else {
            el.classList.remove("hide");
            // Tối ưu hóa: chỉ xóa style inline khi cần thiết
            const inlineStyles = [
              "opacity",
              "transform",
              "pointer-events",
              "overflow",
            ];
            inlineStyles.forEach((style) => {
              if (el.style[style as any]) {
                el.style.removeProperty(style);
              }
            });
          }
        }
      });
    }
  }, [toggleInput, hideContent]); // Run when toggleInput or hideContent changes

  useEffect(() => {
    // Xác định layoutType nào có thể toggle panel
    const togglePanelLayouts = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 113,
    ];
    if (togglePanelLayouts.includes(layoutType)) {
      setPushPanel(true);
    }

    // Xác định layoutType nào có thể fullscreen
    const fullscreenLayouts = [1, 3, 4, 6, 7, 8, 9, 10, 11, 13, 15, 113];
    if (fullscreenLayouts.includes(layoutType)) {
      setFullScreenEnabled(true);
    }
  }, [layoutType]);

  // Lấy danh sách class hợp lệ (content + số) và xử lý hideContent option
  useEffect(() => {
    if (containerRef.current) {
      const elements =
        containerRef.current.querySelectorAll("[class*='content']");
      const classList: string[] = [];

      elements.forEach((el) => {
        el.classList.forEach((className) => {
          if (
            /^content\d+$/.test(className) &&
            !classList.includes(className)
          ) {
            // Kiểm tra nếu content này không bị ẩn bởi hideContent option
            const contentIndex = parseInt(className.replace("content", ""), 10);
            const shouldHide = contentIndex === hideContent;

            if (!shouldHide) {
              classList.push(className);
            }
          }
        });
      });

      setContentClasses(classList);
    }
  }, [children, hideContent]); // Cập nhật khi children hoặc hideContent thay đổi

  const handleToggle = () => {
    // Xác định panel nào cần đóng dựa trên layout type
    const closeablePanels = getCloseablePanels();

    if (closeablePanels.length > 0) {
      let targetPanel;

      // Đặc biệt xử lý cho layout type 6 - luôn đóng content2 trước
      if (layoutType === 6) {
        targetPanel = closeablePanels.find(
          (panel) => panel.panel === "content2"
        );
        if (!targetPanel) {
          // Fallback: ưu tiên panel có tỉ lệ nhỏ hơn
          const sortedPanels = closeablePanels.sort(
            (a, b) => a.ratio - b.ratio
          );
          targetPanel = sortedPanels[0];
        }
      } else if (layoutType === 113) {
        // Layout 113: ưu tiên đóng content2 (panel ở giữa)
        targetPanel = closeablePanels.find(
          (panel) => panel.panel === "content2"
        );
        if (!targetPanel) {
          // Fallback: ưu tiên panel có tỉ lệ nhỏ hơn
          const sortedPanels = closeablePanels.sort(
            (a, b) => a.ratio - b.ratio
          );
          targetPanel = sortedPanels[0];
        }
      } else {
        // Các layout type khác: ưu tiên panel có tỉ lệ nhỏ hơn
        const sortedPanels = closeablePanels.sort((a, b) => a.ratio - b.ratio);
        targetPanel = sortedPanels[0];
      }

      // Tìm index của panel trong contentClasses
      const panelIndex = contentClasses.findIndex(
        (cls) => cls === targetPanel.panel
      );

      if (panelIndex !== -1) {
        // Toggle panel đó
        setToggleInput((prev) => {
          const newToggleInput = [...prev];
          newToggleInput[panelIndex] = !newToggleInput[panelIndex];
          return newToggleInput;
        });
      }
    } else {
      // Fallback: toggle trạng thái mở/đóng chung
      setIsOpen(!isOpen);
    }
  };

  const handleFullScreenToggle = () => {
    const elem =
      containerRef.current?.parentElement || document.documentElement;

    if (!fullScreenMode) {
      // Request fullscreen with browser prefix support - được tối ưu hóa
      try {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          // Chrome, Safari
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullscreen) {
          // Firefox
          (elem as any).mozRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          // IE/Edge
          (elem as any).msRequestFullscreen();
        }
      } catch (error) {
        console.warn("Fullscreen request failed:", error);
      }
    } else {
      // Exit fullscreen with browser prefix support - được tối ưu hóa
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          // Chrome, Safari
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          // Firefox
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          // IE/Edge
          (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.warn("Exit fullscreen failed:", error);
      }
    }
  };

  // Hàm xác định panel nào có thể đóng dựa trên layout type
  const getCloseablePanels = () => {
    if (!currentLayout || !currentLayout.ratios) return [];

    const closeablePanels: {
      panel: string;
      position: "left" | "right" | "top" | "bottom";
      ratio: number;
    }[] = [];

    switch (currentLayout.type) {
      case "horizontal":
        // Layout 2, 5: left-right panels
        closeablePanels.push(
          {
            panel: "content1",
            position: "left",
            ratio: currentLayout.ratios[0],
          },
          {
            panel: "content2",
            position: "right",
            ratio: currentLayout.ratios[1],
          }
        );
        break;
      case "vertical":
        // Layout 3, 4: top-bottom panels
        closeablePanels.push(
          {
            panel: "content1",
            position: "top",
            ratio: currentLayout.ratios[0],
          },
          {
            panel: "content2",
            position: "bottom",
            ratio: currentLayout.ratios[1],
          }
        );
        break;
      case "left-column":
        // Layout 7: left column with right sidebar
        closeablePanels.push({
          panel: "content4",
          position: "right",
          ratio: 3,
        });
        break;
      case "top-left-right":
        // Layout 8, 16: top with left column and right sidebar
        closeablePanels.push({
          panel: "content3",
          position: "right",
          ratio: 3,
        });
        break;
      case "top-sidebar":
        // Layout 10, 11, 13, 15: top with sidebar
        if (currentLayout.panels.includes("content2")) {
          closeablePanels.push({
            panel: "content2",
            position: "left",
            ratio: currentLayout.ratios[1],
          });
        }
        break;
      case "top-equal":
        // Layout 12: top with equal columns
        closeablePanels.push(
          { panel: "content2", position: "left", ratio: 5 },
          { panel: "content3", position: "right", ratio: 5 }
        );
        break;
      case "top-three":
        // Layout 14: top with three equal columns
        closeablePanels.push(
          { panel: "content2", position: "left", ratio: 3 },
          { panel: "content3", position: "right", ratio: 3 },
          { panel: "content4", position: "right", ratio: 3 }
        );
        break;
      case "complex":
        // Layout 6: complex layout with multiple panels
        // Ưu tiên đóng content2 (right panel) trước content1 (left panel)
        closeablePanels.push(
          { panel: "content2", position: "right", ratio: 3.5 },
          { panel: "content1", position: "left", ratio: 6.5 },
          { panel: "content3", position: "bottom", ratio: 1 },
          { panel: "content4", position: "bottom", ratio: 1 }
        );
        break;
      case "complex-113":
        // Layout 113: complex layout with 3 panels in a row
        closeablePanels.push(
          { panel: "content1", position: "left", ratio: 2 },
          { panel: "content2", position: "left", ratio: 3 },
          { panel: "content3", position: "right", ratio: 5 }
        );
        break;
    }

    // Lọc ra chỉ những panel thực sự tồn tại trong DOM
    return closeablePanels.filter((panel) =>
      contentClasses.includes(panel.panel)
    );
  };

  return floatButton ? (
    <div className={`layoutType${layoutType}`} ref={containerRef}>
      <div
        className={`close-open-modal ${isOpen ? "open" : "close"} ${
          fullScreenMode ? "full-screen" : "normal"
        }`}
      >
        <div className="close-open-modal__content">{children}</div>
        <FloatButton
          setToggleInput={setToggleInput}
          toggleInput={toggleInput}
          pushPanel={pushPanel}
          fullScreenEnabled={fullScreenEnabled}
          handleFullScreenToggle={handleFullScreenToggle}
          handleToggle={handleToggle}
          layoutType={layoutType}
          isOpen={isOpen}
          key={fullScreenMode ? "fullscreen" : "normal"}
          fullScreen={fullScreenMode}
          hideContent={hideContent}
        />
      </div>
    </div>
  ) : (
    <div>{children}</div>
  );
}
