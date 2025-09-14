import { useCallback, useEffect } from "react";
import { ColDef } from "@ag-grid-community/core";

interface UseClipboardProps {
  selectedCells: Set<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridRef?: React.RefObject<any>;
}

export const useClipboard = ({ selectedCells, gridRef }: UseClipboardProps) => {
  // Hàm xử lý sự kiện nhấn phím (Ctrl+C để sao chép các ô đã chọn)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Kiểm tra tổ hợp phím Ctrl+C
      if (
        (event.ctrlKey && event.key === "c") ||
        (event.metaKey && event.key === "c")
      ) {
        const clipboardData: string[] = [];
        const gridApi = gridRef?.current?.api;
        if (!gridApi) return;

        try {
          // Lấy danh sách các cột theo thứ tự trong columnDefs
          const columnDefs = gridApi.getColumnDefs();
          if (!columnDefs) {
            return;
          }

          // Lọc và lấy `field` từ các đối tượng ColDef
          const columnOrder = (columnDefs as ColDef[])
            .filter(
              (colDef) =>
                colDef &&
                typeof colDef === "object" &&
                "field" in colDef &&
                !!colDef.field
            )
            .map((colDef) => colDef.field as string);

          if (columnOrder.length === 0) {
            return;
          }

          // Parse và sắp xếp các ô đã chọn
          const sortedCells = Array.from(selectedCells).sort((a, b) => {
            const [rowA, colFieldA] = a.split("-");
            const [rowB, colFieldB] = b.split("-");

            // Kiểm tra giá trị hợp lệ
            if (!rowA || !rowB || !colFieldA || !colFieldB) return 0;

            const colIndexA = columnOrder.indexOf(colFieldA);
            const colIndexB = columnOrder.indexOf(colFieldB);

            // Xử lý trường hợp không tìm thấy cột
            if (colIndexA === -1 || colIndexB === -1) {
              return colIndexA === -1 ? 1 : -1; // Đẩy cột không tìm thấy xuống cuối
            }

            return rowA === rowB
              ? colIndexA - colIndexB
              : parseInt(rowA, 10) - parseInt(rowB, 10);
          });

          // Tạo cấu trúc dữ liệu clipboard
          const rowDataMap: { [key: number]: { [key: string]: string } } = {};

          sortedCells.forEach((cellId) => {
            const parts = cellId.split("-");
            if (parts.length !== 2) return;

            const [rowIndexString, colField] = parts;
            const rowIndex = parseInt(rowIndexString, 10);

            if (isNaN(rowIndex)) return;

            const rowNode = gridApi.getDisplayedRowAtIndex(rowIndex);
            if (!rowNode || !rowNode.data) return;

            if (!rowDataMap[rowIndex]) {
              rowDataMap[rowIndex] = {};
            }

            // Xử lý dữ liệu của ô an toàn
            let cellValue = "";
            try {
              cellValue =
                rowNode.data[colField] !== undefined &&
                rowNode.data[colField] !== null
                  ? String(rowNode.data[colField]).replace(/\r/g, "").trim()
                  : "";
            } catch (err) {
              console.warn(
                `Error processing cell value at ${rowIndex}-${colField}:`,
                err
              );
            }

            rowDataMap[rowIndex][colField] = cellValue;
          });

          // Chỉ xây dựng dữ liệu cho các ô đã chọn
          const rowKeys = Object.keys(rowDataMap)
            .map(Number)
            .sort((a, b) => a - b);

          rowKeys.forEach((rowKey) => {
            const row = rowDataMap[rowKey];
            const rowValues: string[] = [];

            // Đảm bảo sử dụng đúng thứ tự cột theo bảng hiện tại
            columnOrder.forEach((colField) => {
              if (
                sortedCells.some((cellId) => cellId === `${rowKey}-${colField}`)
              ) {
                rowValues.push(row[colField] || "");
              }
            });

            if (rowValues.length > 0) {
              clipboardData.push(rowValues.join("\t")); // Kết hợp các ô trong hàng bằng tab
            }
          });

          // Ghi dữ liệu vào clipboard
          if (clipboardData.length > 0) {
            navigator.clipboard
              .writeText(clipboardData.join("\n"))
              .then(() => {})
              .catch((err) => console.error("Copy failed!", err));
          }
        } catch (error) {
          console.error("Error processing clipboard data:", error);
        }
      }
    },
    [selectedCells, gridRef]
  );

  // Copy selected cells to clipboard manually
  const copyToClipboard = useCallback(() => {
    const fakeEvent = new KeyboardEvent("keydown", {
      key: "c",
      ctrlKey: true,
    });
    handleKeyDown(fakeEvent);
  }, [handleKeyDown]);

  // Register keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    handleKeyDown,
    copyToClipboard,
  };
};
