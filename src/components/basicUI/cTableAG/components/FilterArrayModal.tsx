import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface FilterArrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (selectedColumns: string[], filterText: string) => void;
  columns: { field: string; headerName: string }[];
  initialSelectedColumns: string[];
  initialFilterValues: string;
  theme: string;
}

const FilterArrayModal: React.FC<FilterArrayModalProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  columns,
  initialSelectedColumns,
  initialFilterValues,
  theme,
}) => {
  const t = useTranslations("FilterArrayModal");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Draggable state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColumns(initialSelectedColumns);
      setFilterText(initialFilterValues);
      // Reset position when modal opens
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialSelectedColumns, initialFilterValues]);

  // Draggable handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!modalRef.current) return;

    setIsDragging(true);
    // Calculate offset from mouse position to current modal position
    // Since modal is centered, we use the center point as reference
    const rect = modalRef.current.getBoundingClientRect();
    const modalCenterX = rect.left + rect.width / 2;
    const modalCenterY = rect.top + rect.height / 2;

    setDragOffset({
      x: e.clientX - modalCenterX,
      y: e.clientY - modalCenterY,
    });

    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !modalRef.current) return;

      // Calculate new position relative to viewport center
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      const newX = e.clientX - dragOffset.x - viewportCenterX;
      const newY = e.clientY - dragOffset.y - viewportCenterY;

      // Improved bounds checking to keep modal fully visible
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const modalRect = modalRef.current.getBoundingClientRect();

      // Calculate bounds to keep modal fully within viewport
      // Allow small margin for better UX
      const margin = 20;
      const minX = -viewport.width / 2 + modalRect.width / 2 + margin;
      const maxX = viewport.width / 2 - modalRect.width / 2 - margin;
      const minY = -viewport.height / 2 + modalRect.height / 2 + margin;
      const maxY = viewport.height / 2 - modalRect.height / 2 - margin;

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle checkbox changes
  const handleColumnToggle = (field: string) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  // Toggle all columns
  const toggleAllColumns = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns.map((col) => col.field));
    }
  };

  // Handle filter application
  const handleApply = () => {
    // Clean up filter text before applying
    const cleanedFilterText = filterText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");

    onApplyFilter(selectedColumns, cleanedFilterText);
  };

  // Count the number of filter values (non-empty lines)
  const filterValueCount = filterText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "").length;

  // Filter columns by search term
  const filteredColumns = columns.filter((column) =>
    column.headerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  const isDark = theme === "dark";

  // Styles
  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: isDark ? "#1a1a1a" : "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "800px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: isDark ? "#eee" : "#333",
    position: "absolute", // Added for draggable positioning
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: `1px solid ${isDark ? "#444" : "#eee"}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: isDark ? "#333" : "#f9f9f9",
    cursor: isDragging ? "grabbing" : "grab", // Updated cursor for dragging
    userSelect: "none", // Prevent text selection while dragging
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: "20px",
    display: "flex",
    overflowY: "auto",
    flexGrow: 1,
    gap: "20px",
  };

  const columnSectionStyle: React.CSSProperties = {
    width: "40%",
    overflowY: "auto",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRight: `1px solid ${isDark ? "#444" : "#eee"}`,
    paddingRight: "20px",
  };

  const valueSectionStyle: React.CSSProperties = {
    width: "60%",
    display: "flex",
    flexDirection: "column",
  };

  const searchInputStyle: React.CSSProperties = {
    padding: "8px 12px",
    marginBottom: "10px",
    border: `1px solid ${isDark ? "#555" : "#ddd"}`,
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    backgroundColor: isDark ? "#444" : "white",
    color: isDark ? "white" : "black",
  };

  const textareaStyle: React.CSSProperties = {
    height: "100%",
    minHeight: "350px",
    padding: "8px 12px",
    border: `1px solid ${isDark ? "#555" : "#ddd"}`,
    borderRadius: "4px",
    fontSize: "14px",
    resize: "none",
    fontFamily: "monospace",
    backgroundColor: isDark ? "#444" : "white",
    color: isDark ? "white" : "black",
  };

  const footerStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderTop: `1px solid ${isDark ? "#444" : "#eee"}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    backgroundColor: isDark ? "#333" : "#f9f9f9",
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    padding: "6px",
    borderRadius: "4px",
    backgroundColor: isDark ? "#222" : "#f5f5f5",
    cursor: "pointer",
  };

  const checkboxLabelStyle: React.CSSProperties = {
    cursor: "pointer",
    marginLeft: "8px",
    fontSize: "14px",
    userSelect: "none",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: isDark ? "#2a3f54" : "#e6f7ff",
    color: isDark ? "white" : "#333",
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isDark ? "#444" : "#f0f0f0",
  };

  const toggleAllStyle: React.CSSProperties = {
    ...buttonStyle,
    marginBottom: "10px",
    textAlign: "center",
  };

  const columnHelpTextStyle: React.CSSProperties = {
    fontSize: "12px",
    color: isDark ? "#aaa" : "#888",
    marginBottom: "10px",
  };

  return (
    <div style={modalOverlayStyle}>
      <div
        ref={modalRef}
        style={modalContentStyle}
        className="filter-array-modal"
      >
        <div
          style={modalHeaderStyle}
          className="modal-draggable-handle"
          onMouseDown={handleMouseDown}
        >
          <h3 style={{ margin: 0, fontSize: "16px" }}>{t("FilterArray")}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: isDark ? "#ccc" : "#666",
            }}
          >
            &times;
          </button>
        </div>

        <div style={modalBodyStyle}>
          {/* Left side - Column selection */}
          <div style={columnSectionStyle}>
            <div style={columnHelpTextStyle}>
              {t("SelectColumnsHelpText")}
              {selectedColumns.length > 0 && (
                <span
                  style={{
                    color: isDark ? "#8bd8f4" : "#0078d7",
                  }}
                >
                  {" "}
                  ({selectedColumns.length} {t("Selected")})
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder={t("SearchColumns")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />

            <button onClick={toggleAllColumns} style={toggleAllStyle}>
              {selectedColumns.length === columns.length
                ? t("DeselectAll")
                : t("SelectAll")}
            </button>

            <div style={{ overflowY: "auto" }}>
              {filteredColumns.map((column) => (
                <div
                  key={column.field}
                  style={checkboxContainerStyle}
                  onClick={() => handleColumnToggle(column.field)}
                >
                  <input
                    type="checkbox"
                    id={`col-${column.field}`}
                    checked={selectedColumns.includes(column.field)}
                    onChange={() => {}} // Handled by onClick on container
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    htmlFor={`col-${column.field}`}
                    style={checkboxLabelStyle}
                  >
                    {column.headerName}
                  </label>
                </div>
              ))}

              {filteredColumns.length === 0 && (
                <div
                  style={{
                    color: isDark ? "#999" : "#666",
                    padding: "10px 0",
                  }}
                >
                  {t("NoColumnsFound")}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Filter values */}
          <div style={valueSectionStyle}>
            <div
              style={{
                marginBottom: "10px",
                fontSize: "14px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{t("entervalue")}</span>
              {filterValueCount > 0 && (
                <span
                  style={{
                    color: isDark ? "#8bd8f4" : "#0078d7",
                  }}
                >
                  {filterValueCount} values
                </span>
              )}
            </div>
            <textarea
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={textareaStyle}
              placeholder={t("entervalue")}
            />
          </div>
        </div>

        <div style={footerStyle}>
          <button style={cancelButtonStyle} onClick={onClose}>
            {t("Cancel")}
          </button>
          <button
            style={{
              ...buttonStyle,
              opacity:
                selectedColumns.length === 0 || filterValueCount === 0
                  ? 0.5
                  : 1,
            }}
            onClick={handleApply}
            disabled={selectedColumns.length === 0 || filterValueCount === 0}
          >
            {t("ApplyFilter")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterArrayModal;
