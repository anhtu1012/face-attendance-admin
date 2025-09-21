import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface ToolButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      type="text"
      size="small"
      icon={<EditOutlined />}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        background: "transparent",
        color: "#0078d7",
        padding: "4px",
      }}
    />
  );
};

export default ToolButton;
