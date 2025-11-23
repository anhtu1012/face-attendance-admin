import { ExtendedColDef } from "@/components/basicUI/cTableAG/interface/agProps";
import { SalaryReportItem } from "@/dtos/bao-cao/bao-cao-luong/bao-cao-luong.response.dto";
import { formatCurrency } from "@/utils/client/formatCurrency";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
export const getSalaryTableColumn = (): ExtendedColDef[] => {
  return [
    {
      headerName: "Nhân viên",
      field: "fullNameUser",
      pinned: "left",
      width: 200,
      editable: false,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: "16px" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <div style={{ padding: "10px 0" }}>
            <div style={{ fontWeight: 600, fontSize: "13px" }}>
              {params.data.fullNameUser}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "11px" }}>
              {params.data.departmentName} - {params.data.positionName}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Tháng",
      field: "date",
      width: 130,
      editable: false,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: "16px" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <Tooltip title={`Kỳ lương tháng ${params.data.date}`}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontWeight: 700, color: "#1565c0", fontSize: "15px" }}
              >
                {params.data.date}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: `${
                    params.data.status === "PAID"
                      ? "#0d5802ff"
                      : params.data.status === "STOP"
                      ? "#be0404ff"
                      : "#c07e04ff"
                  }`,
                  fontWeight: 600,
                }}
              >
                {params.data.status === "PAID"
                  ? "Đã trả"
                  : params.data.status === "STOP"
                  ? "Tạm dừng"
                  : "Đang tính"}
              </div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Tổng lương",
      field: "totalSalary",
      width: 150,
      editable: false,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: "16px" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <Tooltip
            title={
              <div>
                <div>Tổng cộng: {formatCurrency(params.data.workSalary)}</div>
                <div>Thực nhận: {formatCurrency(params.data.totalSalary)}</div>
              </div>
            }
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "17px",
                  color: "#0d47a1",
                  textAlign: "center",
                }}
              >
                {params.data.workSalary > 0
                  ? formatCurrency(params.data.totalSalary)
                  : "--"}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#f44336",
                  fontWeight: 600,
                }}
              >
                Thực nhận: {formatCurrency(params.data.totalSalary)}
              </div>
            </div>
          </Tooltip>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.totalSalary;
      },
    },
    {
      headerName: "Lương cơ bản",
      field: "grossSalary",
      width: 150,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <Tooltip title="Lương cơ bản">
            <span
              style={{ fontWeight: 600, fontSize: "14px", color: "#0288d1" }}
            >
              {formatCurrency(params.data?.grossSalary || 0)}
            </span>
          </Tooltip>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.grossSalary;
      },
    },
    {
      headerName: "Phụ cấp",
      field: "totalAllowance",
      width: 150,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <Tooltip title="Phụ cấp">
            <span
              style={{ fontWeight: 600, fontSize: "14px", color: "#0288d1" }}
            >
              {formatCurrency(params.data?.totalAllowance || 0)}
            </span>
          </Tooltip>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.totalAllowance;
      },
    },
    {
      headerName: "Lương OT",
      field: "otSalary",
      width: 140,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;

        return (
          <Tooltip title="Lương làm thêm giờ">
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#722ed1",
                padding: "4px 10px",
                background:
                  params.data.otSalary > 0
                    ? "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)"
                    : "transparent",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              {formatCurrency(params.data.otSalary)}
            </div>
          </Tooltip>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.otSalary;
      },
    },
    {
      headerName: "Tổng phạt",
      field: "totalFine",
      width: 140,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        return (
          <Tooltip
            title={`Tiền phạt: ${formatCurrency(params.data.totalFine)}`}
          >
            <Tag
              icon={<FallOutlined />}
              color="error"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              -{formatCurrency(params.data.totalFine)}
            </Tag>
          </Tooltip>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.totalFine;
      },
    },
    {
      headerName: "Tổng giờ làm",
      field: "totalWorkHour",
      width: 170,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        const value = params.data.totalWorkHour;
        return value > 0 ? (
          <Tooltip title={`Tổng: ${value} giờ`}>
            <Tag
              icon={<RiseOutlined />}
              color="success"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value.toFixed(2)} giờ
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.totalWorkHour;
      },
    },
    {
      headerName: "Tổng ngày làm",
      field: "totalWorkDay",
      width: 170,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        const value = params.data.totalWorkDay;
        return value > 0 ? (
          <Tooltip title={`Tổng: ${value} ngày`}>
            <Tag
              icon={<RiseOutlined />}
              color="success"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value} ngày
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.totalWorkDay;
      },
    },
    {
      headerName: "Tổng số lần đi trễ",
      field: "lateCount",
      width: 170,
      editable: false,
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return null;
        const value = params.data.lateCount;
        return value > 0 ? (
          <Tooltip title={`Số lần đi trễ: ${value}`}>
            <Tag
              icon={<RiseOutlined />}
              color="error"
              style={{ fontWeight: 700, fontSize: "14px", padding: "6px 14px" }}
            >
              {value} lần
            </Tag>
          </Tooltip>
        ) : (
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
        );
      },
      valueGetter: (params: { data?: SalaryReportItem }) => {
        if (!params.data) return "";
        return params.data.lateCount;
      },
    },
  ];
};
