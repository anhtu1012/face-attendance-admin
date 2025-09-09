/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/lib/store";
import {
  ColumnPreference,
  initTableColumns,
  selectColumnPreferences,
  updateColumnPreferences,
} from "@/lib/store/slices/columnPreferencesSlice";
import type {
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import type { TableColumnsType, TableProps } from "antd";
import { Checkbox, Col, Dropdown, Row, Space, Table, Tooltip } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslations } from "next-intl";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BiSolidKeyboard } from "react-icons/bi";
import { BsFiletypeCsv, BsFiletypeXlsx } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { TbFreezeColumn } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { EditableCell, EditableRow, EditableType } from "./EditableComponents";
import "./styles.scss";
import { TableRowSelection } from "antd/es/table/interface";
import { exportToCSV, exportToExcel } from "@/utils/client/exportUtils";

// Define sorting state interface
interface SortState {
  field: string;
  order: "ascend" | "descend" | undefined;
}

// Define drag index state interface
interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: "left" | "right";
}

// Create context for drag state
const DragIndexContext = createContext<DragIndexState>({
  active: -1,
  over: undefined,
});

// Define props for header and body cells
interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface BodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

// Helper function to generate drag styles
const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  let style: React.CSSProperties = {};

  if (active && active === id) {
    style = { backgroundColor: "rgba(128, 128, 128, 0.2)", opacity: 0.5 };
  } else if (over && id === over && active !== over) {
    style =
      direction === "right"
        ? { borderRight: "2px dashed #1890ff" }
        : { borderLeft: "2px dashed #1890ff" };
  }
  return style;
};

// TableBodyCell component with drag styling
const TableBodyCell: React.FC<BodyCellProps> = (props) => {
  const dragState = useContext<DragIndexState>(DragIndexContext);
  return (
    <td
      {...props}
      style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }}
    />
  );
};

