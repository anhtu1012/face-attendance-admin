import Cbutton from "@/components/basicUI/Cbutton";
import { Card, List, Tag, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import "./ContractDetailModal.scss";
import {
  FaCalendarAlt,
  FaFileContract,
  FaFilePdf,
  FaIdCard,
  FaMoneyBillWave,
  FaEye,
} from "react-icons/fa";
import { AppendixData } from "./types";

const { Text } = Typography;

interface AppendixListProps {
  appendices: AppendixData[];
  onViewDetail: (appendixId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppendixList: React.FC<AppendixListProps> = ({
  appendices,
  onViewDetail,
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

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <Card className="info-card appendix-card">
      <List
        dataSource={appendices}
        renderItem={(appendix, index) => (
          <List.Item
            key={appendix.id}
            className="appendix-item"
            actions={[
              <Cbutton
                key="view"
                icon={<FaEye />}
                size="middle"
                onClick={() => onViewDetail(appendix.id)}
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
                Xem chi tiết
              </Cbutton>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <div className="appendix-number">
                  <FaFileContract size={24} />
                  <Text strong>#{index + 1}</Text>
                </div>
              }
              title={
                <div className="appendix-title">
                  <Text strong style={{ fontSize: "16px" }}>
                    {appendix.contractTypeName}
                  </Text>
                  <Tag color={getStatusColor(appendix.status)}>
                    {getStatusText(appendix.status)}
                  </Tag>
                </div>
              }
              description={
                <div className="appendix-info">
                  <div className="info-row">
                    <FaIdCard className="info-icon" />
                    <Text>Số HĐ: {appendix.contractNumber}</Text>
                  </div>
                  <div className="info-row">
                    <FaCalendarAlt className="info-icon" />
                    <Text>
                      {formatDate(appendix.startDate)} →{" "}
                      {formatDate(appendix.endDate)}
                    </Text>
                  </div>
                  <div className="info-row">
                    <FaMoneyBillWave className="info-icon" />
                    <Text strong style={{ color: "#52c41a" }}>
                      {formatCurrency(appendix.grossSalary)}
                    </Text>
                  </div>
                  {appendix.fileContract && (
                    <div className="info-row">
                      <FaFilePdf className="info-icon" />
                      <a
                        href={appendix.fileContract}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem file PDF
                      </a>
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AppendixList;
