import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Space, Tooltip } from "antd";
import {
  DownOutlined,
  UpOutlined,
  FilterOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./styles.scss";

interface FilterSectionProps {
  children: React.ReactNode;
  title?: string;
  onReset?: () => void;
  onSearch?: () => void;
  extra?: React.ReactNode;
  defaultCollapsed?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  children,
  title = "Bộ lọc",
  onReset,
  onSearch,
  extra,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultCollapsed ? 0 : undefined
  );

  useEffect(() => {
    if (!collapsed && contentRef.current) {
      // Get the actual height of the content when expanded
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      // Set to 0 when collapsed
      setContentHeight(0);
    }
  }, [collapsed, children]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Card
      className="filter-section"
      title={
        <div className="filter-section-header">
          <Space>
            <FilterOutlined />
            <span>{title}</span>
          </Space>
          <Space>
            {onReset && (
              <Tooltip title="Xóa bộ lọc">
                <Button icon={<ClearOutlined />} onClick={onReset} size="small">
                  Xóa lọc
                </Button>
              </Tooltip>
            )}
            {onSearch && (
              <Tooltip title="Tìm kiếm">
                <Button
                  type="primary"
                  icon={<SearchOutlined style={{ color: "white" }} />}
                  onClick={onSearch}
                  size="small"
                >
                  Tìm kiếm
                </Button>
              </Tooltip>
            )}
            {extra}
          </Space>
        </div>
      }
      extra={
        <Button
          type="text"
          icon={collapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={toggleCollapse}
          size="small"
        />
      }
    >
      <div
        className={`filter-section-content ${
          collapsed ? "collapsed" : "expanded"
        }`}
        ref={contentRef}
        style={{
          height:
            contentHeight === undefined ? "auto" : `${contentHeight - 5}px`,
        }}
      >
        <div className="filter-content-inner">{children}</div>
      </div>
    </Card>
  );
};

export default FilterSection;
