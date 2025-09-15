import { ColDef } from "@ag-grid-community/core";

export function buildQuicksearchParams(
  searchText: string,
  selectedFilterColumns: string[],
  filterValues: string,
  columnDefs: ColDef[]
): string {
  // Tách filterValues thành mảng theo dấu phẩy hoặc xuống dòng, loại bỏ khoảng trắng thừa
  const filterArr = filterValues
    ? filterValues
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  // Gộp searchText và filterArr thành mảng quicksearch
  const quicksearchArr = [...(searchText ? [searchText] : []), ...filterArr];
  // Nếu không có cột filter, lấy tất cả field
  const cols =
    selectedFilterColumns && selectedFilterColumns.length > 0
      ? selectedFilterColumns
      : columnDefs.map((col) => col.field).filter(Boolean);

  // Tạo query string
  const params = [
    ...cols.map((col) => `quicksearchCols=${encodeURIComponent(col!)}`),
    ...quicksearchArr.map((val) => `quicksearch=${encodeURIComponent(val)}`),
  ].join("&");
  return params;
}
