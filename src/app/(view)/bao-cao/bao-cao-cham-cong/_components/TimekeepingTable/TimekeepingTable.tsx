/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";
import BaoCaoChamCongServices from "@/services/bao-cao/bao-cao-cham-cong.service";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaEye } from "react-icons/fa";
import {
  FormValues,
  TableTimekeepingProps,
  TableTimekeepingRef,
} from "../../_types/prop";
import TimekeepingDetailModal from "../TimekeepingDetailModal";
import "./TimekeepingTable.scss";
import { getTimekeepingTableColumn } from "./TimekeepingTableColumn";
import {
  TimekeepingDetailItem,
  TimekeepingReportData,
} from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";

const defaultPageSize = 20;

const TimekeepingTable = forwardRef<TableTimekeepingRef, TableTimekeepingProps>(
  ({ filterRef }, ref) => {
    const [selectedTimekeepingDetail, setSelectedTimekeepingDetail] = useState<
      TimekeepingDetailItem[]
    >([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState<TimekeepingReportData[]>([]);
    const [selectedUser, setSelectedUser] = useState<TimekeepingReportData>();
    const gridRef = useRef<AgGridReact<TimekeepingReportData>>(null);
    const [quickSearchText] = useState<string | undefined>(undefined);

    const getMonthRange = (monthValue: any) => {
      // Accept either a Date-like value or a string in 'MM/YYYY' format
      const parsed = dayjs(monthValue, "MM/YYYY", true).isValid()
        ? dayjs(monthValue, "MM/YYYY")
        : dayjs(monthValue);
      return {
        startTime: parsed.startOf("month").toISOString(),
        endTime: parsed.endOf("month").toISOString(),
      };
    };

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

    const handleViewDetailCb = useCallback(
      async (record: TimekeepingReportData) => {
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

          const params: any = {
            ...(filterValues.month ? getMonthRange(filterValues.month) : {}),
            ...(record.userId ? { userId: record.userId } : {}),
          };
          const res = await BaoCaoChamCongServices.getTimekeepingReportDetail(
            searchFilter,
            quickSearchText,
            params
          );
          setSelectedTimekeepingDetail(res.data);
          setModalOpen(true);
          setSelectedUser(record);
        } catch (error) {
          console.log(error);
        }
      },
      [pageSize, currentPage, filterRef, quickSearchText]
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

          const params: any = {
            ...(filterValues.month
              ? { month: dayjs(filterValues.month).format("MM/YYYY") }
              : {}),
            ...(filterValues.departmentId
              ? { departmentId: filterValues.departmentId }
              : {}),
            ...(filterValues.positionId
              ? { positionId: filterValues.positionId }
              : {}),
            ...(filterValues.status ? { status: filterValues.status } : {}),
          };

          const response = await BaoCaoChamCongServices.getTimekeepingReport(
            searchFilter,
            quickSearchText,
            params
          );
          setRowData(response.data);
          setTotalItems(response.count);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      [filterRef]
    );

    const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedTimekeepingDetail([]);
      setSelectedUser(undefined);
    };

    const columnDefs: ExtendedColDef[] = useMemo(() => {
      return getTimekeepingTableColumn();
    }, []);

    const toolColumnRenderer = useCallback(
      (params: { data?: TimekeepingReportData }) => {
        if (!params.data) return null;
        return (
          <Tooltip title="Xem chi tiết">
            <FaEye
              onClick={() => handleViewDetailCb(params.data!)}
              style={{
                fontSize: "16px",
                color: "#015c92",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        );
      },
      [handleViewDetailCb]
    );

    return (
      <div>
        <TimekeepingDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          userName={selectedUser?.fullNameUser || ""}
          data={selectedTimekeepingDetail}
        />
        <AgGridComponent
          gridRef={gridRef as React.RefObject<AgGridReact>}
          rowData={rowData}
          columnDefs={columnDefs}
          loading={loading}
          total={totalItem}
          showSearch={true}
          showSTT={true}
          showExportExcel={true}
          exportFileName="Bao-cao-cham-cong"
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
          showToolColumn={true}
          toolColumnRenderer={toolColumnRenderer}
          toolColumnWidth={100}
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

TimekeepingTable.displayName = "TimekeepingTable";

export default TimekeepingTable;
