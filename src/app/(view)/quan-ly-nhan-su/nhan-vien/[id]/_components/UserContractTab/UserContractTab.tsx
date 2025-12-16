/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Spin,
  Tag,
  Timeline,
} from "antd";
import dayjs from "dayjs";
import "./UserContractTab.scss";
import { UserContractItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { useCallback, useEffect, useState } from "react";
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";
import { getDurationYMDLabel } from "@/utils/client/getDurationYMDLabel";
import { AppendixDetail } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/appendix/appendix.dto";

interface UserContractTabProps {
  userId: string;
}

function UserContractTab({ userId }: UserContractTabProps) {
  const [contractData, setContractData] = useState<UserContractItem>();
  const [historyData, setHistoryData] = useState<UserContractItem[]>([]);
  const [appendixData, setAppendixData] = useState<AppendixDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const formatDate = (date: string | null) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "N/A";
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        userId,
      };
      const response = await QuanLyHopDongServices.getQuanLyHopDong(
        [],
        undefined,
        params
      );

      setHistoryData(response.data);
      // kiểm tra response.data , chỉ lấy tk nào không có status là  EXPIRED  , INACTIVE
      const excludedStatuses = ["EXPIRED", "INACTIVE"];
      const activeContracts = response.data.filter(
        (contract: any) => !excludedStatuses.includes(contract.status as string)
      );
      const responsePhuLuc = await QuanLyHopDongServices.getPhuLucHopDong(
        [],
        undefined,
        { userContractId: activeContracts[0]?.id }
      );
      setAppendixData(responsePhuLuc.data);
      setContractData(
        activeContracts.length > 0 ? activeContracts[0] : response.data[0]
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: any }
    > = {
      ACTIVE: {
        color: "success",
        text: "Đang hiệu lực",
        icon: <CheckCircleOutlined />,
      },
      ACTIVE_EXTENDED: {
        color: "processing",
        text: "Đang hiệu lực (Gia hạn)",
        icon: <CheckCircleOutlined />,
      },
      EXPIRED: {
        color: "error",
        text: "Hết hạn",
        icon: <ClockCircleOutlined />,
      },
      TERMINATED: {
        color: "default",
        text: "Đã chấm dứt",
        icon: <ClockCircleOutlined />,
      },
      PENDING: {
        color: "warning",
        text: "Chờ xử lý",
        icon: <ClockCircleOutlined />,
      },
    };

    const status_info = statusMap[status] || {
      color: "default",
      text: status,
      icon: null,
    };
    return (
      <Tag color={status_info.color} icon={status_info.icon}>
        {status_info.text}
      </Tag>
    );
  };

  const handleDownloadContract = () => {
    window.open(contractData?.fileContract, "_blank");
  };

  return (
    <div className="user-contract-tab">
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : !contractData ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Empty description="Không có hợp đồng" />
        </div>
      ) : (
        <>
          {/* Header with Contract Number */}
          <div className="contract-header">
            <div className="contract-header-content">
              <div className="contract-title">
                <FileTextOutlined className="contract-icon" />
                <div>
                  <h2>Hợp đồng #{contractData.contractNumber}</h2>
                  <p className="contract-type">
                    {contractData.contractTypeName}
                  </p>
                </div>
              </div>
              <div className="contract-actions">
                {getStatusTag(contractData.status)}
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadContract}
                  className="download-btn"
                >
                  Tải hợp đồng
                </Button>
              </div>
            </div>
          </div>

          {/* Main Contract Information */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <span className="card-title">
                    <FileTextOutlined /> Thông tin hợp đồng
                  </span>
                }
                className="contract-info-card"
              >
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Số hợp đồng" span={2}>
                    <strong>{contractData.contractNumber}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại hợp đồng" span={2}>
                    {contractData.contractTypeName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <UserOutlined /> Nhân viên
                      </>
                    }
                  >
                    {contractData.fullNameUser}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <UserOutlined /> Người quản lý
                      </>
                    }
                  >
                    {contractData.fullNameManager}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phòng ban">
                    {contractData.departmentName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vị trí">
                    {contractData.positionName}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <CalendarOutlined /> Ngày bắt đầu
                      </>
                    }
                  >
                    {formatDate(contractData.startDate)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <CalendarOutlined /> Ngày kết thúc
                      </>
                    }
                  >
                    {formatDate(contractData.endDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời hạn hợp đồng">
                    {getDurationYMDLabel(contractData.duration)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cấp bậc">
                    {contractData.levelSalaryName}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="Trạng thái ký">
                    {contractData?.isSignature ? (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        Đã ký
                      </Tag>
                    ) : (
                      <Tag color="warning" icon={<ClockCircleOutlined />}>
                        Chưa ký
                      </Tag>
                    )}
                  </Descriptions.Item> */}
                </Descriptions>
              </Card>

              {/* Contract Content */}
              <Card
                title={
                  <span className="card-title">
                    <FileTextOutlined /> Nội dung hợp đồng
                  </span>
                }
                className="contract-content-card"
              >
                <div
                  className="contract-content-html"
                  dangerouslySetInnerHTML={{ __html: contractData.content }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              {/* Salary Information */}
              <Card
                title={
                  <span className="card-title">
                    <DollarOutlined /> Lương & Phụ cấp
                  </span>
                }
                className="salary-card"
              >
                <div className="gross-salary-section">
                  <div className="salary-label">Lương Gross</div>
                  <div className="salary-amount">
                    {formatCurrency(contractData.grossSalary)}
                  </div>
                </div>

                <Divider />

                <div className="allowances-section">
                  <h4>Phụ cấp</h4>
                  {contractData.allowanceInfors &&
                  contractData.allowanceInfors.length > 0 ? (
                    <div className="allowances-list">
                      {contractData.allowanceInfors.map((allowance) => (
                        <div
                          key={allowance.allowanceId}
                          className="allowance-item"
                        >
                          <div className="allowance-info">
                            <span className="allowance-name">
                              {allowance.allowanceName}
                            </span>
                            <span className="allowance-code">
                              {allowance.allowanceCode}
                            </span>
                          </div>
                          <div className="allowance-value">
                            {formatCurrency(allowance.value)}
                          </div>
                        </div>
                      ))}
                      <Divider style={{ margin: "12px 0" }} />
                      <div className="total-salary">
                        <span>Tổng thu nhập</span>
                        <strong>
                          {formatCurrency(
                            String(
                              Number(contractData.grossSalary) +
                                contractData.allowanceInfors.reduce(
                                  (sum, a) => sum + Number(a.value),
                                  0
                                )
                            )
                          )}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <Empty description="Không có phụ cấp" />
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="stats-card">
                <div className="stat-item">
                  <div
                    className="stat-icon"
                    style={{
                      background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                    }}
                  >
                    <CalendarOutlined />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">Ngày tạo</div>
                    <div className="stat-value">
                      {formatDate(contractData.createdAt)}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* History and Appendix Section */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {/* History */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span className="card-title">
                    <HistoryOutlined /> Lịch sử hợp đồng
                  </span>
                }
                className="history-card"
              >
                <Timeline
                  items={historyData.map((item, index) => ({
                    color: index === 0 ? "green" : "blue",
                    dot: index === 0 ? <CheckCircleOutlined /> : undefined,
                    children: (
                      <div className="history-item">
                        <div className="history-header">
                          <span className="history-action">
                            {item.contractTypeName}
                          </span>
                          <span className="history-date">
                            {formatDate(item.startDate) +
                              "- " +
                              formatDate(item.endDate)}
                          </span>
                        </div>
                        <div className="history-description">
                          {item.departmentName} - {item.positionName} -{" "}
                          {item.levelSalaryName}
                        </div>
                        <div className="history-user">
                          <UserOutlined /> {formatCurrency(item.grossSalary)}
                        </div>
                      </div>
                    ),
                  }))}
                />
              </Card>
            </Col>

            {/* Appendix */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span className="card-title">
                    <PaperClipOutlined /> Phụ lục hợp đồng
                  </span>
                }
                className="appendix-card"
              >
                {appendixData && appendixData.length > 0 ? (
                  <div className="appendix-list">
                    {appendixData.map((appendix) => (
                      <div key={appendix.id} className="appendix-item">
                        <div className="appendix-icon">
                          <FileTextOutlined />
                        </div>
                        <div className="appendix-info">
                          <div className="appendix-name">
                            {appendix.contractTypeName}
                          </div>
                          <div className="appendix-date">
                            Ngày tạo: {formatDate(appendix.startDate)}
                          </div>
                        </div>
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            if (appendix.fileContract) {
                              window.open(appendix.fileContract, "_blank");
                            }
                          }}
                        >
                          Tải
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="Không có phụ lục" />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default UserContractTab;
