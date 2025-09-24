/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { UserContractItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  FormValues,
  TableContractProps,
  TableContractRef,
} from "../../_types/prop";
const defaultPageSize = 20;
const TableContract = forwardRef<TableContractRef, TableContractProps>(
  ({ filterRef }, ref) => {
    const mes = useTranslations("HandleNotion");
    const t = useTranslations("TableContract");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState<UserContractItem[]>([]);
    const gridRef = useRef<AgGridReact>({} as AgGridReact);
    const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
      undefined
    );

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

    const columnDefs: ColDef[] = useMemo(
      () => [
        {
          field: "contractNumber",
          headerName: t("contractNumber"),
          editable: false,
          width: 150,
        },
        {
          field: "titleContractName",
          headerName: t("titleContractName"),
          editable: false,
          width: 200,
        },
        {
          field: "contractType",
          headerName: t("contractType"),
          editable: false,
          width: 150,
        },
        {
          field: "fullNameUser",
          headerName: t("fullNameUser"),
          editable: false,
          width: 150,
        },
        {
          field: "fullNameManager",
          headerName: t("fullNameManager"),
          editable: false,
          width: 150,
        },
        {
          field: "branchNames",
          headerName: t("branchNames"),
          editable: false,
          width: 250,
        },
        {
          field: "startDate",
          headerName: t("startDate"),
          editable: false,
          width: 250,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "endDate",
          headerName: t("endDate"),
          editable: false,
          width: 250,
          context: {
            typeColumn: "Date",
          },
        },
        {
          field: "duration",
          headerName: t("duration"),
          editable: false,
          width: 150,
          valueFormatter: (params) => {
            if (params.value && typeof params.value === "number") {
              const minutes = params.value;
              const minutesPerDay = 1440;
              const daysPerYear = 365;
              const minutesPerYear = daysPerYear * minutesPerDay;

              const years = Math.floor(minutes / minutesPerYear);
              let remainingMinutes = minutes % minutesPerYear;

              const days = Math.floor(remainingMinutes / minutesPerDay);
              remainingMinutes = remainingMinutes % minutesPerDay;

              const parts = [];
              if (years > 0) parts.push(`${years} năm`);
              if (days > 0) parts.push(`${days} ngày`);
              if (remainingMinutes > 0) parts.push(`${remainingMinutes} phút`);

              return parts.join(" ") || "0 phút";
            }
            return "";
          },
        },
        {
          field: "status",
          headerName: t("status"),
          editable: false,
          width: 150,
        },
      ],
      [t]
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

          const filterValues: Partial<FormValues> =
            filterRef.current?.getFormValues() || {};
          console.log({ filterValues });

          const params: any = {
            fromDate:
              filterValues.filterDateRange && filterValues.filterDateRange[0]
                ? filterValues.filterDateRange[0].toISOString()
                : undefined,
            toDate:
              filterValues.filterDateRange && filterValues.filterDateRange[1]
                ? filterValues.filterDateRange[1].toISOString()
                : undefined,
          };
          const response = await QuanLyHopDongServices.getQuanLyHopDong(
            searchFilter,
            quickSearchText,
            params
          );
          setRowData(response.data);
          setTotalItems(response.count || 0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      [filterRef]
    );

    const dataGrid = useDataGridOperations<UserContractItem>({
      gridRef,
      createNewItem: () => {
        return {} as UserContractItem;
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

    return (
      <div>
        {" "}
        <AgGridComponentWrapper
          showSearch={true}
          rownumber={true}
          rowData={dataGrid.rowData}
          loading={loading}
          columnDefs={columnDefs}
          gridRef={gridRef}
          total={totalItem}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: true,
            checkboxes: false,
          }}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          onChangePage={(currentPage, pageSize) => {
            setCurrentPage(currentPage);
            setPageSize(pageSize);
            fetchData(currentPage, pageSize, quickSearchText);
          }}
          maxRowsVisible={13}
          columnFlex={0}
          onQuicksearch={dataGrid.handleQuicksearch}
          showActionButtons={false}
        />
      </div>
    );
  }
);

TableContract.displayName = "TableContract";

export default TableContract;
