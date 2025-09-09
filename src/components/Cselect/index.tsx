import React, { useEffect, useState } from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import "@/components/styles/CustomSelect.scss";

type MySelectProps = Pick<
  SelectProps,
  | "options"
  | "value"
  | "onChange"
  | "placeholder"
  | "disabled"
  | "style"
  | "showSearch"
  | "mode"
  | "className"
  | "defaultValue"
  | "allowClear"
  | "maxTagCount"
  | "maxTagPlaceholder"
> & {
  label?: string;
};

const Cselect: React.FC<MySelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  allowClear,
  placeholder,
  disabled,
  style,
  showSearch,
  className,
  mode,
  label,
  maxTagCount,
  maxTagPlaceholder,
}) => {
  const [isLabelFloating, setIsLabelFloating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsLabelFloating(!!value || value === null);
  }, [value]);

  return (
    <div
      className={`custom-select-container ${
        isLabelFloating || defaultValue || isFocused ? "focused" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      {label && <label className="floating-label">{label}</label>}
      <Select
        allowClear={allowClear}
        defaultValue={defaultValue}
        className={`custom-select ${className || ""}`}
        options={options}
        value={value}
        onChange={(val, option) => {
          onChange?.(val, option);
          setIsLabelFloating(!!val || val === null);
        }}
        placeholder={placeholder}
        disabled={disabled}
        style={{ height: "36px", ...style }}
        showSearch={showSearch}
        mode={mode}
        optionFilterProp="label"
        maxTagCount={maxTagCount}
        maxTagPlaceholder={maxTagPlaceholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default Cselect;
