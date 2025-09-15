// DatepickerCellEditor.ts
// import { ICellEditorComp } from "ag-grid-community";
import { ICellEditorComp } from "@ag-grid-community/core";
import "./style.scss";
export class DatepickerCellEditor implements ICellEditorComp {
  private eInput: HTMLInputElement;

  constructor() {
    this.eInput = document.createElement("input");
    this.eInput.type = "datetime-local"; // Sử dụng datetime-local cho giờ, phút, giây
    this.eInput.value = "2024-10-28T08:13:19.436Z";
    this.eInput.style.width = "100%";
    this.eInput.style.height = "100%";
    this.eInput.style.padding = "12px";
  }

  // Hàm khởi tạo
  // init(params: { value: string }): void {
  //   let value = params.value || "";

  //   // Kiểm tra và chuyển đổi giá trị sang định dạng ISO nếu cần
  //   if (value && !this.isValidISO(value)) {
  //     const date = new Date(value);
  //     if (!isNaN(date.getTime())) {
  //       value = date.toISOString(); // Giữ nguyên ISO đầy đủ, bao gồm "Z"
  //     } else {
  //       value = ""; // Trả về ngày hiện tại nếu giá trị không hợp lệ
  //     }
  //   }

  //   if (value && typeof value === "string") {
  //     const date = new Date(value);
  //     const tzOffset = date.getTimezoneOffset() * 60000;
  //     const localDate = new Date(date.getTime() - tzOffset);
  //     this.eInput.value = localDate.toISOString().slice(0, 19);
  //   } else if (!isNaN(Date.parse(value))) {
  //     const date = new Date(value);
  //     const tzOffset = date.getTimezoneOffset() * 60000;
  //     const localDate = new Date(date.getTime() - tzOffset);
  //     this.eInput.value = localDate.toISOString().slice(0, 19);
  //   } else {
  //     this.eInput.value = "";
  //   }
  // }
  init(params: { value: string }): void {
    const value = params.value || "";

    let date: Date;
    if (value && !this.isValidISO(value)) {
      date = new Date(value);
    } else {
      date = new Date(value);
    }

    if (!isNaN(date.getTime())) {
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      // ✅ datetime-local chỉ nhận định dạng: "YYYY-MM-DDTHH:mm:ss"
      this.eInput.value = local.toISOString().slice(0, 19);
    } else {
      this.eInput.value = "";
    }
  }

  // Kiểm tra xem giá trị có phải là ISO 8601 hay không
  private isValidISO(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // Trả về giao diện của cell editor (input)
  getGui(): HTMLInputElement {
    return this.eInput;
  }

  //   // Được gọi khi editor đã được đính kèm vào DOM
  //   afterGuiAttached(): void {
  //     this.eInput.focus();
  //   }

  // Lấy giá trị từ input và trả về dưới dạng ISO 8601
  // Trả về giá trị sau khi chỉnh sửa
  // getValue(): string {
  //   const value = this.eInput.value;
  //   // Nếu giá trị không hợp lệ, trả về ngày hiện tại
  //   if (!value) {
  //     return ""; // Trả về ngày hiện tại nếu không có giá trị
  //   }
  //   // return value; // Trả về giá trị hợp lệ (ISO 8601)
  //   const date = new Date(value);
  //   return date.toISOString();
  // }
  getValue(): string {
    const value = this.eInput.value;
    if (!value) return "";

    // ✅ Phải thêm lại timezone vì input type datetime-local không chứa timezone
    const date = new Date(value); // value là local time
    return date.toISOString(); // chuẩn ISO 8601
  }

  // Hàm xác nhận khi người dùng rời khỏi cell editor
  // afterGuiAttached?(): void {
  //   this.eInput.focus();
  // }
  destroy(): void {
    // Dọn dẹp nếu cần
  }

  isPopup(): boolean {
    return true; // Trả về true vì đây là một popup (datepicker)
  }
}
