# Hướng dẫn sử dụng các Custom Hooks đã tách

Dưới đây là hướng dẫn về các custom hooks và utility functions đã được tách ra từ component `AgGridComponent` để làm cho code dễ đọc và bảo trì hơn.

## Danh sách các hooks đã tách:

### 1. useMouseHandlers

**Mục đích**: Xử lý các sự kiện chuột (mouse down, mouse over, mouse up, click outside)
**Vị trí**: `hooks/useMouseHandlers.ts`
**Sử dụng**:

```ts
const { handleMouseDown, handleMouseOver, handleMouseUp, handleClickOutside } =
  useMouseHandlers({
    // ... props
  });
```

### 2. useFillHandle

**Mục đích**: Quản lý fill handle để copy/paste dữ liệu giữa các cells
**Vị trí**: `hooks/useFillHandle.ts`
**Sử dụng**:

```ts
const {
  fillHandleVisible,
  fillHandlePosition,
  showFillHandle,
  handleFillMouseDown,
  handleFillDrag,
  handleFillMouseUp,
} = useFillHandle({
  // ... props
});
```

### 3. useAutoScroll

**Mục đích**: Xử lý auto-scroll khi drag cells hoặc fill handle
**Vị trí**: `hooks/useAutoScroll.ts`
**Sử dụng**:

```ts
const { handleAutoScroll, stopAutoScroll, handleAutoScrollByMousePosition } =
  useAutoScroll({
    // ... props
  });
```

### 4. useTableFilter

**Mục đích**: Quản lý filter và search functionality
**Vị trí**: `hooks/useTableFilter.ts`
**Sử dụng**:

```ts
const {
  showFilterModal,
  filteredData,
  isFiltered,
  searchText,
  setSearchText,
  handleOpenFilterModal,
  handleApplyFilter,
  handleResetFilters,
} = useTableFilter({
  // ... props
});
```

### 5. useInfiniteScroll

**Mục đích**: Xử lý infinite scroll functionality
**Vị trí**: `hooks/useInfiniteScroll.ts`
**Sử dụng**:

```ts
const { isLoadingMore, maxReachedPage, handleInfiniteScroll } =
  useInfiniteScroll({
    // ... props
  });
```

### 6. usePagination

**Mục đích**: Quản lý pagination logic và tính toán dữ liệu theo trang
**Vị trí**: `hooks/usePagination.ts`
**Sử dụng**:

```ts
const {
  currentPage,
  pageSize,
  pagedData,
  pageSizeOptions,
  displayTotal,
  handlePageChange,
} = usePagination({
  // ... props
});
```

### 7. useClipboard

**Mục đích**: Xử lý copy/paste với clipboard (Ctrl+C)
**Vị trí**: `hooks/useClipboard.ts`
**Sử dụng**:

```ts
const { handleKeyDown, copyToClipboard } = useClipboard({
  selectedCells,
  gridRef,
});
```

### 8. useColumnDefinitions

**Mục đích**: Tạo và quản lý column definitions (bao gồm STT column)
**Vị trí**: `hooks/useColumnDefinitions.ts`
**Sử dụng**:

```ts
const { defaultColDef, extendedColumnDefs } = useColumnDefinitions({
  columnDefs,
  showSTT,
  currentPage,
  pageSize,
  // ... other props
});
```

### 9. useGridConfiguration

**Mục đích**: Cấu hình grid options, overlays, và tính toán chiều cao
**Vị trí**: `hooks/useGridConfiguration.ts`
**Sử dụng**:

```ts
const {
  gridHeight,
  rowHeight,
  gridOptions,
  overlayLoadingTemplate,
  overlayNoRowsTemplate,
  onFilterChanged,
} = useGridConfiguration({
  // ... props
});
```

## Utility Functions:

### handleExcelExport / useExcelExport

**Mục đích**: Xử lý export Excel
**Vị trí**: `utils/excelExport.ts`
**Sử dụng**:

```ts
// Sử dụng trực tiếp
handleExcelExport({
  gridRef,
  columnDefs,
  rowData,
  filteredData,
  isFiltered,
  exportFileName,
  exportDecorated,
});

// Hoặc sử dụng hook
const { exportExcel } = useExcelExport({
  columnDefs,
  rowData,
  filteredData,
  isFiltered,
  exportFileName,
  exportDecorated,
});
```

## Lợi ích của việc tách nhỏ:

1. **Dễ bảo trì**: Mỗi hook có trách nhiệm rõ ràng
2. **Tái sử dụng**: Các hooks có thể được sử dụng trong components khác
3. **Dễ test**: Có thể test từng hook riêng biệt
4. **Giảm độ phức tạp**: Component chính trở nên nhỏ gọn hơn
5. **Tách biệt logic**: Mỗi chức năng được tách biệt rõ ràng
6. **Type safety**: Tất cả hooks đều có TypeScript types đầy đủ

## Import các hooks:

```ts
import {
  useMouseHandlers,
  useFillHandle,
  useAutoScroll,
  useTableFilter,
  useInfiniteScroll,
  usePagination,
  useClipboard,
  useColumnDefinitions,
  useGridConfiguration,
  handleExcelExport,
  useExcelExport,
} from "./shared";
```

Sau khi tách, component `AgGridComponent` chính sẽ sử dụng các hooks này thay vì chứa tất cả logic bên trong một file duy nhất.
