import {
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Modal, Row, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import ContractViewMode from "../ContractViewMode";
import { ContractHistoryModalProps } from "../types";
import "./styles.scss";
import { getStatusText } from "../utils";

const ContractHistoryModal: React.FC<ContractHistoryModalProps> = ({
  visible,
  onCancel,
  contractHistory,
  onViewDetail,
  view,
  selectedContract,
  onBackToHistory,
}) => {
  // Render contract history list
  const renderContractHistoryList = () => (
    <div className="history-list-container">
      {contractHistory.length > 0 ? (
        <Row gutter={[16, 16]}>
          {contractHistory.map((contract) => (
            <Col span={24} key={contract.id}>
              <Card hoverable className="contract-history-card">
                <div className="card-header">
                  <FileTextOutlined className="contract-icon" />
                  <span className="contract-title">{contract.title}</span>
                  <Tag
                    className={`status-tag status-${contract.status.toLowerCase()}`}
                  >
                    {getStatusText(contract.status)}
                  </Tag>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Mã hợp đồng:</span>
                    <span className="info-value highlight">
                      {contract.code}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Chức vụ:</span>
                    <span className="info-value">{contract.positionCode}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Thời gian:</span>
                    <span className="info-value">
                      {dayjs(contract.startTime).format("DD/MM/YYYY")} -{" "}
                      {dayjs(contract.endTime).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  <div className="info-row salary-row">
                    <span className="info-label">Lương cơ bản:</span>
                    <span className="info-value success">
                      {contract.baseSalary !== undefined
                        ? contract.baseSalary.toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </span>
                  </div>
                </div>

                <div className="card-action">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetail(contract)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-state">
          <FileTextOutlined className="empty-icon" />
          <p className="empty-text">Không có lịch sử hợp đồng</p>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      className={`contract-history-modal ${
        view === "detail" ? "detail-view" : ""
      }`}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {view === "history" ? (
            <>
              <HistoryOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <span>Lịch sử hợp đồng</span>
            </>
          ) : (
            <>
              <EyeOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
              <span>Chi tiết hợp đồng</span>
            </>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={view === "history" ? 900 : 800}
      footer={
        view === "history"
          ? [
              <Button key="close" onClick={onCancel}>
                Đóng
              </Button>,
            ]
          : [
              <Button key="back" onClick={onBackToHistory}>
                Quay lại
              </Button>,
              <Button key="close" onClick={onCancel}>
                Đóng
              </Button>,
            ]
      }
      centered
    >
      {view === "history"
        ? renderContractHistoryList()
        : selectedContract && (
            <ContractViewMode
              contract={selectedContract}
              onBack={onBackToHistory}
            />
          )}
    </Modal>
  );
};

export default ContractHistoryModal;
