/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import AgGridComponent from "@/components/basicUI/cTableAG";
import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Tooltip } from "antd";
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
  TimekeepingReportData,
} from "../../_types/prop";
import TimekeepingDetailModal from "../TimekeepingDetailModal";
import "./TimekeepingTable.scss";
import { getTimekeepingTableColumn } from "./TimekeepingTableColumn";

const defaultPageSize = 20;

const TimekeepingTable = forwardRef<TableTimekeepingRef, TableTimekeepingProps>(
  ({ filterRef }, ref) => {
    const [selectedUser, setSelectedUser] =
      useState<TimekeepingReportData | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [, setLoading] = useState(true);
    const [rowData, setRowData] = useState<TimekeepingReportData[]>([]);
    const gridRef = useRef<AgGridReact<TimekeepingReportData>>(null);
    const [quickSearchText] = useState<string | undefined>(undefined);

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize, quickSearchText),
    }));

    const handleViewDetailCb = useCallback((record: TimekeepingReportData) => {
      setSelectedUser(record);
      setModalOpen(true);
    }, []);

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
          console.log(searchFilter, quickSearchText);

          const filterValues: Partial<FormValues> =
            filterRef.current?.getFormValues() || {};

          const params: any = {
            // ...(filterValues.month
            //   ? { month: filterValues.month.toISOString() }
            //   : {}),
            ...(filterValues.departmentId
              ? { departmentId: filterValues.departmentId }
              : {}),
            ...(filterValues.positionId
              ? { positionId: filterValues.positionId }
              : {}),
            ...(filterValues.status ? { status: filterValues.status } : {}),
          };

          //   const response = await BaoCaoChamCongService.getTimekeepingReport(
          //     searchFilter,
          //     quickSearchText,
          //     params
          //   );
          console.log(params);

          setRowData([
            {
              actualTimekeeping: 22,
              monthStandardTimekeeping: 26,
              actualHour: 180,
              monthStandardHour: 208,
              lateNumber: 3,
              earlyNumber: 1,
              offWorkNumber: 2,
              forgetLogNumber: 1,
              normalOtTimekeeping: 0.5,
              normalOtHour: 4,
              offDayOtTimekeeping: 1.25,
              offDayOtHour: 10,
              holidayOtTimekeeping: 0,
              holidayOtHour: 0,
              lateFine: "20,000",
              forgetLogFine: "20,000",
              userId: "1",
              fullNameUser: "Nguyễn Anh Tú",
              fullNameManager: "Phạm Văn A",
              positionName: "Frontend Developer",
              departmentName: "Kỹ thuật",
              timekeepingDetails: [
                {
                  timekeepingId: "tk1_1",
                  date: "2024-11-01",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk1_2",
                  date: "2024-11-02",
                  totalWorkHour: 7.5,
                  checkinTime: "08:15",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk1_3",
                  date: "2024-11-03",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk1_4",
                  date: "2024-11-04",
                  totalWorkHour: 10,
                  checkinTime: "08:00",
                  checkoutTime: "19:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk1_5",
                  date: "2024-11-05",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk1_6",
                  date: "2024-11-06",
                  totalWorkHour: 8.5,
                  checkinTime: "08:30",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk1_7",
                  date: "2024-11-07",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk1_8",
                  date: "2024-11-08",
                  totalWorkHour: 9,
                  checkinTime: "08:00",
                  checkoutTime: "18:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk1_9",
                  date: "2024-11-09",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk1_10",
                  date: "2024-11-10",
                  totalWorkHour: 8,
                  checkinTime: "08:10",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "LATE",
                },
              ],
            },
            {
              actualTimekeeping: 24,
              monthStandardTimekeeping: 26,
              actualHour: 195,
              monthStandardHour: 208,
              lateNumber: 1,
              earlyNumber: 0,
              offWorkNumber: 1,
              forgetLogNumber: 0,
              normalOtTimekeeping: 1,
              normalOtHour: 8,
              offDayOtTimekeeping: 0.5,
              offDayOtHour: 4,
              holidayOtTimekeeping: 0,
              holidayOtHour: 0,
              lateFine: "10,000",
              forgetLogFine: "0",
              userId: "2",
              fullNameUser: "Nguyễn Văn Bình",
              fullNameManager: "Phạm Văn A",
              positionName: "Backend Developer",
              departmentName: "Kỹ thuật",
              timekeepingDetails: [
                {
                  timekeepingId: "tk2_1",
                  date: "2024-11-01",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_2",
                  date: "2024-11-02",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_3",
                  date: "2024-11-03",
                  totalWorkHour: 8,
                  checkinTime: "08:05",
                  checkoutTime: "17:05",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk2_4",
                  date: "2024-11-04",
                  totalWorkHour: 10,
                  checkinTime: "08:00",
                  checkoutTime: "19:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_5",
                  date: "2024-11-05",
                  totalWorkHour: 9,
                  checkinTime: "08:00",
                  checkoutTime: "18:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_6",
                  date: "2024-11-06",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_7",
                  date: "2024-11-07",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_8",
                  date: "2024-11-08",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk2_9",
                  date: "2024-11-09",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk2_10",
                  date: "2024-11-10",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
              ],
            },
            {
              actualTimekeeping: 20,
              monthStandardTimekeeping: 26,
              actualHour: 165,
              monthStandardHour: 208,
              lateNumber: 5,
              earlyNumber: 2,
              offWorkNumber: 3,
              forgetLogNumber: 2,
              normalOtTimekeeping: 0,
              normalOtHour: 0,
              offDayOtTimekeeping: 0,
              offDayOtHour: 0,
              holidayOtTimekeeping: 0,
              holidayOtHour: 0,
              lateFine: "50,000",
              forgetLogFine: "40,000",
              userId: "3",
              fullNameUser: "Trần Thị Cúc",
              fullNameManager: "Lê Văn D",
              positionName: "UI/UX Designer",
              departmentName: "Thiết kế",
              timekeepingDetails: [
                {
                  timekeepingId: "tk3_1",
                  date: "2024-11-01",
                  totalWorkHour: 8,
                  checkinTime: "08:30",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk3_2",
                  date: "2024-11-02",
                  totalWorkHour: 7.5,
                  checkinTime: "08:45",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk3_3",
                  date: "2024-11-03",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk3_4",
                  date: "2024-11-04",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk3_5",
                  date: "2024-11-05",
                  totalWorkHour: 7,
                  checkinTime: "08:20",
                  checkoutTime: "16:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk3_6",
                  date: "2024-11-06",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk3_7",
                  date: "2024-11-07",
                  totalWorkHour: 8,
                  checkinTime: "08:35",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk3_8",
                  date: "2024-11-08",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk3_9",
                  date: "2024-11-09",
                  totalWorkHour: 8,
                  checkinTime: "08:40",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk3_10",
                  date: "2024-11-10",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
              ],
            },
            {
              actualTimekeeping: 25,
              monthStandardTimekeeping: 26,
              actualHour: 202,
              monthStandardHour: 208,
              lateNumber: 0,
              earlyNumber: 0,
              offWorkNumber: 0,
              forgetLogNumber: 0,
              normalOtTimekeeping: 2,
              normalOtHour: 16,
              offDayOtTimekeeping: 1,
              offDayOtHour: 8,
              holidayOtTimekeeping: 0.5,
              holidayOtHour: 4,
              lateFine: "0",
              forgetLogFine: "0",
              userId: "4",
              fullNameUser: "Lê Minh Đức",
              fullNameManager: "Phạm Văn A",
              positionName: "Full Stack Developer",
              departmentName: "Kỹ thuật",
              timekeepingDetails: [
                {
                  timekeepingId: "tk4_1",
                  date: "2024-11-01",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_2",
                  date: "2024-11-02",
                  totalWorkHour: 10,
                  checkinTime: "08:00",
                  checkoutTime: "19:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_3",
                  date: "2024-11-03",
                  totalWorkHour: 12,
                  checkinTime: "08:00",
                  checkoutTime: "21:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_4",
                  date: "2024-11-04",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_5",
                  date: "2024-11-05",
                  totalWorkHour: 9,
                  checkinTime: "08:00",
                  checkoutTime: "18:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_6",
                  date: "2024-11-06",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_7",
                  date: "2024-11-07",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_8",
                  date: "2024-11-08",
                  totalWorkHour: 11,
                  checkinTime: "08:00",
                  checkoutTime: "20:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_9",
                  date: "2024-11-09",
                  totalWorkHour: 8,
                  checkinTime: "09:00",
                  checkoutTime: "18:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk4_10",
                  date: "2024-11-10",
                  totalWorkHour: 12,
                  checkinTime: "08:00",
                  checkoutTime: "21:00",
                  hasOT: true,
                  status: "END",
                },
              ],
            },
            {
              actualTimekeeping: 19,
              monthStandardTimekeeping: 26,
              actualHour: 152,
              monthStandardHour: 208,
              lateNumber: 7,
              earlyNumber: 3,
              offWorkNumber: 5,
              forgetLogNumber: 3,
              normalOtTimekeeping: 0,
              normalOtHour: 0,
              offDayOtTimekeeping: 0,
              offDayOtHour: 0,
              holidayOtTimekeeping: 0,
              holidayOtHour: 0,
              lateFine: "70,000",
              forgetLogFine: "60,000",
              userId: "5",
              fullNameUser: "Phạm Thị Hoa",
              fullNameManager: "Lê Văn D",
              positionName: "Marketing Executive",
              departmentName: "Marketing",
              timekeepingDetails: [
                {
                  timekeepingId: "tk5_1",
                  date: "2024-11-01",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk5_2",
                  date: "2024-11-02",
                  totalWorkHour: 7.5,
                  checkinTime: "08:50",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk5_3",
                  date: "2024-11-03",
                  totalWorkHour: 8,
                  checkinTime: "08:40",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk5_4",
                  date: "2024-11-04",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk5_5",
                  date: "2024-11-05",
                  totalWorkHour: 7,
                  checkinTime: "09:00",
                  checkoutTime: "16:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk5_6",
                  date: "2024-11-06",
                  totalWorkHour: 8,
                  checkinTime: "08:30",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk5_7",
                  date: "2024-11-07",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk5_8",
                  date: "2024-11-08",
                  totalWorkHour: 8,
                  checkinTime: "08:45",
                  checkoutTime: "17:30",
                  hasOT: false,
                  status: "LATE",
                },
                {
                  timekeepingId: "tk5_9",
                  date: "2024-11-09",
                  totalWorkHour: 0,
                  checkinTime: "",
                  checkoutTime: "",
                  hasOT: false,
                  status: "ABSENT",
                },
                {
                  timekeepingId: "tk5_10",
                  date: "2024-11-10",
                  totalWorkHour: 7,
                  checkinTime: "09:10",
                  checkoutTime: "16:40",
                  hasOT: false,
                  status: "LATE",
                },
              ],
            },
            {
              actualTimekeeping: 26,
              monthStandardTimekeeping: 26,
              actualHour: 208,
              monthStandardHour: 208,
              lateNumber: 0,
              earlyNumber: 0,
              offWorkNumber: 0,
              forgetLogNumber: 0,
              normalOtTimekeeping: 0.5,
              normalOtHour: 4,
              offDayOtTimekeeping: 0,
              offDayOtHour: 0,
              holidayOtTimekeeping: 0,
              holidayOtHour: 0,
              lateFine: "0",
              forgetLogFine: "0",
              userId: "6",
              fullNameUser: "Hoàng Văn Nam",
              fullNameManager: "Trần Văn E",
              positionName: "Project Manager",
              departmentName: "Quản lý dự án",
              timekeepingDetails: [
                {
                  timekeepingId: "tk6_1",
                  date: "2024-11-01",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_2",
                  date: "2024-11-02",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_3",
                  date: "2024-11-03",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_4",
                  date: "2024-11-04",
                  totalWorkHour: 9,
                  checkinTime: "08:00",
                  checkoutTime: "18:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_5",
                  date: "2024-11-05",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_6",
                  date: "2024-11-06",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_7",
                  date: "2024-11-07",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_8",
                  date: "2024-11-08",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_9",
                  date: "2024-11-09",
                  totalWorkHour: 9,
                  checkinTime: "08:00",
                  checkoutTime: "18:00",
                  hasOT: true,
                  status: "END",
                },
                {
                  timekeepingId: "tk6_10",
                  date: "2024-11-10",
                  totalWorkHour: 8,
                  checkinTime: "08:00",
                  checkoutTime: "17:00",
                  hasOT: false,
                  status: "END",
                },
              ],
            },
          ]);
          setTotalItems(15);
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
      setSelectedUser(null);
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
          data={selectedUser?.timekeepingDetails}
        />
        <AgGridComponent
          gridRef={gridRef as React.RefObject<AgGridReact>}
          rowData={rowData}
          columnDefs={columnDefs}
          //   loading={loading}
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
