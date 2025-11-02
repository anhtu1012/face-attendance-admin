import type { ButtonProps } from "antd";
import { Button } from "antd";
import React, { useState } from "react";
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
  // Track hover state for origin-based inline styles
  const [isHover, setIsHover] = useState(false);

  // Nếu có origin props, sử dụng style cũ (inline)
  if (origin) {
    const hoverStyle = isHover
      ? {
          background: origin.hoverBgColor || origin.bgcolor || "#5DC9EF",
          color: origin.hoverColor || origin.color || "white",
        }
      : {};
    return (
      <Button
        className={className}
        size={size}
        disabled={disabled}
        type={type}
        onClick={onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        icon={icon}
        style={{
          color: origin.color || "white",
          background: origin.bgcolor || "#5DC9EF",
          border: origin.border || "none",
          borderRadius: "8px",
          height: "36px",
          fontWeight: "bold",
          ...hoverStyle,
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
