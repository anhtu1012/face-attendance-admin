"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";
import { SalaryReportItem } from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import BaoCaoSalaryServices from "@/services/bao-cao/bao-cao-luong.service";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FormValues,
  TableSalaryProps,
  TableSalaryRef,
} from "../../_types/prop";
import "./SalaryTable.scss";
import { getSalaryTableColumn } from "./SalaryTableColumn";

const defaultPageSize = 20;

const SalaryTable = forwardRef<TableSalaryRef, TableSalaryProps>(
  ({ filterRef }, ref) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [, setLoading] = useState(true);
    const [rowData, setRowData] = useState<SalaryReportItem[]>([]);
    const gridRef = useRef<AgGridReact>(null);
    const [quickSearchText] = useState<string | undefined>(undefined);

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

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

          const params = {
            ...(filterValues.month
              ? { year: dayjs(filterValues.month).format("YYYY") }
              : {}),
            ...(filterValues.month
              ? { date: dayjs(filterValues.month).format("MM/YYYY") }
              : {}),
            ...(filterValues.departmentId
              ? { departmentId: filterValues.departmentId }
              : {}),
            ...(filterValues.positionId
              ? { positionId: filterValues.positionId }
              : {}),
          };

          const res = await BaoCaoSalaryServices.getSalaryReport(
            searchFilter,
            quickSearchText,
            params
          );

          setRowData(res.data);
          setTotalItems(res.count);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching salary data:", error);
          setLoading(false);
        }
      },
      [filterRef]
    );

    const columnDefs = useMemo<ExtendedColDef[]>(
      () => getSalaryTableColumn(),
      []
    );

    return (
      <div>
        <AgGridComponent
          gridRef={gridRef as React.RefObject<AgGridReact>}
          rowData={rowData}
          columnDefs={columnDefs}
          total={totalItem}
          showSearch={true}
          showSTT={true}
          showExportExcel={true}
          exportFileName="Bao-cao-luong"
          exportDecorated={true}
          maxRowsVisible={15}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          onChangePage={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            fetchData(page, size, quickSearchText);
          }}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: false,
            checkboxes: false,
          }}
        />
      </div>
    );
  }
);

SalaryTable.displayName = "SalaryTable";

export default SalaryTable;
