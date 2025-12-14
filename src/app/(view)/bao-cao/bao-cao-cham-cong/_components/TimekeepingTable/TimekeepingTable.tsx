/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  TimekeepingDetailItem,
  TimekeepingReportData,
} from "@/dtos/bao-cao/bao-cao-cham-cong/bao-cao-cham-cong.dto";
import BaoCaoChamCongServices from "@/services/bao-cao/bao-cao-cham-cong.service";
import {
  BankOutlined,
  CalendarOutlined,
  EyeOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  FormValues,
  TableTimekeepingProps,
  TableTimekeepingRef,
} from "../../_types/prop";
import TimekeepingDetailModal from "../TimekeepingDetailModal";
import "./TimekeepingTable.scss";

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
    const [quickSearchText] = useState<string | undefined>(undefined);

    const getMonthRange = (monthValue: any) => {
      const parsed = dayjs(monthValue, "MM/YYYY", true).isValid()
        ? dayjs(monthValue, "MM/YYYY")
        : dayjs(monthValue);
      return {
        startTime: parsed.startOf("month").toISOString(),
        endTime: parsed.endOf("month").toISOString(),
      };
    };

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(),
    }));

    const handleViewDetailCb = useCallback(
      async (record: TimekeepingReportData) => {
        try {
          const searchFilter: FilterQueryStringTypeItem[] = [];
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
      [filterRef, quickSearchText]
    );

    const fetchData = useCallback(async () => {
      setLoading(true);
      try {
        const searchFilter: FilterQueryStringTypeItem[] = [];
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
    }, [filterRef, quickSearchText]);

    // Load initial data
    useEffect(() => {
      fetchData();
    }, [fetchData, currentPage, pageSize]);

    const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedTimekeepingDetail([]);
      setSelectedUser(undefined);
    };

    // Main table columns
    const columns: ColumnsType<TimekeepingReportData> = [
      {
        title: "Nhân viên",
        dataIndex: "fullNameUser",
        key: "fullNameUser",
        width: 200,
        fixed: "left",
        render: (_, record) => (
          <div style={{ padding: "4px 0" }}>
            <div
              style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}
            >
              {record.fullNameUser}
            </div>
            <div
              style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}
            >
              {record.departmentName} - {record.positionName}
            </div>
          </div>
        ),
      },
      {
        title: "Tháng công",
        key: "month",
        width: 100,
        align: "center",
        render: () => {
          const filterValues: Partial<FormValues> =
            filterRef.current?.getFormValues() || {};
          const monthText = filterValues.month
            ? dayjs(filterValues.month).format("MM/YYYY")
            : "--";
          return (
            <div className="period-cell">
              <CalendarOutlined className="period-icon" />
              <span className="period-date">{monthText}</span>
            </div>
          );
        },
      },
      {
        title: "Công thực tế",
        dataIndex: "actualTimekeeping",
        key: "actualTimekeeping",
        width: 130,
        align: "center",
        render: (value: number, record) => (
          <div className="stat-cell">
            <span className="stat-value">{value}</span>
            <span className="stat-unit">
              / {record.monthStandardTimekeeping}
            </span>
          </div>
        ),
      },
      {
        title: "Giờ thực tế",
        dataIndex: "actualHour",
        key: "actualHour",
        width: 130,
        align: "center",
        render: (value: number, record) => (
          <div className="stat-cell">
            <span className="stat-value">{value.toFixed(1)}</span>
            <span className="stat-unit">
              / {record.monthStandardHour.toFixed(1)}h
            </span>
          </div>
        ),
      },
      {
        title: "Đi trễ",
        dataIndex: "lateNumber",
        key: "lateNumber",
        width: 90,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <span className="stat-value warning">{value}</span>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Về sớm",
        dataIndex: "earlyNumber",
        key: "earlyNumber",
        width: 90,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <span className="stat-value warning">{value}</span>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Nghỉ",
        dataIndex: "offWorkNumber",
        key: "offWorkNumber",
        width: 90,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <span className="stat-value">{value}</span>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Quên chấm",
        dataIndex: "forgetLogNumber",
        key: "forgetLogNumber",
        width: 110,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <span className="stat-value danger">{value}</span>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "OT thường",
        key: "normalOt",
        width: 130,
        align: "center",
        render: (_, record) => (
          <div className="stat-cell">
            {record.normalOtTimekeeping > 0 ? (
              <>
                <span className="stat-value purple">
                  {record.normalOtTimekeeping}
                </span>
                <span className="stat-unit">
                  {" "}
                  ({record.normalOtHour.toFixed(1)}h)
                </span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "OT ngày nghỉ",
        key: "offDayOt",
        width: 140,
        align: "center",
        render: (_, record) => (
          <div className="stat-cell">
            {record.offDayOtTimekeeping > 0 ? (
              <>
                <span className="stat-value purple">
                  {record.offDayOtTimekeeping}
                </span>
                <span className="stat-unit">
                  {" "}
                  ({record.offDayOtHour.toFixed(1)}h)
                </span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "OT lễ",
        key: "holidayOt",
        width: 130,
        align: "center",
        render: (_, record) => (
          <div className="stat-cell">
            {record.holidayOtTimekeeping > 0 ? (
              <>
                <span className="stat-value purple">
                  {record.holidayOtTimekeeping}
                </span>
                <span className="stat-unit">
                  {" "}
                  ({record.holidayOtHour.toFixed(1)}h)
                </span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Phạt đi trễ",
        dataIndex: "lateFine",
        key: "lateFine",
        width: 130,
        align: "right",
        render: (value: string) => {
          const numValue = parseFloat(value || "0");
          return (
            <div className="money-cell">
              {numValue > 0 ? (
                <span className="money-value danger">
                  {numValue.toLocaleString("vi-VN")}
                </span>
              ) : (
                <span className="empty-value">—</span>
              )}
            </div>
          );
        },
      },
      {
        title: "Phạt quên chấm",
        dataIndex: "forgetLogFine",
        key: "forgetLogFine",
        width: 140,
        align: "right",
        render: (value: string) => {
          const numValue = parseFloat(value || "0");
          return (
            <div className="money-cell">
              {numValue > 0 ? (
                <span className="money-value danger">
                  {numValue.toLocaleString("vi-VN")}
                </span>
              ) : (
                <span className="empty-value">—</span>
              )}
            </div>
          );
        },
      },
      {
        title: "Thao tác",
        key: "action",
        width: 120,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetailCb(record)}
            className="view-detail-btn"
          >
            Chi tiết
          </Button>
        ),
      },
    ];

    return (
      <div className="table-section">
        <TimekeepingDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          userName={selectedUser?.fullNameUser || ""}
          data={selectedTimekeepingDetail}
        />
        <div className="table-header">
          <span className="table-title">
            <BankOutlined />
            Danh sách báo cáo chấm công
          </span>
          <div className="table-actions">
            <Tag color="blue" icon={<RiseOutlined />}>
              Tổng: {totalItem} bản ghi
            </Tag>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={rowData}
          loading={loading}
          rowKey={(record) => record.userId}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItem,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1800 }}
          className="modern-timekeeping-table"
        />
      </div>
    );
  }
);

TimekeepingTable.displayName = "TimekeepingTable";

export default TimekeepingTable;
