/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Input, Tooltip } from "antd";
import React, { useState, useRef, useCallback } from "react";
import { TbFilterSearch, TbX } from "react-icons/tb";
import "./index.scss";

// Export the interface so it can be imported by other components
export interface InputSearchProps {
  id?: string | "filter-text-box";
  placeholder?: string;
  // onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  idSearch?: string | "filter-text-box";
  onSearch?: (value: string) => void;
  onPressEnter?: () => void; // Thêm thuộc tính onPressEnter

  gridRef?: React.RefObject<any>;

  // New filter-related props
  enableFilterButton?: boolean;
  onFilterClick?: () => void;
  isFiltered?: boolean;
  filteredCount?: number;
  onResetFilter?: () => void;

  // New tooltip text props
  filterTooltip?: string;
  resetTooltip?: string;
  searchTooltip?: string;

  // New props for filter information
  filterSummary?: string;
  filterCount?: number;
  onInputValueChange?: (value: string) => void;
}

const InputSearch: React.FC<InputSearchProps> = ({
  id,
  placeholder = "Search...",
  onSearch,
  onPressEnter,
  idSearch,
  gridRef,
  // Filter props with defaults
  enableFilterButton = true,
  onFilterClick,
  isFiltered = false,
  onResetFilter,
  filterTooltip = "Mở bộ lọc",
  resetTooltip = "Xóa bộ lọc",
  searchTooltip = "Tìm kiếm",
  filterCount = 0,
  onInputValueChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onInputValueChange) {
      if (e.target.value === "") {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onInputValueChange(""); // Gọi ngay nếu rỗng
      } else {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onInputValueChange(e.target.value);
        }, 300); // 300ms debounce
      }
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleFilterClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onFilterClick) {
      onFilterClick();
    }
  };

  const handleResetFilter = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (onResetFilter) {
      onResetFilter();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch(inputValue); // Gọi hàm onSearch khi nhấn Enter
      if (onPressEnter) onPressEnter(); // Gọi hàm onPressEnter khi nhấn Enter
    }
  };
  const onFilterTextBoxChanged = useCallback(() => {
    if (gridRef?.current?.api) {
      const inputElement = document.getElementById(
        `${idSearch}`
      ) as HTMLInputElement;
      if (inputElement) {
        gridRef.current.api.setGridOption(
          "quickFilterText",
          inputElement.value
        );
      }
    }
  }, [idSearch, gridRef]);

  // Choose appropriate icon based on whether filter mode is enabled
  const iconComponent = enableFilterButton ? (
    <div className="filter-icon-container">
      {isFiltered ? (
        // Show filter icon with reset overlay when filtered
        <div className="filter-with-reset">
          <Tooltip title={filterTooltip} placement="top">
            <Badge count={filterCount > 0 ? filterCount : 0} size="small">
              <TbFilterSearch
                size={16}
                className="search__icon"
                onClick={handleFilterClick}
              />
            </Badge>
          </Tooltip>
          {onResetFilter && (
            <div className="reset-button-overlay">
              <Tooltip title={resetTooltip} placement="top">
                <TbX
                  size={12}
                  className="reset-filter-icon"
                  onClick={handleResetFilter}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ) : (
        // Regular filter icon when not filtered
        <Tooltip title={filterTooltip} placement="top">
          <TbFilterSearch
            size={16}
            className="search__icon"
            onClick={handleFilterClick}
          />
        </Tooltip>
      )}
    </div>
  ) : (
    <Tooltip title={searchTooltip} placement="top">
      <TbFilterSearch
        size={20}
        className="search__icon"
        onClick={handleSearch}
      />
    </Tooltip>
  );

  return (
    <div className="input-search-container">
      <Input
        id={id}
        onInput={onFilterTextBoxChanged}
        type="text"
        className="search"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        suffix={iconComponent}
      />
    </div>
  );
};

export default InputSearch;
