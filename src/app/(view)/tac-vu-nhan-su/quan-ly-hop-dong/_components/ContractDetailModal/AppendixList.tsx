import Cbutton from "@/components/basicUI/Cbutton";
import { List, Tag, Typography } from "antd";
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
    <div className="appendix-list-container">
      <List
        dataSource={appendices}
        renderItem={(appendix, index) => (
          <div key={appendix.id} className="appendix-card">
            <div className="appendix-card-main">
              <div className="appendix-left">
                <div className="appendix-number-badge">
                  <FaFileContract size={16} />
                  <Text strong>#{index + 1}</Text>
                </div>
              </div>

              <div className="appendix-center">
                <div className="appendix-title-row">
                  <Text strong className="contract-type">
                    {appendix.contractTypeName}
                  </Text>
                  <Tag
                    color={getStatusColor(appendix.status)}
                    className="status-tag"
                  >
                    {getStatusText(appendix.status)}
                  </Tag>
                </div>

                <div className="info-row-compact">
                  <div className="info-item-inline">
                    <FaIdCard className="info-icon" />
                    <Text>{appendix.contractNumber}</Text>
                  </div>
                  <div className="info-item-inline">
                    <FaCalendarAlt className="info-icon" />
                    <Text>
                      {formatDate(appendix.startDate)} →{" "}
                      {formatDate(appendix.endDate)}
                    </Text>
                  </div>
                  <div className="info-item-inline">
                    <FaMoneyBillWave className="info-icon" />
                    <Text strong className="salary-text">
                      {formatCurrency(appendix.grossSalary)}
                    </Text>
                  </div>
                  {appendix.fileContract && (
                    <div className="info-item-inline">
                      <FaFilePdf className="info-icon" />
                      <a
                        href={appendix.fileContract}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="appendix-right">
                <Cbutton
                  icon={<FaEye />}
                  size="middle"
                  onClick={() => onViewDetail(appendix.id)}
                  origin={{
                    bgcolor:
                      "linear-gradient(45deg, rgb(21, 101, 192), rgb(66, 165, 245), rgb(21, 101, 192), rgb(66, 165, 245))",
                    color: "#0889f1ff",
                    hoverBgColor:
                      "linear-gradient(45deg, rgb(21, 101, 192), rgb(66, 165, 245), rgb(21, 101, 192))",
                    border: "none",
                    hoverColor: "#fff",
                  }}
                  style={{
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)",
                    padding: "8px 20px",
                    height: "auto",
                  }}
                >
                  Xem chi tiết
                </Cbutton>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default AppendixList;
