import React, { useState, useEffect, useRef } from "react";
import { Input, InputProps } from "antd";
import "./index.scss";

interface InputWithLabelProps extends InputProps {
  label: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  type?: "text" | "number";
  debounceDelay?: number; // Add debounce delay prop
}

const CInputLabel: React.FC<InputWithLabelProps> = ({
  label,
  defaultValue,
  value,
  onChange,
  disabled,
  type = "text",
  debounceDelay = 300, // Default debounce delay of 300ms
  ...inputProps
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>(
    value || defaultValue
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cập nhật inputValue khi value thay đổi
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [defaultValue, value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (type === "number") {
      value = value.replace(/[^0-9]/g, "");
    }
    setInputValue(value);

    // Always update local state immediately
    if (onChange) {
      // Clear any existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timeout for debounced onChange
      debounceTimerRef.current = setTimeout(() => {
        onChange({
          ...e,
          target: { ...e.target, value },
        });
      }, debounceDelay);
    }
  };

  return (
    <div className="input-with-label">
      <div className="input-wrapper">
        <Input
          {...inputProps}
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

export default CInputLabel;
