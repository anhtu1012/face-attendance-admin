import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import "@/components/styles/CustomSelect.scss";
import dayjs from "dayjs";

type MyDatePickerProps = Pick<
  DatePickerProps,
  | "value"
  | "onChange"
  | "placeholder"
  | "disabled"
  | "style"
  | "format"
  | "showTime"
  | "className"
  | "picker"
  | "defaultValue"
> & {
  label?: string; // Label hiển thị
};

const CdatePicker: React.FC<MyDatePickerProps> = ({
  value,
  onChange,
  picker,
  className,
  disabled,
  style,
  format,
  showTime,
  defaultValue,
  label,
}) => {
  const [isLabelFloating, setIsLabelFloating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    // Sử dụng Boolean để đảm bảo giá trị là boolean
    setIsLabelFloating(
      Boolean(value || value === null || disabled || isFocused)
    );
  }, [value, disabled, isFocused]);

  return (
    <div
      className={`custom-select-container ${isLabelFloating ? "focused" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {label && <label className="floating-label">{label}</label>}
      <DatePicker
        defaultValue={defaultValue ? dayjs(defaultValue) : null}
        picker={picker}
        className={`custom-select ${className || ""}`}
        value={value ? dayjs(value) : null}
        onChange={(val, option) => {
          onChange?.(val, option);
          setIsLabelFloating(!!val || val === null || disabled);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={""}
        disabled={disabled}
        style={style}
        format={format}
        showTime={showTime}
      />
    </div>
  );
};

export default CdatePicker;
