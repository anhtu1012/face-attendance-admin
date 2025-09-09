import { BankOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import React from "react";
import { ContractViewModeProps } from "../types";
import { getPositionName, getStatusColor, getStatusText } from "../utils";
import "./styles.scss";

const ContractViewMode: React.FC<ContractViewModeProps> = ({
  contactData,
  contract,
  positions = [],
  onSwitchToEditMode,
}) => {
  const handleSwitchToEditMode = () => {
    if (onSwitchToEditMode) {
      onSwitchToEditMode();
    }
  };

  // Use contract data if provided, otherwise use contactData
  const data = contract || contactData;
  if (!data) {
    return <div>Không có dữ liệu hợp đồng</div>;
  }

  const displayBranchNames = (branchNames: string) => {
    if (!branchNames.includes(",")) {
      return (
        <Tag className="branch-tag" key={`${data.code || data.id}-single-branch`}>
          <BankOutlined />
          {data.branchNames || "Chưa xác định"}
        </Tag>
      );
    }

    return branchNames.split(",").map((branch, index) => (
      <Tag className="branch-tag" key={`${data.code || data.id}-branch-${index}-${branch.trim()}`}>
        <BankOutlined />
        {branch.trim() || "Chưa xác định"}
      </Tag>
    ));
  };
  return (
    <div className="contract-view-mode fade-in">
      <div className="contract-header">
        <div className="header-row">
          <h2>{data.title?.toUpperCase() || "Thông tin hợp đồng"}</h2>
          {onSwitchToEditMode && (
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={handleSwitchToEditMode}
              className="edit-icon-btn"
              title="Chỉnh sửa hợp đồng"
            />
          )}
        </div>
        <p>Mã hợp đồng: {data.code}</p>
      </div>

      <div className="employee-section">
        <div className="section-title">Thông tin nhân viên</div>
        <Row gutter={[20, 16]}>
          <Col span={12}>
            <div className="info-item">
              <div className="label">Họ và tên</div>
              <div className="value employee-name">
                {data.fullName || "Chưa xác định"}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Chức vụ</div>
              <div className="value position">
                {contract
                  ? data.positionCode
                  : getPositionName(data.positionCode, positions)}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Ngày bắt đầu</div>
              <div className="value date">
                {dayjs(data.startTime).format("DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Ngày kết thúc</div>
              <div className="value date">
                {dayjs(data.endTime).format("DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Thời hạn</div>
              <div className="value duration">
                {data.duration || "Không xác định"}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Quản lý bởi</div>
              <div className="value manager">
                {data.fullNameManager || "Chưa có quản lý"}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="contract-details-section">
        <div className="section-title">Chi tiết hợp đồng</div>
        <Row gutter={[20, 16]}>
          <Col span={12}>
            <div className="info-item salary-highlight">
              <div className="label">Lương cơ bản</div>
              <div className="value salary">
                {data.baseSalary
                  ? `${data.baseSalary.toLocaleString()} VND`
                  : "Chưa xác định"}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div className="info-item">
              <div className="label">Trạng thái</div>
              <div className="value">
                {contract ? (
                  <Tag
                    color={getStatusColor(data.status)}
                    className="status-tag"
                  >
                    {getStatusText(data.status)}
                  </Tag>
                ) : (
                  <Tag className="status-tag status-active">
                    {getStatusText(data.status)}
                  </Tag>
                )}
              </div>
            </div>
          </Col>

          <Col span={24}>
            <div className="info-item">
              <div className="label">Chi nhánh làm việc</div>
              <div className="value">
                {displayBranchNames(data.branchNames) || "Chưa xác định"}
              </div>
            </div>
          </Col>

          <Col span={24}>
            <div className="info-item">
              <div className="label">Mô tả</div>
              <div className="description-box">
                {data.description || "Không có mô tả"}
              </div>
            </div>
          </Col>

          {/* {data.contractPdf && (
            <Col span={24}>
              <div className="info-item pdf-button">
                <div className="label">Tệp hợp đồng</div>
                <div className="value">
                  <Button
                    type="link"
                    icon={<FileOutlined />}
                    onClick={() =>
                      data.contractPdf &&
                      window.open(data.contractPdf, "_blank")
                    }
                  >
                    Xem hợp đồng
                  </Button>
                </div>
              </div>
            </Col>
          )} */}

          <Col span={24}>
            <div className="info-item">
              <div className="label">Ghi chú</div>
              <div className="description-box">
                {data.note || "Chưa xác định"}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContractViewMode;
