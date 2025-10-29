import Cbutton from "@/components/basicUI/Cbutton";
import { ContractDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import {
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Row,
  Tag,
  Typography,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaFilePdf,
  FaIdCard,
  FaMoneyBillWave,
  FaUpload,
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
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
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
          <Text type="danger">{formatDate(contract.endDate)}</Text>
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
            {formatCurrency(contract.grossSalary)}
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
              onUploadPdf(file as File);
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

      {(contract.userSignature || contract.directorSignature) && (
        <>
          <Divider orientation="left">Chữ ký</Divider>
          <Row gutter={[24, 24]}>
            {contract.userSignature && (
              <Col span={12}>
                <Card title="Chữ ký nhân viên" className="signature-card">
                  <Image
                    src={contract.userSignature}
                    alt="User Signature"
                    className="signature-image"
                  />
                </Card>
              </Col>
            )}
            {contract.directorSignature && (
              <Col span={12}>
                <Card title="Chữ ký giám đốc" className="signature-card">
                  <Image
                    src={contract.directorSignature}
                    alt="Director Signature"
                    className="signature-image"
                  />
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </Card>
  );
};

export default ContractInfo;
