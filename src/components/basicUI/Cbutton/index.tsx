import type { ButtonProps } from "antd";
import { Button } from "antd";
import React from "react";

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
  return (
    <Button
      className={className}
      size={size}
      disabled={disabled}
      type={type}
      onClick={onClick}
      icon={icon}
      style={{
        color: origin?.color || "white",
        backgroundColor: origin?.bgcolor || "#5DC9EF",
        border: origin?.border || "none",
        borderRadius: "4px",
        height: "36px",
        fontWeight: "bold",
        ...style,
        transition: "background-color 0.3s, color 0.3s", // Thêm hiệu ứng chuyển đổi
      }}
    >
      <span
        style={{
          color: "inherit", // Kế thừa màu chữ từ cha
          display: "inline-block",
          transition: "color 0.3s", // Thêm hiệu ứng chuyển đổi màu chữ
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLSpanElement).style.color =
            origin?.hoverColor || "white"; // Màu chữ khi hover
          (e.target as HTMLSpanElement).parentElement!.style.backgroundColor =
            origin?.hoverBgColor || "#A6E2F7"; // Màu nền khi hover
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLSpanElement).style.color = origin?.color || "white"; // Màu chữ trở về mặc định
          (e.target as HTMLSpanElement).parentElement!.style.backgroundColor =
            origin?.bgcolor || "#5DC9EF"; // Màu nền trở về mặc định
        }}
      >
        {children}
      </span>
    </Button>
  );
};

export default Cbutton;
