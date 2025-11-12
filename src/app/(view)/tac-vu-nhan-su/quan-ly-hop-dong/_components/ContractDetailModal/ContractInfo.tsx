import Cbutton from "@/components/basicUI/Cbutton";
import { ContractDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import {
  Badge,
  Card,
  Descriptions,
  Divider,
  Tag,
  Typography,
  Upload,
  Modal,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaFilePdf,
  FaIdCard,
  FaMoneyBillWave,
  FaUpload,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const { Title, Text } = Typography;

interface ContractInfoProps {
  contract: ContractDetail;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  uploadLoading: boolean;
  onUploadPdf: (file: File) => void;
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  contract,
  getStatusColor,
  getStatusText,
  uploadLoading,
  onUploadPdf,
}) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };

  const formatDate = (dateString?: string | null, fallback = "N/A") => {
    if (!dateString) return fallback;
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

  const handleFileSelect = (file: File) => {
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewModalOpen(true);
  };

  const handleConfirmUpload = () => {
    if (previewFile) {
      onUploadPdf(previewFile);
      handleClosePreview();
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setPreviewFile(null);
  };

  return (
    <Card className="info-card">
      <div className="status-header">
        <Title level={4}>{contract.contractTypeName}</Title>
        <Tag color={getStatusColor(contract.status)}>
          {getStatusText(contract.status)}
        </Tag>
      </div>

      <Divider style={{ margin: "5px" }} />

      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item
          label={
            <span>
              <FaIdCard /> Số hợp đồng
            </span>
          }
        >
          <Text strong>{contract.contractNumber}</Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <FaBuilding /> Loại hợp đồng
            </span>
          }
        >
          {contract.contractTypeName}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <FaCalendarAlt /> Ngày bắt đầu
            </span>
          }
        >
          <Text type="success">{formatDate(contract.startDate)}</Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <span>
              <FaCalendarAlt /> Ngày kết thúc
            </span>
          }
        >
          <Text type="danger">
            {formatDate(contract.endDate, "Không có thời hạn kết thúc")}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="Thời hạn" span={2}>
          <Badge
            status="processing"
            text={calculateDuration(contract.duration)}
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
            {contract.grossSalary} VNĐ
          </Text>
        </Descriptions.Item>

        {contract.allowanceInfors && contract.allowanceInfors.length > 0 && (
          <Descriptions.Item label="Phụ cấp" span={2}>
            <div className="allowance-list">
              {contract.allowanceInfors.map((allowance) => (
                <Tag
                  key={allowance.allowanceId}
                  color="blue"
                  className="allowance-tag"
                >
                  {allowance.allowanceName}: {formatCurrency(allowance.value)}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Ngày tạo">
          {formatDateTime(contract.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày cập nhật">
          {formatDateTime(contract.updatedAt)}
        </Descriptions.Item>

        {contract.otpVerified && (
          <Descriptions.Item label="Xác thực OTP" span={2}>
            <Tag color="success">
              Đã xác thực {formatDateTime(contract.otpVerifiedAt)}
            </Tag>
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider orientation="left">File hợp đồng</Divider>
      {contract.fileContract ? (
        <div className="file-contract-section">
          <Cbutton
            icon={<FaFilePdf />}
            onClick={() => window.open(contract.fileContract!, "_blank")}
            customVariant="primary"
            size="large"
            style={{
              fontWeight: 700,
              fontSize: "17px",
            }}
          >
            Xem file PDF hợp đồng
          </Cbutton>
        </div>
      ) : (
        <div className="upload-contract-section">
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={(file) => {
              handleFileSelect(file as File);
              return false;
            }}
          >
            <Cbutton
              icon={<FaUpload />}
              loading={uploadLoading}
              size="large"
              style={{
                fontWeight: 700,
                fontSize: "17px",
              }}
            >
              Upload file PDF hợp đồng
            </Cbutton>
          </Upload>
        </div>
      )}

      {/* Modal xem trước PDF */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaFilePdf style={{ color: "#ff4d4f" }} />
            <span>Xem trước file PDF</span>
          </div>
        }
        open={previewModalOpen}
        onCancel={handleClosePreview}
        width="80%"
        style={{ top: 20 }}
        footer={[
          <Cbutton
            key="cancel"
            icon={<FaTimes />}
            onClick={handleClosePreview}
            origin={{
              bgcolor: "transparent",
              color: "#ff4d4f",
              hoverBgColor: "rgba(255, 77, 79, 0.1)",
              border: "2px solid #ff4d4f",
              hoverColor: "#ff4d4f",
            }}
            size="large"
            style={{
              fontWeight: 600,
            }}
          >
            Hủy
          </Cbutton>,
          <Cbutton
            key="confirm"
            icon={<FaCheck />}
            onClick={handleConfirmUpload}
            loading={uploadLoading}
            origin={{
              bgcolor: "#52c41a",
              color: "white",
              hoverBgColor: "#73d13d",
              border: "2px solid #52c41a",
            }}
            size="large"
            style={{
              fontWeight: 600,
            }}
          >
            Xác nhận upload
          </Cbutton>,
        ]}
      >
        {previewUrl && (
          <div style={{ height: "80vh" }}>
            <iframe
              src={previewUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="PDF Preview"
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ContractInfo;
