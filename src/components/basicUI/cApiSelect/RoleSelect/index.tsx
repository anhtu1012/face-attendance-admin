/* eslint-disable @typescript-eslint/no-explicit-any */
import "@/components/styles/CustomSelect.scss";
import SelectServices from "@/services/select/select.service";
import { Select, SelectProps } from "antd";
import React, { useEffect, useState } from "react";

type MySelectProps = Pick<
  SelectProps,
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
> & {
  label?: string;
  onSelectRole?: (selectedData: any) => void;
};

const CRoleSelect: React.FC<MySelectProps> = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  style,
  showSearch = true,
  className,
  mode,
  label,
  onSelectRole,
}) => {
  const [role, setRole] = useState<any[]>([]);
  const [isLabelFloating, setIsLabelFloating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    setIsLabelFloating(!!value || value === null);
  }, [value]);

  const fetchRole = async () => {
    try {
      const res = await SelectServices.getSelectRole();
      const allData = res.data;
      const formattedData: any[] = allData.map(
        (role: { label: string; value: string }): any => ({
          label: role.label || "",
          value: role.value || "",
        })
      );
      setRole(formattedData);
    } catch (error) {
      console.error("Error fetching role dropdown:", error);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  return (
    <div
      className={`custom-select-container ${
        isLabelFloating || defaultValue || isFocused ? "focused" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      {label && <label className="floating-label">{label}</label>}
      <Select
        allowClear
        defaultValue={defaultValue}
        className={`custom-select ${className || ""}`}
        value={value === null ? "" : value}
        onChange={(val, option) => {
          onChange?.(val, option);
          setIsLabelFloating(!!val || val === null);

          if (onSelectRole) {
            if (val === undefined || val === null) {
              // When cleared, pass empty string or default value
              onSelectRole("");
            } else {
              // When selected, pass the roleCode (value)
              onSelectRole(val);
            }
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ height: 36, ...style }}
        showSearch={showSearch}
        mode={mode}
        optionFilterProp="label"
        options={[
          ...role.map((roleData, index) => ({
            key: `${roleData.value}-${index}`,
            value: roleData.value,
            label: roleData.label,
          })),
        ]}
      />
    </div>
  );
};

export default CRoleSelect;
