import type { ButtonProps } from "antd";
import { Button } from "antd";
import React from "react";
import "./Cbutton.scss";

interface CustomButtonProps extends ButtonProps {
  customVariant?: "default" | "primary"; // Đổi tên để tránh conflict với ButtonProps
  origin?: {
    color?: string; // Màu chữ mặc định
    bgcolor?: string; // Màu nền mặc định
    hoverBgColor?: string; // Màu nền khi hover
    hoverColor?: string; // Màu chữ khi hover
    border?: string;
  };
}

const Cbutton: React.FC<CustomButtonProps> = ({
  customVariant = "default",
  origin,
  onClick,
  style,
  size,
  children,
  type,
  icon,
  className,
  disabled,
}) => {
  // Nếu có origin props, sử dụng style cũ (inline)
  if (origin) {
    return (
      <Button
        className={className}
        size={size}
        disabled={disabled}
        type={type}
        onClick={onClick}
        icon={icon}
        style={{
          color: origin.color || "white",
          backgroundColor: origin.bgcolor || "#5DC9EF",
          border: origin.border || "none",
          borderRadius: "4px",
          height: "36px",
          fontWeight: "bold",
          ...style,
        }}
      >
        {children}
      </Button>
    );
  }

  // Sử dụng SCSS styles mới (mặc định giống btn-secondary)
  const wrapperClass = `cbutton-wrapper ${
    customVariant === "primary" ? "primary" : ""
  }`;
  const buttonClass = `cbutton ${className || ""}`;

  return (
    <div className={wrapperClass}>
      <Button
        className={buttonClass}
        size={size}
        disabled={disabled}
        type={type}
        onClick={onClick}
        icon={icon}
        style={style}
      >
        {children}
      </Button>
    </div>
  );
};

export default Cbutton;
