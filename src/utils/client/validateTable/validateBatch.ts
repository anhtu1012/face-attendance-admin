/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateField } from "./validateField ";
import { store } from "@/lib/store";
import { clearErrors } from "@/lib/store/slices/validationErrorsSlice";

/**
 * Xác thực nhiều dòng dữ liệu cùng một lúc
 * @param rows Danh sách các dòng cần xác thực
 * @param requiredFields Danh sách các trường bắt buộc
 * @param dangerousFields Danh sách các trường bổ sung cho hàng nguy hiểm (optional)
 * @param isDangerous Boolean xác định có phải hàng nguy hiểm không
 * @param setRowData Hàm để cập nhật rowData với trạng thái lỗi
 * @param gridRef Tham chiếu đến grid để cuộn đến dòng lỗi đầu tiên
 * @param allRows Tất cả các dòng hiển thị
 * @returns {boolean} Kết quả xác thực (true nếu tất cả hợp lệ)
 */
export const validateBatchRows = (
  rows: any[],
  requiredFields: Array<{ field: keyof any; label: string }>,
  dangerousFields?: Array<{ field: keyof any; label: string }>,
  isDangerous?: boolean,
  setRowData?: (updateFn: (prevRows: any[]) => any[]) => void,
  gridRef?: any,
  allRows?: any[]
): boolean => {
  // Xóa tất cả lỗi trước khi bắt đầu
  store.dispatch(clearErrors());

  // Biến để theo dõi trạng thái hợp lệ của tất cả dòng và dòng không hợp lệ
  let allValid = true;
  const invalidRows: any[] = [];

  // Kiểm tra từng dòng
  rows.forEach((row) => {
    // Biến để theo dõi trạng thái hợp lệ của dòng hiện tại
    let rowValid = true;

    // Kiểm tra các trường bắt buộc
    requiredFields.forEach(({ field, label }) => {
      // Nếu trường không hợp lệ, đánh dấu dòng không hợp lệ
      if (!validateField(label, row[field], true, field as any)) {
        rowValid = false;
      }
    });

    // Kiểm tra các trường bổ sung cho hàng nguy hiểm nếu cần
    if (isDangerous && dangerousFields) {
      dangerousFields.forEach(({ field, label }) => {
        if (!validateField(label, row[field], true, field as any)) {
          rowValid = false;
        }
      });
    }

    // Nếu có một dòng không hợp lệ, đánh dấu tất cả không hợp lệ và thêm vào danh sách
    if (!rowValid) {
      allValid = false;
      invalidRows.push(row);
    }
  });

  // Đánh dấu các dòng không hợp lệ trong rowData
  if (!allValid && setRowData && allRows) {
    setRowData((prevRowData) =>
      prevRowData.map((row) =>
        invalidRows.some((invalidRow) => invalidRow.cntrNo === row.cntrNo)
          ? { ...row, isError: true, isSaved: false }
          : row
      )
    );

    // Cuộn đến dòng lỗi đầu tiên để người dùng dễ thấy
    if (gridRef?.current && invalidRows.length > 0) {
      const firstInvalidRowIndex = allRows.findIndex(
        (row) => row.cntrNo === invalidRows[0].cntrNo
      );
      if (firstInvalidRowIndex >= 0) {
        gridRef.current.api.ensureIndexVisible(firstInvalidRowIndex, "middle");
      }
    }
  }

  return allValid;
};
