import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import "./index.scss";
import "@/components/styles/CustomSelect.scss";

const { RangePicker } = DatePicker;

type MyRangePickerProps = Pick<
  RangePickerProps,
  | "value"
  | "onChange"
  | "placeholder"
  | "disabled"
  | "style"
  | "format"
  | "showTime"
  | "className"
  | "defaultValue"
> & {
  label?: string | [string, string];
};

type RangeValue = RangePickerProps["value"];

const hasAnyRangeValue = (dates: RangeValue): boolean => {
  if (!dates) return false;
  const [start, end] = dates;
  return Boolean(start) || Boolean(end);
};

const CRangePicker: React.FC<MyRangePickerProps> = ({
  value,
  onChange,
  className,
  placeholder,
  disabled,
  style,
  format = "YYYY-MM-DD HH:mm:ss",
  showTime = { format: "HH:mm:ss" },
  defaultValue,
  label,
}) => {
  const [isLabelFloating, setIsLabelFloating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    const controlledHas = hasAnyRangeValue(value ?? null);
    const defaultHas = hasAnyRangeValue(defaultValue ?? null);
    setHasValue(controlledHas || defaultHas);
  }, [value, defaultValue]);

  useEffect(() => {
    setIsLabelFloating(Boolean(hasValue || isFocused || disabled));
  }, [hasValue, isFocused, disabled]);

  const isArrayLabel = Array.isArray(label);

  const handleChange: RangePickerProps["onChange"] = (dates, dateStrings) => {
    setHasValue(hasAnyRangeValue(dates));
    onChange?.(dates, dateStrings);
  };

  return (
    <div
      className={`custom-select-container ${isLabelFloating ? "focused" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {!isArrayLabel && label && (
        <label className="floating-label">{label}</label>
      )}
      <div className={`range-floating-wrapper ${className ?? ""}`}>
        <RangePicker
          defaultValue={defaultValue}
          className={!isArrayLabel ? className : ""}
          value={value}
          onChange={handleChange}
          placeholder={placeholder as [string, string]}
          disabled={disabled}
          style={{ height: "36px", width: "100%", ...style }}
          format={format}
          showTime={showTime}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isArrayLabel && (
          <>
            <label className={`dual-floating-label left`}>{label[0]}</label>
            <label className={`dual-floating-label right`}>{label[1]}</label>
          </>
        )}
      </div>
    </div>
  );
};

export default CRangePicker;
