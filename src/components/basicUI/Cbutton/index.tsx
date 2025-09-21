import type { ButtonProps } from "antd";
import { Button } from "antd";
import React, { useState } from "react";

interface CustomButtonProps extends ButtonProps {
  origin?: {
    color?: string; // Màu chữ mặc định
    bgcolor?: string; // Màu nền mặc định
    hoverBgColor?: string; // Màu nền khi hover
    hoverColor?: string; // Màu chữ khi hover
    border?: string;
  };
}

const Cbutton: React.FC<CustomButtonProps> = ({
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline-block" }}
    >
      <Button
        className={className}
        size={size}
        disabled={disabled}
        type={type}
        onClick={onClick}
        icon={icon}
        style={{
          color: hovered
            ? origin?.hoverColor || "white"
            : origin?.color || "white",
          backgroundColor: hovered
            ? origin?.hoverBgColor || "#A6E2F7"
            : origin?.bgcolor || "#5DC9EF",
          border: origin?.border || "none",
          borderRadius: "4px",
          height: "36px",
          fontWeight: "bold",
          ...style,
          transition: "background-color 0.3s, color 0.3s", // Thêm hiệu ứng chuyển đổi
        }}
      >
        {children}
      </Button>
    </div>
  );
};

export default Cbutton;
