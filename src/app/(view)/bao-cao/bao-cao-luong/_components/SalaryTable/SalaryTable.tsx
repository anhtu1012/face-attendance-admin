"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { SalaryReportItem } from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import { DailySalaryDetail } from "@/dtos/bao-cao/bao-cao-luong/daily-salary-detail.dto";
import BaoCaoSalaryServices from "@/services/bao-cao/bao-cao-luong.service";
import { formatCurrency } from "@/utils/client/formatCurrency";
import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  DownOutlined,
  RightOutlined,
  RiseOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { Button, Table, Tag, message } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  TableSalaryProps,
  TableSalaryRef,
} from "../../_types/prop";
import "./SalaryTable.scss";

const defaultPageSize = 20;

const SalaryTable = forwardRef<TableSalaryRef, TableSalaryProps>(
  ({ filterRef }, ref) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItem, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState<SalaryReportItem[]>([]);
    const [dailyDetails, setDailyDetails] = useState<
      Record<string, DailySalaryDetail[]>
    >({});
    const [loadingDetails, setLoadingDetails] = useState<
      Record<string, boolean>
    >({});
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [exportLoading, setExportLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      refetch: () => fetchData(1, pageSize),
    }));

    const fetchData = useCallback(
      async (currentPage: number, pageSize: number) => {
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
              ? { month: dayjs(filterValues.month).format("MM") }
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
            undefined,
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

    // Load initial data
    useEffect(() => {
      fetchData(currentPage, pageSize);
    }, [fetchData, currentPage, pageSize]);

    // Fetch chi tiết lương theo ngày khi expand row
    const fetchDailyDetails = async (
      monthKey: string,
      record: SalaryReportItem
    ) => {
      if (dailyDetails[monthKey]) {
        return;
      }

      setLoadingDetails((prev) => ({ ...prev, [monthKey]: true }));
      try {
        let monthDate = dayjs(record.date);
        const parts = String(record.date).split("/");
        if (parts.length === 2) {
          const m = parseInt(parts[0], 10);
          const y = parseInt(parts[1], 10);
          if (!Number.isNaN(m) && !Number.isNaN(y)) {
            monthDate = dayjs(new Date(y, m - 1, 1));
          }
        }

        const param = {
          userId: record.userId,
          fromDate: monthDate.startOf("month").toISOString(),
          toDate: monthDate.endOf("month").toISOString(),
        };
        const response = await BaoCaoSalaryServices.getMonthlySalaryDetail(
          param
        );
        setDailyDetails((prev) => ({
          ...prev,
          [monthKey]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching daily details:", error);
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [monthKey]: false }));
      }
    };

    const handleExpand = (expanded: boolean, record: SalaryReportItem) => {
      const monthKey = `${record.userId}-${record.date}`;
      if (expanded) {
        setExpandedRowKeys([...expandedRowKeys, monthKey]);
        fetchDailyDetails(monthKey, record);
      } else {
        setExpandedRowKeys(expandedRowKeys.filter((key) => key !== monthKey));
      }
    };

    // Export to Excel with beautiful formatting
    const handleExportExcel = async () => {
      setExportLoading(true);
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Báo cáo lương");

        // Title row
        worksheet.mergeCells("A1:N1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = "BÁO CÁO LƯƠNG NHÂN VIÊN";
        titleCell.font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
        titleCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1565C0" },
        };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 40;

        // Info row
        worksheet.mergeCells("A2:N2");
        const infoCell = worksheet.getCell("A2");
        const filterValues: Partial<FormValues> =
          filterRef.current?.getFormValues() || {};
        const monthText = filterValues.month
          ? dayjs(filterValues.month).format("MM/YYYY")
          : "Tất cả";
        infoCell.value = `Kỳ lương: ${monthText} | Ngày xuất: ${dayjs().format(
          "DD/MM/YYYY HH:mm"
        )}`;
        infoCell.font = { size: 11, italic: true };
        infoCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(2).height = 25;

        // Empty row
        worksheet.addRow([]);

        // Header row
        const headerRow = worksheet.addRow([
          "STT",
          "Nhân viên",
          "Phòng ban",
          "Kỳ lương",
          "Trạng thái",
          "Lương cơ bản",
          "Lương công",
          "Lương OT",
          "Phụ cấp",
          "Tổng phạt",
          "Giờ công",
          "Ngày công",
          "Đi trễ",
          "Tổng thực nhận",
        ]);

        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF42A5F5" },
          };
          cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        headerRow.height = 30;

        // Fetch full data for export (no limit/offset filters)
        const filterValuesExport: Partial<FormValues> =
          filterRef.current?.getFormValues() || {};
        const paramsExport = {
          ...(filterValuesExport.month
            ? { year: dayjs(filterValuesExport.month).format("YYYY") }
            : {}),
          ...(filterValuesExport.month
            ? { month: dayjs(filterValuesExport.month).format("MM") }
            : {}),
          ...(filterValuesExport.departmentId
            ? { departmentId: filterValuesExport.departmentId }
            : {}),
          ...(filterValuesExport.positionId
            ? { positionId: filterValuesExport.positionId }
            : {}),
        };

        const searchFilterExport: FilterQueryStringTypeItem[] = [];
        const exportRes = await BaoCaoSalaryServices.getSalaryReport(
          searchFilterExport,
          undefined,
          paramsExport
        );
        const exportData: SalaryReportItem[] = exportRes.data || [];

        // Data rows
        exportData.forEach((record, index) => {
          const statusText =
            record.status === "PAID"
              ? "Đã gửi bảng lương"
              : record.status === "STOP"
              ? "Tạm dừng"
              : "Đang trong tháng";

          const row = worksheet.addRow([
            index + 1,
            record.fullNameUser,
            record.departmentName,
            record.date,
            statusText,
            Number(record.grossSalary ?? 0),
            Number(record.workSalary ?? 0),
            Number(record.otSalary ?? 0),
            Number(record.totalAllowance ?? 0),
            Number(record.totalFine ?? 0),
            Number(Number(record.totalWorkHour ?? 0).toFixed(1)),
            Number(record.totalWorkDay ?? 0),
            Number(record.lateCount ?? 0),
            Number(record.totalSalary ?? 0),
          ]);

          row.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // Align and format numeric columns
            // Currency columns: 6(gross),7(workSalary),8(ot),9(allow),10(fine),14(total)
            if (
              colNumber === 6 ||
              (colNumber >= 7 && colNumber <= 10) ||
              colNumber === 14
            ) {
              cell.alignment = { horizontal: "right", vertical: "middle" };
              cell.numFmt = "#,##0";
            } else if (colNumber === 11) {
              // totalWorkHour as numeric with one decimal
              cell.alignment = { horizontal: "right", vertical: "middle" };
              cell.numFmt = "0.0";
            } else if (colNumber === 1 || colNumber === 5) {
              cell.alignment = { horizontal: "center", vertical: "middle" };
            } else {
              cell.alignment = { vertical: "middle" };
            }

            // Zebra striping
            if (index % 2 === 0) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF8FAFC" },
              };
            }
          });

          // Highlight total salary column
          const totalCell = row.getCell(14);
          totalCell.font = { bold: true, color: { argb: "FF1E40AF" } };
          totalCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDBEAFE" },
          };
        });

        // Column widths
        worksheet.columns = [
          { key: "stt", width: 8 },
          { key: "name", width: 25 },
          { key: "dept", width: 35 },
          { key: "month", width: 12 },
          { key: "status", width: 25 },
          { key: "base", width: 15 },
          { key: "work", width: 15 },
          { key: "ot", width: 15 },
          { key: "allow", width: 15 },
          { key: "fine", width: 15 },
          { key: "hour", width: 12 },
          { key: "day", width: 12 },
          { key: "late", width: 10 },
          { key: "total", width: 18 },
        ];

        // Export
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Bao-cao-luong_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
        message.success("Xuất Excel thành công!");
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        message.error("Xuất Excel thất bại!");
      } finally {
        setExportLoading(false);
      }
    };

    // Daily details columns
    const dailyColumns: ColumnsType<DailySalaryDetail> = [
      {
        title: "Ngày",
        dataIndex: "date",
        key: "date",
        width: 100,
        align: "center",
        render: (date: string) => {
          const dayObj = dayjs(date);
          const dayOfWeek = dayObj.format("ddd");
          const isWeekend = dayObj.day() === 0 || dayObj.day() === 6;

          return (
            <div className="date-cell">
              <div className="day-number">{dayObj.format("DD")}</div>
              <div
                className="day-name"
                style={{ color: isWeekend ? "#ef4444" : "#64748b" }}
              >
                {dayOfWeek}
              </div>
            </div>
          );
        },
      },
      {
        title: "Lương công",
        dataIndex: "workSalary",
        key: "workSalary",
        width: 130,
        align: "right",
        render: (value: number) => (
          <span className="salary-value primary">
            {value > 0 ? (
              formatCurrency(value)
            ) : (
              <span className="empty-value">—</span>
            )}
          </span>
        ),
      },
      {
        title: "Lương OT",
        dataIndex: "otSalary",
        key: "otSalary",
        width: 130,
        align: "right",
        render: (value: number) => (
          <span className="salary-value purple">
            {value > 0 ? (
              formatCurrency(value)
            ) : (
              <span className="empty-value">—</span>
            )}
          </span>
        ),
      },
      {
        title: "Phạt",
        dataIndex: "totalFine",
        key: "totalFine",
        width: 130,
        align: "right",
        render: (value: number) => (
          <span className="salary-value danger">
            {value > 0 ? (
              `-${formatCurrency(value)}`
            ) : (
              <span className="empty-value">—</span>
            )}
          </span>
        ),
      },
      {
        title: "Hệ số",
        dataIndex: "ratio",
        key: "ratio",
        width: 100,
        align: "center",
        render: (value: string) => {
          const coefValue = parseFloat(value || "1");
          let colorClass = "normal";
          if (coefValue >= 3) colorClass = "holiday";
          else if (coefValue >= 2) colorClass = "high";
          else if (coefValue > 1) colorClass = "medium";

          return (
            <span className={`coef-tag ${colorClass}`}>x{value || "1"}</span>
          );
        },
      },
      {
        title: "Tổng",
        dataIndex: "totalSalary",
        key: "totalSalary",
        width: 150,
        align: "right",
        render: (value: number) => (
          <div className="total-cell">
            <DollarOutlined className="total-icon" />
            <span className="total-value">{formatCurrency(value)}</span>
          </div>
        ),
      },
    ];

    // Main table columns
    const columns: ColumnsType<SalaryReportItem> = [
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
        title: "Kỳ lương",
        dataIndex: "date",
        key: "date",
        width: 100,
        align: "center",
        render: (date: string) => (
          <div className="period-cell">
            <CalendarOutlined className="period-icon" />
            <span className="period-date">{date}</span>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center",
        render: (status: string) => {
          const statusConfig = {
            PAID: {
              color: "#10b981",
              bg: "#d1fae5",
              text: "Đã gửi bảng lương",
              icon: <CheckCircleOutlined />,
            },
            STOP: {
              color: "#ef4444",
              bg: "#fee2e2",
              text: "Tạm dừng",
              icon: <WarningOutlined />,
            },
            CALCULATED: {
              color: "#f59e0b",
              bg: "#fef3c7",
              text: "Đang trong tháng",
              icon: <ClockCircleOutlined />,
            },
          };
          const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.CALCULATED;
          return (
            <span
              className="period-status"
              style={{
                background: config.bg,
                color: config.color,
              }}
            >
              {config.icon} {config.text}
            </span>
          );
        },
      },
      {
        title: "Lương cơ bản",
        dataIndex: "grossSalary",
        key: "grossSalary",
        width: 150,
        align: "right",
        render: (value: number) => (
          <div className="money-cell">
            <span className="money-value primary">{formatCurrency(value)}</span>
          </div>
        ),
      },
      {
        title: "Lương công",
        dataIndex: "workSalary",
        key: "workSalary",
        width: 150,
        align: "right",
        render: (value: number) => (
          <div className="money-cell">
            <span className="money-value info">{formatCurrency(value)}</span>
          </div>
        ),
      },
      {
        title: "Lương OT",
        dataIndex: "otSalary",
        key: "otSalary",
        width: 150,
        align: "right",
        render: (value: number) => (
          <div className="money-cell">
            <span className={`money-value ${value > 0 ? "purple" : ""}`}>
              {value > 0 ? (
                formatCurrency(value)
              ) : (
                <span className="empty-value">—</span>
              )}
            </span>
          </div>
        ),
      },
      {
        title: "Phụ cấp",
        dataIndex: "totalAllowance",
        key: "totalAllowance",
        width: 150,
        align: "right",
        render: (value: number) => (
          <div className="money-cell">
            <span className="money-value success">{formatCurrency(value)}</span>
          </div>
        ),
      },
      {
        title: "Tổng phạt",
        dataIndex: "totalFine",
        key: "totalFine",
        width: 130,
        align: "right",
        render: (value: number) => (
          <div className="money-cell">
            <span className={`money-value ${value > 0 ? "danger" : ""}`}>
              {value > 0 ? (
                `-${formatCurrency(value)}`
              ) : (
                <span className="empty-value">—</span>
              )}
            </span>
          </div>
        ),
      },
      {
        title: "Tổng giờ làm",
        dataIndex: "totalWorkHour",
        key: "totalWorkHour",
        width: 140,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <>
                <span className="stat-value">{value.toFixed(1)}</span>
                <span className="stat-unit">giờ</span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Tổng ngày làm",
        dataIndex: "totalWorkDay",
        key: "totalWorkDay",
        width: 140,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <>
                <span className="stat-value">{value}</span>
                <span className="stat-unit">ngày</span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Đi trễ",
        dataIndex: "lateCount",
        key: "lateCount",
        width: 110,
        align: "center",
        render: (value: number) => (
          <div className="stat-cell">
            {value > 0 ? (
              <>
                <span className="stat-value warning">{value}</span>
                <span className="stat-unit">lần</span>
              </>
            ) : (
              <span className="empty-value">—</span>
            )}
          </div>
        ),
      },
      {
        title: "Tổng lương",
        dataIndex: "totalSalary",
        key: "totalSalary",
        width: 180,
        align: "right",
        fixed: "right",
        render: (value: number) => (
          <div className="total-cell">
            <TrophyOutlined className="total-icon" />
            <span className="total-value">{formatCurrency(value)}</span>
          </div>
        ),
      },
    ];

    const expandedRowRender = (record: SalaryReportItem) => {
      const monthKey = `${record.userId}-${record.date}`;
      const details = dailyDetails[monthKey] || [];
      const isLoading = loadingDetails[monthKey];

      return (
        <div className="expanded-content">
          <div className="expanded-header">
            <CalendarOutlined />
            <span>Chi tiết lương theo ngày - {record.fullNameUser}</span>
          </div>
          <Table
            columns={dailyColumns}
            dataSource={details}
            loading={isLoading}
            rowKey="date"
            pagination={false}
            size="small"
            className="daily-details-table"
            scroll={{ x: 800 }}
          />
        </div>
      );
    };

    return (
      <div className="table-section">
        <div className="table-header">
          <span className="table-title">
            <BankOutlined />
            Danh sách báo cáo lương theo chấm công
          </span>
          <div className="table-actions">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
              loading={exportLoading}
              className="export-button"
            >
              Xuất Excel
            </Button>
            <Tag color="blue" icon={<RiseOutlined />}>
              Tổng: {totalItem} bản ghi
            </Tag>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={rowData}
          loading={loading}
          rowKey={(record) => `${record.userId}-${record.date}`}
          expandable={{
            expandedRowRender,
            onExpand: handleExpand,
            expandedRowKeys,
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                size="small"
                icon={expanded ? <DownOutlined /> : <RightOutlined />}
                onClick={(e) => onExpand(record, e)}
                className="expand-btn"
              />
            ),
          }}
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
              fetchData(page, size);
            },
          }}
          scroll={{ x: 1000, y: 600 }}
          className="modern-salary-table"
        />
      </div>
    );
  }
);

SalaryTable.displayName = "SalaryTable";

export default SalaryTable;
