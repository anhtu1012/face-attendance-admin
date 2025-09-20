// DatepickerCellEditor.ts
// import { ICellEditorComp } from "ag-grid-community";
import { ICellEditorComp } from "@ag-grid-community/core";
import "./style.scss";
export class DatepickerCellEditor implements ICellEditorComp {
  private eInput: HTMLInputElement;

  constructor() {
    this.eInput = document.createElement("input");
    this.eInput.type = "datetime-local"; // Sử dụng datetime-local cho giờ, phút, giây

    // Set giá trị mặc định là ngày giờ hiện tại
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    this.eInput.value = localDate.toISOString().slice(0, 19);

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

    if (value) {
      // Nếu có giá trị, xử lý như bình thường
      let date: Date;
      if (value && !this.isValidISO(value)) {
        date = new Date(value);
      } else {
        date = new Date(value);
      }

      if (!isNaN(date.getTime())) {
        const local = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        // ✅ datetime-local chỉ nhận định dạng: "YYYY-MM-DDTHH:mm:ss"
        this.eInput.value = local.toISOString().slice(0, 19);
      } else {
        // Nếu giá trị không hợp lệ, sử dụng ngày giờ hiện tại
        this.setCurrentDateTime();
      }
    } else {
      // Nếu không có giá trị, sử dụng ngày giờ hiện tại
      this.setCurrentDateTime();
    }
  }

  // Kiểm tra xem giá trị có phải là ISO 8601 hay không
  private isValidISO(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // Set giá trị mặc định là ngày giờ hiện tại
  private setCurrentDateTime(): void {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    this.eInput.value = localDate.toISOString().slice(0, 19);
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
    if (!value) {
      // Nếu không có giá trị, trả về ngày giờ hiện tại
      return new Date().toISOString();
    }

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

// TimeCellEditor - Chỉ chọn giờ phút
export class TimeCellEditor implements ICellEditorComp {
  private eInput: HTMLInputElement;

  constructor() {
    this.eInput = document.createElement("input");
    this.eInput.type = "time"; // Chỉ chọn giờ phút

    // Set giá trị mặc định là giờ hiện tại
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.eInput.value = `${hours}:${minutes}`;

    this.eInput.style.width = "100%";
    this.eInput.style.height = "100%";
    this.eInput.style.padding = "12px";
  }

  init(params: { value: string }): void {
    const value = params.value || "";

    if (value) {
      // Nếu có giá trị, parse và set
      const timeValue = this.parseTimeValue(value);
      if (timeValue) {
        this.eInput.value = timeValue;
      } else {
        // Nếu giá trị không hợp lệ, sử dụng giờ hiện tại
        this.setCurrentTime();
      }
    } else {
      // Nếu không có giá trị, sử dụng giờ hiện tại
      this.setCurrentTime();
    }
  }

  // Parse giá trị thời gian từ nhiều format khác nhau
  private parseTimeValue(value: string): string | null {
    // Nếu đã là format HH:mm
    if (/^\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    // Nếu là ISO datetime, extract giờ phút
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    return null;
  }

  // Set giá trị mặc định là giờ hiện tại
  private setCurrentTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.eInput.value = `${hours}:${minutes}`;
  }

  // Trả về giao diện của cell editor (input)
  getGui(): HTMLInputElement {
    return this.eInput;
  }

  // Trả về giá trị dưới dạng HH:mm
  getValue(): string {
    const value = this.eInput.value;
    if (!value) {
      // Nếu không có giá trị, trả về giờ hiện tại
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    return value; // Đã là format HH:mm
  }

  destroy(): void {
    // Dọn dẹp nếu cần
  }

  isPopup(): boolean {
    return true; // Trả về true vì đây là một popup (time picker)
  }
}