// TableHeaderCell component with drag functionality
const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: props.id,
  });
  const style: React.CSSProperties = {
    ...props.style,
    cursor: "move",
    ...(isDragging
      ? { position: "relative", zIndex: 9999, userSelect: "none" }
      : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return (
    <th
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

// Define action props interface
interface ActionProps<T> {
  render: (record: T) => React.ReactNode;
}

interface MyTableProps<T> extends TableProps<T> {
  columns: TableColumnsType<T>;
  dataSource: T[];
  className?: TableProps<T>["className"];
  rowClassName?: (record: T, index: number) => string;
  components?: TableProps<T>["components"];
  onRowDoubleClick?: (record: T) => void;
  rowKey?: string | ((record: T) => string);
  pageSize?: number;
  totalItems?: number;
  usePagination?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  showActions?: boolean;
  actionColumn?: ActionProps<T>;
  rowHeight?: number;
  darkMode?: boolean;
  enableDrag?: boolean;
  onColumnsChange?: (newColumns: TableColumnsType<T>) => void;
  stickyHeader?: boolean;
  enableSorting?: boolean;
  tableId?: string; // Optional custom tableId, will use pathname if not provided
  loading?: boolean; // Optional loading prop for table
  rowSelection?: TableProps<T>["rowSelection"]; // Add row selection prop
  showSelectionColumn?: boolean | "multi" | "single"; // Modified to support multi/single mode
  importComponent?: React.ReactNode; // New prop for custom import component
  editable?: boolean; // Add editable prop
  onSave?: (record: T) => void; // Add onSave callback prop
  expandable?: TableProps<T>["expandable"]; // Add expandable prop for tree tables
  tableHeight?: string;
  onBeforeExport?: () => Promise<T[]>; // Modified to return data
}

const Ctable = <T extends object>({
  columns,
  dataSource,
  rowClassName,
  className,
  onRow,
  pageSize = 14,
  components,
  rowKey,
  onRowDoubleClick,
  totalItems,
  usePagination = false,
  onPageChange,
  showActions = false,
  actionColumn,
  rowHeight = 28,
  darkMode,
  enableDrag = false,
  onColumnsChange,
  stickyHeader = true,
  enableSorting = false,
  tableId,
  loading = false,
  rowSelection,
  showSelectionColumn = false,
  importComponent,
  editable = false, // Initialize with default value
  onSave, // Add the save handler
  expandable, // Add this prop to the destructuring
  tableHeight = "calc(100vh - 250px)", // Default height if not provided
  onBeforeExport,
  ...restProps
}: MyTableProps<T>) => {
  const t = useTranslations("Ctable");
  const dispatch = useDispatch();

  // Add dropdownOpen state that was missing
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Add new state for import dropdown
  const [importDropdownOpen, setImportDropdownOpen] = useState(false);

  // Get current pathname to use as table ID
  const [routePath, setRoutePath] = useState<string>("");

  useEffect(() => {
    // Use tableId if provided, otherwise use pathname
    if (typeof window !== "undefined") {
      const path = tableId || window.location.pathname;
      setRoutePath(path);
    }
  }, [tableId]);

  // Get stored column preferences from Redux
  const storedColumnPreferences = useSelector((state: RootState) =>
    selectColumnPreferences(state, routePath)
  );

  // Initialize checkedList and tableColumns states
  const defaultCheckedList = columns
    .filter((item) => item.key !== undefined)
    .map((item) => item.key as React.Key);

  const [checkedList, setCheckedList] =
    useState<React.Key[]>(defaultCheckedList);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize);
  const [dragIndex, setDragIndex] = useState<DragIndexState>({
    active: -1,
    over: undefined,
  });
  const [tableColumns, setTableColumns] =
    useState<TableColumnsType<T>>(columns);
  const [sortState, setSortState] = useState<SortState | null>(null);

  // Initialize column preferences in Redux if they don't exist
  useEffect(() => {
    if (routePath) {
      if (!storedColumnPreferences) {
        // Convert columns to ColumnPreference format
        const initialPreferences: ColumnPreference[] = columns.map(
          (col, index) => ({
            key: col.key?.toString() || `column-${index}`,
            visible: true,
            order: index,
            width: (col as any).width,
          })
        );

        dispatch(
          initTableColumns({
            routePath,
            columns: initialPreferences,
          })
        );
      } else {
        // Apply stored preferences to current columns
        const updatedColumns = [...columns];

        // Sort columns based on stored order
        updatedColumns.sort((a, b) => {
          const aKey = a.key?.toString() || "";
          const bKey = b.key?.toString() || "";

          const aPref = storedColumnPreferences.find((p) => p.key === aKey);
          const bPref = storedColumnPreferences.find((p) => p.key === bKey);

          if (aPref && bPref) {
            return aPref.order - bPref.order;
          }
          return 0;
        });

        // Update visible columns based on stored preferences
        const visibleColumnKeys = storedColumnPreferences
          .filter((p) => p.visible)
          .map((p) => p.key);

        setCheckedList(visibleColumnKeys);
        setTableColumns(updatedColumns);
      }
    }
  }, [routePath, columns, storedColumnPreferences, dispatch]);

  // Sensors for drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  // Handle sorting change
  const handleSortChange = (sorter: any) => {
    if (enableSorting && sorter && sorter.field) {
      setSortState({
        field: sorter.field,
        order: sorter.order,
      });
    } else {
      setSortState(null);
    }
  };

  // Function to sort data
  const getSortedData = () => {
    if (!sortState || !sortState.field || !sortState.order) {
      return dataSource;
    }

    return [...dataSource].sort((a, b) => {
      const fieldA = a[sortState.field as keyof T];
      const fieldB = b[sortState.field as keyof T];

      // Handle different data types
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        if (sortState.order === "ascend") {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        if (sortState.order === "ascend") {
          return fieldA - fieldB;
        } else {
          return fieldB - fieldA;
        }
      }

      // Default comparison
      if (fieldA < fieldB) return sortState.order === "ascend" ? -1 : 1;
      if (fieldA > fieldB) return sortState.order === "ascend" ? 1 : -1;
      return 0;
    });
  };

  // Handle saving an edited record
  const handleSave = (row: T) => {
    if (onSave) {
      onSave(row);
    }
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? defaultCheckedList : []);
  };

  // Improved column change handler with storage
  const handleColumnChange = (checkedValues: any[]) => {
    setCheckedList(checkedValues as React.Key[]);

    if (routePath) {
      // Update column visibility in Redux
      const updatedPreferences =
        storedColumnPreferences?.map((col) => ({
          ...col,
          visible: checkedValues.includes(col.key),
        })) || [];

      dispatch(
        updateColumnPreferences({
          routePath,
          columns: updatedPreferences,
        })
      );
    }
  };

  // Updated drag end handler to save column order
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id && over) {
      const updatedColumns = [...tableColumns];
      const activeIndex = updatedColumns.findIndex((i) => i.key === active.id);
      const overIndex = updatedColumns.findIndex((i) => i.key === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newColumns = arrayMove(updatedColumns, activeIndex, overIndex);
        setTableColumns(newColumns);

        if (onColumnsChange) {
          onColumnsChange(newColumns);
        }

        // Save the new column order to Redux
        if (routePath && storedColumnPreferences) {
          // Create a deep copy of the stored preferences to avoid mutations
          const updatedPreferences = storedColumnPreferences.map((col) => ({
            ...col,
          }));

          // Create a map of column keys to their new positions
          const newOrderMap = new Map<string, number>();
          newColumns.forEach((col, index) => {
            const colKey = col.key?.toString() || "";
            newOrderMap.set(colKey, index);
          });

          // Update orders based on the map
          const newPreferences = updatedPreferences.map((pref) => {
            const newOrder = newOrderMap.get(pref.key);
            if (newOrder !== undefined) {
              return { ...pref, order: newOrder };
            }
            return pref;
          });

          // Dispatch update with the new preferences
          dispatch(
            updateColumnPreferences({
              routePath,
              columns: newPreferences,
            })
          );
        }
      }
    }
    setDragIndex({ active: -1, over: undefined });
  };

  // Drag over handler
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeIndex = tableColumns.findIndex((i) => i.key === active.id);
    const overIndex = tableColumns.findIndex((i) => i.key === over.id);

    setDragIndex({
      active: active.id,
      over: over.id,
      direction: overIndex > activeIndex ? "right" : "left",
    });
  };

  const allChecked = checkedList.length === defaultCheckedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < defaultCheckedList.length;

  // Fix: Better handling of columns without keys
  const newColumns = tableColumns.map((item: any, index) => {
    const columnDef = {
      ...item,
      key: item.key || `column-${index}`,
      hidden:
        item.key === undefined || !checkedList.includes(item.key as React.Key),
      onHeaderCell: () => ({ id: item.key?.toString() || `column-${index}` }),
      onCell: (record: T) => ({
        id: item.key?.toString() || `column-${index}`,
        ...(editable && item.editable
          ? {
              record,
              editable: true,
              typeEdit: item.typeEdit as EditableType,
              dataIndex: item.dataIndex,
              title: item.title,
              handleSave,
            }
          : {}),
      }),
      // Add sorter property to all columns only if sorting is enabled
      sorter: enableSorting,
    };
    return columnDef;
  });

  // Add STT column that is always fixed to the left, with correct numbering for pagination
  const sttColumn: TableColumnsType<T>[0] = {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 60,
    fixed: "left",
    render: (_, record: any, index) => {
      // Calculate the correct row number based on pagination
      const rowNumber = usePagination
        ? (currentPage - 1) * currentPageSize + index + 1
        : index + 1;

      // Check if the record has children to apply bold styling
      const hasChildren = record.children && record.children.length > 0;

      return (
        <span style={{ fontWeight: hasChildren ? "bold" : "normal" }}>
          {rowNumber}
        </span>
      );
    },
    sorter: enableSorting,
  };

  // Create the action column
  const actionCol: TableColumnsType<T>[0] = {
    title: t("actions"),
    key: "action",
    fixed: "right",
    align: "center",
    width: 70,
    render: (_, record) =>
      actionColumn ? actionColumn.render(record) : <Space size="small"></Space>,
  };

  // Prepare editable components
  const editableComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
      ...(components?.body || {}),
    },
    ...(components || {}),
  };

  // Choose components based on whether editable or drag is enabled
  const tableComponents = editable
    ? editableComponents
    : enableDrag
    ? {
        header: { cell: TableHeaderCell },
        body: { cell: TableBodyCell },
        ...components,
      }
    : components;

  // Configure the rowSelection based on showSelectionColumn mode
  const getRowSelection = () => {
    if (!showSelectionColumn) return undefined;

    // Start with the user-provided rowSelection or an empty object
    const baseSelection = rowSelection || {};

    // For "single" mode, we'll handle it with row click instead of radio buttons
    if (showSelectionColumn === "single") {
      // Return undefined for single mode since we'll handle it with row click
      return undefined;
    } else {
      // Default to checkbox for "multi" or boolean true
      return {
        ...baseSelection,
        type: "checkbox",
      };
    }
  };

  // Add state to track the selected row for single selection mode
  const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);

  // Modify the handleRowClick function to update our local state
  const handleRowClick = (record: T) => {
    if (showSelectionColumn === "single" && rowSelection?.onChange) {
      // Get the record key
      const recordKey =
        typeof rowKey === "function"
          ? rowKey(record)
          : rowKey
          ? record[rowKey as keyof T]
          : (record as any).key;

      // Store the selected key in our local state
      setSelectedRowKey(recordKey);

      // Call the onChange handler with the new selection
      rowSelection.onChange([recordKey], [record], { type: "single" });
    }
  };

  // Enhance row className function to apply selected styles
  const getRowClassName = (record: T, index: number) => {
    let classes = rowClassName?.(record, index) || "";

    // Add even/odd row classes
    if (index % 2 === 0) {
      classes += " even-row";
    } else {
      classes += " odd-row";
    }

    // Add editable class if needed
    if (editable) {
      classes += " editable-row";
    }

    // Add selected class for single selection mode
    if (showSelectionColumn === "single") {
      const recordKey =
        typeof rowKey === "function"
          ? rowKey(record)
          : rowKey
          ? record[rowKey as keyof T]
          : (record as any).key;

      if (recordKey === selectedRowKey) {
        classes += " row-selected";
      }

      classes += " clickable-row";
    }

    return classes;
  };

  // Improve the styles for selected rows with better hover and selection effects for both themes
  useEffect(() => {
    if (showSelectionColumn === "single") {
      const style = document.createElement("style");
      style.innerHTML = `
        /* Light theme styles */
        .clickable-row {
          transition: background-color 0.2s ease;
        }
        
        /* Hover styles */
        .clickable-row:hover td {
          background-color: rgba(24, 144, 255, 0.1) !important;
        }
        
        /* Selected row styles */
        .ant-table-row.row-selected td {
          background-color: rgba(24, 144, 255, 0.15) !important;
          border-left: 2px solid #1890ff;
        }
        
        /* Selected row hover styles */
        .ant-table-row.row-selected:hover td {
          background-color: rgba(24, 144, 255, 0.25) !important;
        }
        
        /* Fix for fixed columns in selected rows */
        .ant-table-row.row-selected td.ant-table-cell-fix-left,
        .ant-table-row.row-selected td.ant-table-cell-fix-right {
          background-color: rgba(24, 144, 255, 0.15) !important;
        }
        
        .ant-table-row.row-selected:hover td.ant-table-cell-fix-left,
        .ant-table-row.row-selected:hover td.ant-table-cell-fix-right {
          background-color: rgba(24, 144, 255, 0.25) !important;
        }
        
        /* Dark theme styles */
        .dark-theme .clickable-row:hover td {
          background-color: rgba(45, 140, 240, 0.2) !important;
        }
        
        .dark-theme .ant-table-row.row-selected td {
          background-color: rgba(45, 140, 240, 0.3) !important;
          border-left: 2px solid #177ddc;
        }
        
        .dark-theme .ant-table-row.row-selected:hover td {
          background-color: rgba(45, 140, 240, 0.4) !important;
        }
        
        .dark-theme .ant-table-row.row-selected td.ant-table-cell-fix-left,
        .dark-theme .ant-table-row.row-selected td.ant-table-cell-fix-right {
          background-color: rgba(45, 140, 240, 0.3) !important;
        }
        
        .dark-theme .ant-table-row.row-selected:hover td.ant-table-cell-fix-left,
        .dark-theme .ant-table-row.row-selected:hover td.ant-table-cell-fix-right {
          background-color: rgba(45, 140, 240, 0.4) !important;
        }
        
        /* Cursor styles */
        .ant-table-row.clickable-row {
          cursor: pointer;
        }
      `;

      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [showSelectionColumn]);

  // Include selection column if enabled, STT column, regular columns,
  // and action column at the end if showActions is true
  const visibleColumns = [
    ...(showSelectionColumn ? [Table.SELECTION_COLUMN] : []),
    sttColumn,
    ...newColumns.filter((col) => !col.hidden),
    ...(showActions ? [actionCol] : []),
  ];

  // Only use horizontal scroll with sticky header if enabled
  const tableScroll = {
    x: "max-content",
    ...(stickyHeader ? { y: tableHeight } : {}),
  };

  // Add custom styles for editable cells
  useEffect(() => {
    if (editable) {
      const style = document.createElement("style");
      style.innerHTML = `
        .editable-cell-value-wrap {
          padding: 5px 12px;
          cursor: pointer;
        }
        .editable-row:hover .editable-cell-value-wrap {
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          padding: 4px 11px;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [editable]);

  // Handle export to Excel
  const handleExportExcel = async () => {
    try {
      // Get data from callback if available, otherwise use existing data
      let dataToExport: T[] = getSortedData();

      // If onBeforeExport callback exists, call it and use returned data
      if (onBeforeExport) {
        const freshData = await onBeforeExport();
        if (freshData && Array.isArray(freshData)) {
          dataToExport = freshData;
        }
      }

      const fileName =
        routePath.replace(/\//g, "_").replace(/^_/, "") || "table_data";

      const visibleColumns = tableColumns.filter(
        (col) =>
          col.key !== undefined && checkedList.includes(col.key as React.Key)
      );

      exportToExcel(dataToExport, visibleColumns, fileName, true);
    } catch (error) {
      console.error("Error during export preparation:", error);
    }
  };

  // Handle export to CSV
  const handleExportCSV = async () => {
    // Get data from callback if available, otherwise use existing data
    let dataToExport: T[] = getSortedData();

    // If onBeforeExport callback exists, call it and use returned data
    if (onBeforeExport) {
      const freshData = await onBeforeExport();
      if (freshData && Array.isArray(freshData)) {
        dataToExport = freshData;
      }
    }
    const fileName =
      routePath.replace(/\//g, "_").replace(/^_/, "") || "table_data";

    const visibleColumns = tableColumns.filter(
      (col) =>
        col.key !== undefined && checkedList.includes(col.key as React.Key)
    );

    exportToCSV(dataToExport, visibleColumns, fileName, true);
  };

  const handleImportClick = () => {
    // Close the dropdown after a short delay to allow the click event to complete
    setTimeout(() => {
      setImportDropdownOpen(false);
    }, 300);
  };

  return (
    <div
      className={`tableHT ${darkMode ? "dark-theme" : ""}`}
      style={{ "--row-height": `${rowHeight}px` } as React.CSSProperties}
    >
      {enableDrag && !editable ? (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={visibleColumns.map(
              (i: { key?: React.Key }) => i.key?.toString() || ""
            )}
            strategy={horizontalListSortingStrategy}
          >
            <DragIndexContext.Provider value={dragIndex}>
              <Table<T>
                rowSelection={
                  showSelectionColumn && showSelectionColumn !== "single"
                    ? (getRowSelection() as TableRowSelection<T>)
                    : undefined
                }
                loading={loading}
                className={className}
                columns={visibleColumns}
                dataSource={getSortedData()}
                rowClassName={(record, index) => getRowClassName(record, index)}
                onChange={(pagination, filters, sorter) =>
                  handleSortChange(sorter)
                }
                onRow={(record) => ({
                  onDoubleClick: () => onRowDoubleClick?.(record),
                  onClick:
                    showSelectionColumn === "single"
                      ? () => handleRowClick(record)
                      : undefined,
                  className:
                    showSelectionColumn === "single"
                      ? "clickable-row"
                      : undefined,
                  ...onRow?.(record),
                })}
                scroll={tableScroll}
                components={tableComponents}
                rowKey={rowKey}
                pagination={
                  usePagination
                    ? {
                        current: currentPage,
                        pageSize: currentPageSize,
                        total: totalItems || dataSource.length,
                        showSizeChanger: true,
                        showTotal: (total) => `${t("total")}: ${total}`,
                        onChange: (page, pageSize) => {
                          setCurrentPage(page);
                          setCurrentPageSize(pageSize);
                          onPageChange?.(page, pageSize);
                        },
                        locale: {
                          items_per_page: "/ trang",
                          jump_to: "Đi đến",
                          jump_to_confirm: "xác nhận",
                          page: "Trang",
                          prev_page: "Trang trước",
                          next_page: "Trang sau",
                          prev_5: "5 trang trước",
                          next_5: "5 trang sau",
                          prev_3: "3 trang trước",
                          next_3: "3 trang sau",
                        },
                      }
                    : false
                }
                size="small"
                sticky={stickyHeader}
                expandable={expandable}
                {...restProps}
              />
            </DragIndexContext.Provider>
          </SortableContext>
          <DragOverlay>
            {dragIndex.active !== -1 && (
              <table>
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "8px",
                        border: "1px solid #d9d9d9",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {
                        tableColumns.find((col) => col.key === dragIndex.active)
                          ?.title as React.ReactNode
                      }
                    </th>
                  </tr>
                </thead>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <Table<T>
          rowSelection={
            showSelectionColumn && showSelectionColumn !== "single"
              ? (getRowSelection() as TableRowSelection<T>)
              : undefined
          }
          loading={loading}
          className={className}
          columns={visibleColumns}
          dataSource={getSortedData()}
          rowClassName={(record, index) => getRowClassName(record, index)}
          onChange={(pagination, filters, sorter) => handleSortChange(sorter)}
          onRow={(record) => ({
            onDoubleClick: () => onRowDoubleClick?.(record),
            onClick:
              showSelectionColumn === "single"
                ? () => handleRowClick(record)
                : undefined,
            className:
              showSelectionColumn === "single" ? "clickable-row" : undefined,
            ...onRow?.(record),
            style: {
              height: `${rowHeight}px`,
              cursor: showSelectionColumn === "single" ? "pointer" : "default",
            },
          })}
          scroll={tableScroll}
          components={tableComponents}
          rowKey={rowKey}
          pagination={
            usePagination
              ? {
                  current: currentPage,
                  pageSize: currentPageSize,
                  total: totalItems || dataSource.length,
                  showSizeChanger: true,
                  showTotal: (total) => `${t("total")}: ${total}`,
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setCurrentPageSize(pageSize);
                    onPageChange?.(page, pageSize);
                  },
                  locale: {
                    items_per_page: "/ trang",
                    jump_to: "Đi đến",
                    jump_to_confirm: "xác nhận",
                    page: "Trang",
                    prev_page: "Trang trước",
                    next_page: "Trang sau",
                    prev_5: "5 trang trước",
                    next_5: "5 trang sau",
                    prev_3: "3 trang trước",
                    next_3: "3 trang sau",
                  },
                }
              : false
          }
          size="small"
          sticky={stickyHeader}
          expandable={expandable}
          {...restProps}
        />
      )}
      <div className="table-footer">
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="small">
              <Tooltip title="Xuất Excel">
                <BsFiletypeXlsx
                  size={20}
                  onClick={handleExportExcel}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Tooltip title="Xuất CSV">
                <BsFiletypeCsv
                  size={20}
                  onClick={handleExportCSV}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Dropdown
                menu={{ items: [] }}
                dropdownRender={() => (
                  <div className="dark-dropdown-content">
                    <div
                      style={{
                        borderBottom: `1px solid ${
                          darkMode ? "#303030" : "#e8e8e8"
                        }`,
                        padding: "4px 0 8px",
                      }}
                    >
                      <Checkbox
                        indeterminate={indeterminate}
                        onChange={handleSelectAllChange}
                        checked={allChecked}
                      >
                        <span style={{ color: darkMode ? "#fff" : "inherit" }}>
                          {t("selectAll")}
                        </span>
                      </Checkbox>
                    </div>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflow: "auto",
                        padding: "8px 0",
                      }}
                    >
                      <Checkbox.Group
                        value={checkedList}
                        onChange={handleColumnChange}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {tableColumns.map((column) => (
                          <div key={column.key} style={{ marginBottom: "8px" }}>
                            <Checkbox value={column.key}>
                              <span
                                style={{
                                  color: darkMode ? "#fff" : "inherit",
                                }}
                              >
                                {typeof column.title === "function"
                                  ? column.title({})
                                  : column.title}
                              </span>
                            </Checkbox>
                          </div>
                        ))}
                      </Checkbox.Group>
                    </div>
                  </div>
                )}
                trigger={["click"]}
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                overlayStyle={{
                  backgroundColor: darkMode ? "black" : "#fff",
                }}
              >
                <Tooltip title={t("showHideColumns")}>
                  <TbFreezeColumn
                    size={20}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Dropdown>

              <Tooltip
                title={
                  <div>
                    <p style={{ margin: "4px 0", fontWeight: "bold" }}>
                      Phím tắt:
                    </p>
                    <ul style={{ paddingLeft: "16px", margin: "4px 0" }}>
                      <li>Ctrl + A: Mở form thêm mới</li>
                      <li>Ctrl + Enter: Lưu dữ liệu</li>
                      <li>Esc: Đóng form/hủy thao tác</li>
                      {editable && <li>Double-click: Chỉnh sửa trực tiếp</li>}
                    </ul>
                  </div>
                }
                placement="top"
                styles={{ root: { maxWidth: "300px" } }}
              >
                <BiSolidKeyboard
                  size={22}
                  style={{
                    cursor: "pointer",
                    verticalAlign: "middle",
                    marginLeft: "4px",
                  }}
                />
              </Tooltip>
              {importComponent && (
                <Dropdown
                  menu={{ items: [] }}
                  dropdownRender={() => (
                    <div
                      className={darkMode ? "dark-dropdown-content" : ""}
                      style={{
                        padding: "8px",
                        background: darkMode ? "#fff" : "#fff",
                        borderRadius: "2px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={handleImportClick}
                    >
                      {importComponent}
                    </div>
                  )}
                  trigger={["click"]}
                  open={importDropdownOpen}
                  onOpenChange={setImportDropdownOpen}
                >
                  <Tooltip title="Nhập dữ liệu">
                    <FiUpload
                      size={20}
                      style={{
                        cursor: "pointer",
                        color: darkMode ? "#fff" : "inherit",
                      }}
                    />
                  </Tooltip>
                </Dropdown>
              )}
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Ctable;
