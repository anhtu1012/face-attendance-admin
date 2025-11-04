import Cbutton from "@/components/basicUI/Cbutton";
import { AppendixDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/appendix/appendix.dto";
import {
  Badge,
  Card,
  Descriptions,
  Divider,
  Modal,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaFileContract,
  FaFilePdf,
  FaIdCard,
  FaMoneyBillWave,
} from "react-icons/fa";

const { Title, Text } = Typography;

interface AppendixDetailModalProps {
  open: boolean;
  onClose: () => void;
  appendix: AppendixDetail | null;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppendixDetailModal: React.FC<AppendixDetailModalProps> = ({
  open,
  onClose,
  appendix,
  getStatusColor,
  getStatusText,
}) => {
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const calculateDuration = (minutes: string) => {
    const mins = parseInt(minutes);
    const minutesPerDay = 1440;
    const daysPerMonth = 30.4167;

    const totalDays = Math.floor(mins / minutesPerDay);

    if (totalDays >= 1) {
      let months = Math.floor(totalDays / daysPerMonth);
      let days = Math.round(totalDays - months * daysPerMonth);

      const roundedDaysPerMonth = Math.round(daysPerMonth);
      if (days >= roundedDaysPerMonth) {
        months += 1;
        days = 0;
      }

      months = Math.max(0, months);
      days = Math.max(0, days);

      if (months > 0) {
        return `${months} tháng${days > 0 ? ` ${days} ngày` : ""}`;
      }
      return `${totalDays} ngày`;
    }

    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} giờ${remainingMins > 0 ? ` ${remainingMins} phút` : ""}`;
    }

    return `${mins} phút`;
  };

  if (!appendix) return null;

  return (
    <Modal
      title={
        <div className="modal-header">
          <FaFileContract className="modal-header-icon" />
          <span>Chi tiết phụ lục hợp đồng</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Cbutton
          onClick={onClose}
          size="large"
          origin={{
            bgcolor: "transparent",
            color: "rgb(13, 71, 161)",
            hoverBgColor:
              "linear-gradient(45deg, rgba(13, 71, 161, 0.15), rgba(30, 136, 229, 0.15), rgba(13, 71, 161, 0.15))",
            border: "2px solid rgb(13, 71, 161)",
            hoverColor: "rgb(13, 71, 161)",
          }}
          style={{
            fontWeight: 600,
            boxShadow: "0 3px 10px rgba(13, 71, 161, 0.15)",
          }}
        >
          Đóng
        </Cbutton>
      }
      width={900}
      className="contract-detail-modal appendix-modal"
    >
      <Card className="info-card">
        <div className="status-header">
          <Title level={4}>{appendix.contractTypeName}</Title>
          <Tag color={getStatusColor(appendix.status)}>
            {getStatusText(appendix.status)}
          </Tag>
        </div>

        <Divider />

        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item
            label={
              <span>
                <FaIdCard /> Số phụ lục
              </span>
            }
          >
            <Text strong>{appendix.contractNumber}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <FaBuilding /> Loại phụ lục
              </span>
            }
          >
            {appendix.contractTypeName}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <FaCalendarAlt /> Ngày bắt đầu
              </span>
            }
          >
            <Text type="success">{formatDate(appendix.startDate)}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <FaCalendarAlt /> Ngày kết thúc
              </span>
            }
          >
            <Text type="danger">
              {formatDate(appendix.endDate) || " Không thời hạn"}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Thời hạn" span={2}>
            <Badge
              status="processing"
              text={calculateDuration(appendix.duration)}
            />
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <FaMoneyBillWave /> Lương Gross
              </span>
            }
            span={2}
          >
            <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
              {formatCurrency(appendix.grossSalary)}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo" span={2}>
            {formatDateTime(appendix.createdAt)}
          </Descriptions.Item>
        </Descriptions>

        {appendix.fileContract && (
          <>
            <Divider orientation="left">File phụ lục</Divider>
            <div className="file-contract-section">
              <Cbutton
                icon={<FaFilePdf />}
                onClick={() => window.open(appendix.fileContract!, "_blank")}
                customVariant="primary"
                size="large"
                style={{
                  fontWeight: 700,
                  fontSize: "17px",
                }}
              >
                Xem file PDF phụ lục
              </Cbutton>
            </div>
          </>
        )}
      </Card>
    </Modal>
  );
};

export default AppendixDetailModal;
