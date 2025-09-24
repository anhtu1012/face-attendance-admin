/* eslint-disable @typescript-eslint/no-explicit-any */
import AgGridComponent from "@/components/basicUI/cTableAG";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";
import { showError } from "@/hooks/useNotification";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserComponentPropsProps } from "../../_types/prop";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
const defaultPageSize = 20;
function UserComponent({
  shouldFetch = false,
  onUserSelect,
}: UserComponentPropsProps) {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("UserComponent");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<NguoiDungItem[]>([]);
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );

  const fetchData = useCallback(
    async (
      currentPage: number,
      pageSize: number,
      quickSearchText: string | undefined
    ) => {
      setLoading(true);
      try {
        const searchFilter: FilterQueryStringTypeItem[] = [
          { key: "limit", type: FilterOperationType.Eq, value: pageSize },
          {
            key: "offset",
            type: FilterOperationType.Eq,
            value: (currentPage - 1) * pageSize,
          },
        ];
        const response = await NguoiDungServices.getNguoiDung(
          searchFilter,
          quickSearchText
        );
        setRowData(response.data);
        setTotalItems(response.count || 0);
        setLoading(false);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
        setLoading(false);
      }
    },
    [mes]
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("userName"),
        editable: false,
      },
      {
        field: "firstName",
        headerName: t("firstName"),
        editable: false,
        valueFormatter: (params) => {
          return `${params.data?.firstName || ""} ${
            params.data?.lastName || ""
          }`;
        },
      },
      {
        field: "email",
        headerName: "email",
        editable: false,
      },
    ],
    [t]
  );
  const dataGrid = useDataGridOperations<NguoiDungItem>({
    gridRef,
    createNewItem: () => {
      return {} as NguoiDungItem;
    },
    mes,
    rowData,
    setRowData,
    requiredFields: [],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData,
    columnDefs,
  });

  useEffect(() => {
    if (shouldFetch) {
      fetchData(1, defaultPageSize, undefined);
    }
  }, [shouldFetch]);

  return (
    <AgGridComponent
      showSearch={true}
      inputSearchProps={{
        id: "filter-text-box",
        idSearch: "filter-text-box",
      }}
      rowSelection={{
        mode: "singleRow",
        enableClickSelection: true,
        checkboxes: false,
      }}
      loading={loading}
      rowData={dataGrid.rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
      total={totalItem}
      pagination={true}
      paginationPageSize={pageSize}
      paginationCurrentPage={currentPage}
      onChangePage={(currentPage, pageSize) => {
        setCurrentPage(currentPage);
        setPageSize(pageSize);
        fetchData(currentPage, pageSize, quickSearchText);
      }}
      maxRowsVisible={10}
      columnFlex={1}
      onQuicksearch={dataGrid.handleQuicksearch}
      onRowDoubleClicked={
        onUserSelect ? (event) => onUserSelect(event.data) : undefined
      }
      showActionButtons={false}
    />
  );
}

export default UserComponent;
