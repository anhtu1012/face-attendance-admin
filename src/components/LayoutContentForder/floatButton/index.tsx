"use client";

import { Popover, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { MdSettingsSuggest } from "react-icons/md";
import { PiSelectionPlus } from "react-icons/pi";
import PanelTemplatesPopover from "../panelTemplatesModal";
import "./style.scss";

interface IFloatButtonProps {
  layoutType: number;
  fullScreen?: boolean;
  pushPanel?: boolean;
  isOpen?: boolean;
  fullScreenEnabled: boolean;
  handleToggle: () => void;
  handleFullScreenToggle: () => void;
  setToggleInput: React.Dispatch<React.SetStateAction<boolean[]>>;
  toggleInput: boolean[];
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

export default function FloatButton({
  setToggleInput,
  toggleInput,
  pushPanel,
  layoutType,
  fullScreen,
  isOpen = true,
  fullScreenEnabled,
  handleToggle,
  handleFullScreenToggle,
  hideContent,
}: IFloatButtonProps) {
  const [title, setTitle] = useState("Right Panel");
  const [openMenu, setOpenMenu] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);

  // Lấy cấu hình layout hiện tại
  const currentLayout = LAYOUT_CONFIG[layoutType];

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
        closeablePanels.push(
          { panel: "content1", position: "left", ratio: 6.5 },
          { panel: "content2", position: "right", ratio: 3.5 },
          { panel: "content3", position: "bottom", ratio: 1 },
          { panel: "content4", position: "bottom", ratio: 1 }
        );
        break;
      case "complex-113":
        closeablePanels.push(
          { panel: "content1", position: "left", ratio: 2 },
          { panel: "content2", position: "left", ratio: 3 },
          { panel: "content3", position: "right", ratio: 5 }
        );
        break;
    }

    return closeablePanels;
  };

  const displayIconType = (layoutType: number, isOpen: boolean) => {
    const closeablePanels = getCloseablePanels();

    // Xác định panel nào đang được toggle dựa trên layout type
    let panelPosition = "right"; // default

    if (closeablePanels.length > 0) {
      let selectedPanel;

      // Đặc biệt xử lý cho layout type 6 - luôn đóng content2 trước
      if (layoutType === 6) {
        selectedPanel = closeablePanels.find(
          (panel) => panel.panel === "content2"
        );
        if (!selectedPanel) {
          // Fallback: ưu tiên panel có tỉ lệ nhỏ hơn
          const sortedPanels = closeablePanels.sort(
            (a, b) => a.ratio - b.ratio
          );
          selectedPanel = sortedPanels[0];
        }
      } else if (layoutType === 113) {
        selectedPanel = closeablePanels.find(
          (panel) => panel.panel === "content2"
        );
        if (!selectedPanel) {
          const sortedPanels = closeablePanels.sort(
            (a, b) => a.ratio - b.ratio
          );
          selectedPanel = sortedPanels[0];
        }
      } else {
        // Các layout type khác: ưu tiên panel có tỉ lệ nhỏ hơn
        const sortedPanels = closeablePanels.sort((a, b) => a.ratio - b.ratio);
        selectedPanel = sortedPanels[0];
      }

      panelPosition = selectedPanel.position;
    }

    // Xác định icon dựa trên vị trí panel
    if (panelPosition === "left") {
      return isOpen ? (
        <FaAnglesLeft fontSize={32} color="white" />
      ) : (
        <FaAnglesRight fontSize={32} color="white" />
      );
    } else {
      return isOpen ? (
        <FaAnglesRight fontSize={32} color="white" />
      ) : (
        <FaAnglesLeft fontSize={32} color="white" />
      );
    }
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
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
      } else {
        // Các layout type khác: ưu tiên panel có tỉ lệ nhỏ hơn
        const sortedPanels = closeablePanels.sort((a, b) => a.ratio - b.ratio);
        targetPanel = sortedPanels[0];
      }

      // Cập nhật title dựa trên vị trí panel
      if (targetPanel.position === "left") {
        setTitle("Left Panel");
      } else if (targetPanel.position === "right") {
        setTitle("Right Panel");
      } else if (targetPanel.position === "top") {
        setTitle("Top Panel");
      } else if (targetPanel.position === "bottom") {
        setTitle("Bottom Panel");
      }
    } else {
      // Fallback cho layout không có panel có thể đóng
      const leftPanelLayouts = [1, 5, 10, 13];
      if (leftPanelLayouts.includes(layoutType)) {
        setTitle("Left Panel");
      } else {
        setTitle("Right Panel");
      }
    }
  }, [layoutType, currentLayout]);

  return (
    <div className="floatButton">
      <input
        onClick={toggleMenu}
        id="triggerButton"
        className="triggerButton"
        type="checkbox"
      />
      <label
        htmlFor="triggerButton"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {openMenu === false ? (
          <MdSettingsSuggest
            className="settings-icon"
            size={32}
            color="white"
          />
        ) : (
          <FaTimes className="settings-icon" size={32} color="white" />
        )}
      </label>
      {fullScreenEnabled && (
        <Tooltip
          placement="left"
          color="#0e4ca6"
          title={
            <span style={{ fontWeight: "bold", color: "white" }}>
              {fullScreen
                ? "Thoát chế độ toàn màn hình"
                : "Chế độ toàn màn hình"}
            </span>
          }
          getPopupContainer={(triggerNode) =>
            triggerNode.parentElement || document.body
          }
        >
          <div
            onClick={handleFullScreenToggle}
            className="one"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {fullScreen ? (
              <AiOutlineFullscreenExit fontSize={32} color="white" />
            ) : (
              <AiOutlineFullscreen fontSize={32} color="white" />
            )}
          </div>
        </Tooltip>
      )}
      {pushPanel && (
        <Tooltip
          placement="left"
          color="#0e4ca6"
          title={
            <span style={{ fontWeight: "bold", color: "white" }}>
              {isOpen ? `Close ${title}` : `Open ${title}`}
            </span>
          }
          getPopupContainer={(triggerNode) =>
            triggerNode.parentElement || document.body
          }
        >
          <div
            onClick={handleToggle}
            className="two"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {displayIconType(layoutType, isOpen ?? false)}
          </div>
        </Tooltip>
      )}
      <Tooltip
        placement="left"
        color="#0e4ca6"
        title={
          <span style={{ fontWeight: "bold", color: "white" }}>
            Choose panel
          </span>
        }
        getPopupContainer={(triggerNode) =>
          triggerNode.parentElement || document.body
        }
      >
        <Popover
          content={
            <PanelTemplatesPopover
              layoutType={layoutType}
              toggleInput={toggleInput}
              setToggleInput={setToggleInput}
              closePopover={() => setOpenPopover(false)}
              hideContent={hideContent}
            />
          }
          title="Chọn những phần nội dung để loại bỏ"
          trigger="click"
          open={openPopover}
          onOpenChange={(visible) => setOpenPopover(visible)}
        >
          <div
            className="three"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PiSelectionPlus fontSize={32} color="white" />
          </div>
        </Popover>
      </Tooltip>
    </div>
  );
}
