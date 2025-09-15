import React, { useState, useEffect, useRef } from "react";
import { AutoComplete } from "antd";
import "@/components/styles/CustomSelect.scss";

interface AutoCompleteWithLabelProps {
  label: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
}

const AutoCompleteWithLabel: React.FC<AutoCompleteWithLabelProps> = ({
  label,
  defaultValue,
  value,
  placeholder,
  disabled,
  style,
  className,
  options,
  onChange,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isLabelFloating, setIsLabelFloating] = useState<boolean>(!!value);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cập nhật state khi nhận giá trị mới từ props
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Hàm xử lý debounce input
  const handleInputChange = (val: string) => {
    setInputValue(val);
    setIsLabelFloating(!!val);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange?.(val); // Gọi onChange sau khi dừng nhập 500ms
    }, 500);
  };

  useEffect(() => {
    setIsLabelFloating(!!inputValue);
  }, [inputValue]);

  const hasOptions = options && options.length > 0;

  return (
    <div
      className={`custom-select-container ${
        isLabelFloating || defaultValue || isFocused ? "focused" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      {label && <label className="floating-label">{label}</label>}
      <div
        className={`auto-complete-wrapper ${hasOptions ? "has-options" : ""}`}
      >
        <AutoComplete
          allowClear
          className={`custom-auto-complete ${className || ""}`}
          value={inputValue}
          defaultValue={defaultValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          onSelect={(val) => {
            onSelect?.(val);
          }}
          disabled={disabled}
          style={{ height: 36, ...style }}
          placeholder={placeholder}
          optionFilterProp="label"
          options={options}
          filterOption={(inputValue, option) => {
            return option?.value
              ? option.value.toLowerCase().includes(inputValue.toLowerCase())
              : false;
          }}
        />
        {hasOptions && <span className="dropdown-arrow"></span>}
      </div>
    </div>
  );
};

export default AutoCompleteWithLabel;
