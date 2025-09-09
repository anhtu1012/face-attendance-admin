import React from "react";
import { Collapse, CollapseProps } from "antd";
import { FilterOutlined } from "@ant-design/icons";

interface FiltersPanelProps {
  filterContent: React.ReactNode;
  title?: string;
  defaultActiveKey?: string[];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filterContent,
  title = "Bộ lọc",
  defaultActiveKey = ["1"],
}) => {
  // Define items for Collapse component
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <span className="filter-label">
          <FilterOutlined /> {title}
        </span>
      ),
      children: filterContent,
    },
  ];

  return (
    <div className="unified-filters-panel">
      <Collapse defaultActiveKey={defaultActiveKey} items={items} />
    </div>
  );
};

export default FiltersPanel;
