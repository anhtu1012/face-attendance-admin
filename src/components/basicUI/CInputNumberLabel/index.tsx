import React, { useState, useEffect } from "react";
import { InputNumber, InputNumberProps } from "antd";
import "./index.scss";

interface InputWithLabelProps extends InputNumberProps {
  label: string;
  defaultValue?: string | number;
  value?: string | number;
  disabled?: boolean;
}

const CInputNumberLabel: React.FC<InputWithLabelProps> = ({
  label,
  defaultValue,
  value,
  onChange,
  disabled,
  ...inputNumberProps
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    value || defaultValue
  );

  useEffect(() => {
    // Cập nhật inputValue khi value thay đổi
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value, defaultValue]);

  const handleInputChange = (value: string | number | null) => {
    setInputValue(value || undefined);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="input-with-label">
      <div className="input-wrapper">
        <InputNumber
          {...inputNumberProps}
          value={inputValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          className="input-field"
        />
        <div
          className={`label
    ${
      hasFocus ||
      (inputValue !== undefined && inputValue !== "") ||
      (defaultValue !== undefined && defaultValue !== "") ||
      disabled
        ? "active"
        : ""
    }
    ${disabled ? "disabled" : ""}`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default CInputNumberLabel;
