/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QuanLyHopDongServices from "@/services/admin/quan-li-nguoi-dung/quan-li-hop-dong.service";
import QlNguoiDungServices from "@/services/admin/quan-li-nguoi-dung/quan-li-nguoi-dung.service";
import QuanLyLuongServices from "@/services/quan-ly-luong/quan-ly-luong.service";
import {
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Image,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

interface UserDetailProps {
  userCode: ParamValue;
}

interface UserInfo {
  code: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  roleCode: string;
  addressCode: string;
  isActive: boolean;
  branchName: string;
  createdAt: string;
  updatedAt: string;
  faceImg?: string;
}

interface PayrollInfo {
  month: string;
  baseSalary: number;
  actualSalary: number;
  allowance: number | null;
  overtimeSalary: number | null;
  deductionFee: number | null;
  lateFine: number | null;
  workDay: number;
  totalWorkHour: number;
  lateTimeCount: number;
  overTimeSalaryPosition: number;
  totalSalary: number;
  status: string;
  paidDate: string | null;
  createdAt: string;
}

interface ContractInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: string;
  contractPdf: string | null;
  status: string;
  endDate?: string | null;
  managedBy: string;
  positionCode: string;
  positionName?: string;
  branchNames: string;
  branchCodes: string[];
  fullName: string;
  fullNameManager?: string;
  baseSalary: number;
}

function UserDetail({ userCode }: UserDetailProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [payrollInfo, setPayrollInfo] = useState<PayrollInfo[]>([]);
  const [contractInfo, setContractInfo] = useState<ContractInfo[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [payrollError, setPayrollError] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const auth = useSelector(selectAuthLogin);
  console.log(auth?.userProfile?.roleCode);

  // Convert userCode to string if it's an array
  const userCodeString = Array.isArray(userCode)
    ? userCode[0]
    : (userCode as string);

  const fetchUserInfo = async () => {
    if (!userCodeString) return;

    setUserLoading(true);
    setUserError(null);
    try {
      const response = await QlNguoiDungServices.getUserByCode(userCodeString);
      if (response.data && response.data.length > 0) {
        setUserInfo(response.data[0]);
      } else {
        setUserError("Không tìm thấy thông tin người dùng");
      }
    } catch (error: any) {
      console.error("Error fetching user info:", error);
      setUserError(error.message || "Lỗi khi tải thông tin người dùng");
      toast.error("Lỗi khi tải thông tin người dùng");
    } finally {
      setUserLoading(false);
    }
  };

  const fetchPayrollInfo = async (month?: string) => {
    if (!userCodeString) return;

    setPayrollLoading(true);
    setPayrollError(null);
    try {
      const searchFilter: any = [
        { key: "limit", type: "=", value: 100 },
        { key: "offset", type: "=", value: 0 },
      ];

      const params: any = {
        ...(month ? { month: month } : {}),
        userCode,
      };
      const response = await QuanLyLuongServices.getQuanLyLuong(
        searchFilter,
        params
      );
      if (response.data) {
        setPayrollInfo(response.data as any);
      } else {
        setPayrollInfo([]);
      }
    } catch (error: any) {
      console.error("Error fetching payroll info:", error);
      setPayrollError(error.message || "Lỗi khi tải thông tin lương");
      toast.error("Lỗi khi tải thông tin lương");
    } finally {
      setPayrollLoading(false);
    }
  };

  const fetchContractInfo = async () => {
    if (!userCodeString) return;

    setContractLoading(true);
    setContractError(null);
    try {
      const response =
        await QuanLyHopDongServices.getContractsByUserCodeHistory(
          userCodeString
        );
      if (response && Array.isArray(response)) {
        setContractInfo(response as ContractInfo[]);
      } else {
        setContractInfo([]);
      }
    } catch (error: any) {
      console.error("Error fetching contract info:", error);
      setContractError(error.message || "Lỗi khi tải thông tin hợp đồng");
      toast.error("Lỗi khi tải thông tin hợp đồng");
    } finally {
      setContractLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchPayrollInfo();
    fetchContractInfo();
  }, [userCodeString]);

  const handleMonthFilter = (month: string | null) => {
    console.log({
      month,
    });
    fetchPayrollInfo(month || undefined);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "R1":
        return {
          color: "#991b1b",
          background: "#fee2e2",
          borderColor: "#fecaca",
        };
      case "R2":
        return {
          color: "#5b21b6",
          background: "#ede9fe",
          borderColor: "#ddd6fe",
        };
      case "R3":
        return {
          color: "#0369a1",
          background: "#e0f2fe",
          borderColor: "#bae6fd",
        };
      default:
        return {
          color: "#065f46",
          background: "#d1fae5",
          borderColor: "#a7f3d0",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "PENDING":
        return <Tag color="orange">Chờ thanh toán</Tag>;
      case "CANCELLED":
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Tag color="green">Đang hoạt động</Tag>;
      case "INACTIVE":
        return <Tag color="red">Không hoạt động</Tag>;
      case "PENDING":
        return <Tag color="orange">Chờ xử lý</Tag>;
      case "EXPIRED":
        return <Tag color="default">Đã hết hạn</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (userLoading && !userInfo) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* User Profile Section */}
      <Card style={{ marginBottom: "16px" }} loading={userLoading}>
        {userError ? (
          <Alert message={userError} type="error" showIcon />
        ) : userInfo ? (
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={6} md={4}>
              <div style={{ textAlign: "center" }}>
                {userInfo.faceImg ? (
                  <Image
                    src={userInfo.faceImg}
                    alt="User Avatar"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FWz4qUzPQKgOCAzPHKrABY5g6QShKOgEEhJmhcthSNiOEEgCKIESjsBSLEJUdGgHCgQdJ3FFRUT19qV6qek/1U0dAf3q/96+6qrq7q..."
                  />
                ) : (
                  <Avatar size={100} icon={<UserOutlined />} />
                )}
                <div style={{ marginTop: "12px" }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {`${userInfo.firstName} ${userInfo.lastName}`}
                  </Title>
                  <Text type="secondary">{userInfo.userName}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={18} md={20}>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Mã nhân viên
                    </Text>
                    <div>
                      <Text strong>{userInfo.code}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Email
                    </Text>
                    <div>
                      <Space size={4}>
                        <MailOutlined style={{ fontSize: "12px" }} />
                        <Text>{userInfo.email}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Số điện thoại
                    </Text>
                    <div>
                      <Space size={4}>
                        <PhoneOutlined style={{ fontSize: "12px" }} />
                        <Text>{userInfo.phone}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Ngày sinh
                    </Text>
                    <div>
                      <Space size={4}>
                        <CalendarOutlined style={{ fontSize: "12px" }} />
                        <Text>{dayjs(userInfo.dob).format("DD/MM/YYYY")}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Giới tính
                    </Text>
                    <div>
                      <Text>
                        {userInfo.gender === "MALE"
                          ? "Nam"
                          : userInfo.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Quyền
                    </Text>
                    <div>
                      <Tag
                        style={{
                          ...getRoleBadgeStyle(userInfo.roleCode),
                          fontSize: "12px",
                          padding: "2px 8px",
                        }}
                      >
                        {userInfo.roleCode === "R1"
                          ? "Admin"
                          : userInfo.roleCode === "R2"
                          ? "Nhân sự"
                          : userInfo.roleCode === "R3"
                          ? "Quản lý"
                          : "Nhân viên"}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} lg={12}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Chi nhánh
                    </Text>
                    <div>
                      <Space size={4}>
                        <BankOutlined style={{ fontSize: "12px" }} />
                        <Text>{userInfo.branchName}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} lg={12}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Địa chỉ
                    </Text>
                    <div>
                      <Space size={4}>
                        <HomeOutlined style={{ fontSize: "12px" }} />
                        <Text>{userInfo.addressCode}</Text>
                      </Space>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Trạng thái
                    </Text>
                    <div>
                      <Tag
                        color={userInfo.isActive ? "green" : "red"}
                        style={{ fontSize: "12px", padding: "2px 8px" }}
                      >
                        {userInfo.isActive ? "Hoạt động" : "Không hoạt động"}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Ngày tạo
                    </Text>
                    <div>
                      <Text style={{ fontSize: "13px" }}>
                        {dayjs(userInfo.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Ngày cập nhật
                    </Text>
                    <div>
                      <Text style={{ fontSize: "13px" }}>
                        {dayjs(userInfo.updatedAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
      </Card>

      {/* Payroll Information Section */}
      {auth && auth.userProfile && auth.userProfile.roleCode !== "R2" && (
        <Card
          title={
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <BankOutlined />
                  <span>Thông tin lương</span>
                  <Tag color="blue">{payrollInfo.length} bảng lương</Tag>
                </Space>
              </Col>
              <Col>
                <DatePicker
                  picker="month"
                  placeholder="Chọn tháng"
                  format="MM/YY"
                  onChange={(date) => {
                    const month = date ? date.format("MM/YY") : null;
                    handleMonthFilter(month);
                  }}
                  allowClear
                  size="small"
                />
              </Col>
            </Row>
          }
          loading={payrollLoading}
        >
          {payrollError ? (
            <Alert message={payrollError} type="error" showIcon />
          ) : payrollInfo.length > 0 ? (
            <div>
              {payrollInfo.map((payroll, index) => (
                <div key={index}>
                  {index > 0 && <Divider style={{ margin: "16px 0" }} />}

                  {/* Month Header */}
                  <div
                    style={{
                      marginBottom: "12px",
                      borderBottom: "1px solid #f0f0f0",
                      paddingBottom: "8px",
                    }}
                  >
                    <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                      Tháng {payroll.month}
                    </Text>
                    <div style={{ float: "right" }}>
                      {getStatusBadge(payroll.status)}
                    </div>
                  </div>

                  <Row gutter={[16, 12]}>
                    {/* Salary Information */}
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Lương cơ bản
                        </Text>
                        <div>
                          <Text strong style={{ color: "#52c41a" }}>
                            {formatCurrency(payroll.baseSalary)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Lương thực tế
                        </Text>
                        <div>
                          <Text strong style={{ color: "#52c41a" }}>
                            {formatCurrency(payroll.actualSalary)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Phụ cấp
                        </Text>
                        <div>
                          <Text>{formatCurrency(payroll.allowance || 0)}</Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Lương OT
                        </Text>
                        <div>
                          <Text>
                            {formatCurrency(payroll.overtimeSalary || 0)}
                          </Text>
                        </div>
                      </div>
                    </Col>

                    {/* Deductions */}
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Phí khấu trừ
                        </Text>
                        <div>
                          <Text style={{ color: "#ff4d4f" }}>
                            {formatCurrency(payroll.deductionFee || 0)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Phạt đi trễ
                        </Text>
                        <div>
                          <Text style={{ color: "#ff4d4f" }}>
                            {formatCurrency(payroll.lateFine || 0)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Số lần đi trễ
                        </Text>
                        <div>
                          <Tag color="orange">{payroll.lateTimeCount} lần</Tag>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Ngày làm việc
                        </Text>
                        <div>
                          <Tag color="blue">{payroll.workDay} ngày</Tag>
                        </div>
                      </div>
                    </Col>

                    {/* Summary */}
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Tổng giờ làm
                        </Text>
                        <div>
                          <Tag color="cyan">{payroll.totalWorkHour} giờ</Tag>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Lương OT theo vị trí
                        </Text>
                        <div>
                          <Text>
                            {formatCurrency(payroll.overTimeSalaryPosition)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Tổng lương
                        </Text>
                        <div>
                          <Text
                            strong
                            style={{ fontSize: "18px", color: "#52c41a" }}
                          >
                            {formatCurrency(payroll.totalSalary)}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Ngày thanh toán
                        </Text>
                        <div>
                          <Text style={{ fontSize: "13px" }}>
                            {payroll.paidDate
                              ? dayjs(payroll.paidDate).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "Chưa thanh toán"}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid #f5f5f5",
                    }}
                  >
                    <Col span={24}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Ngày tạo:{" "}
                        {dayjs(payroll.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Text type="secondary">Không có dữ liệu lương</Text>
            </div>
          )}
        </Card>
      )}

      {/* Contract Information Section */}
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <FileTextOutlined />
                <span>Thông tin hợp đồng</span>
                <Tag color="blue">{contractInfo.length} hợp đồng</Tag>
              </Space>
            </Col>
          </Row>
        }
        loading={contractLoading}
        style={{ marginTop: "16px" }}
      >
        {contractError ? (
          <Alert message={contractError} type="error" showIcon />
        ) : contractInfo.length > 0 ? (
          <div>
            {contractInfo.map((contract, index) => (
              <div key={contract.id}>
                {index > 0 && <Divider style={{ margin: "16px 0" }} />}

                {/* Contract Header */}
                <div
                  style={{
                    marginBottom: "12px",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "8px",
                  }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1890ff" }}
                      >
                        {contract.title} - {contract.code}
                      </Text>
                    </Col>
                    <Col>
                      <Space>
                        {getContractStatusBadge(contract.status)}
                        {/* <Button
                          type="text"
                          icon={<EyeOutlined />}
                          size="small"
                          style={{ color: "#1890ff" }}
                        >
                          Xem chi tiết
                        </Button> */}
                      </Space>
                    </Col>
                  </Row>
                </div>

                <Row gutter={[16, 12]}>
                  {/* Contract Basic Info */}
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Mô tả
                      </Text>
                      <div>
                        <Text>{contract.description}</Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Thời hạn
                      </Text>
                      <div>
                        <Text>{contract.duration}</Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Vị trí
                      </Text>
                      <div>
                        <Text>
                          {contract.positionName || contract.positionCode}
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Người quản lý
                      </Text>
                      <div>
                        <Text>
                          {contract.fullNameManager || contract.managedBy}
                        </Text>
                      </div>
                    </div>
                  </Col>

                  {/* Contract Dates */}
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Ngày bắt đầu
                      </Text>
                      <div>
                        <Text>
                          {dayjs(contract.startTime).format("DD/MM/YYYY")}
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Ngày kết thúc
                      </Text>
                      <div>
                        <Text>
                          {dayjs(contract.endTime).format("DD/MM/YYYY")}
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Lương cơ bản
                      </Text>
                      <div>
                        <Text strong style={{ color: "#52c41a" }}>
                          {formatCurrency(contract.baseSalary)}
                        </Text>
                      </div>
                    </div>
                    {contract.endDate && (
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Ngày kết thúc thực tế
                        </Text>
                        <div>
                          <Text>
                            {dayjs(contract.endDate).format("DD/MM/YYYY")}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Col>

                  {/* Branch Information */}
                  <Col xs={24} sm={12} md={8}>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Chi nhánh
                      </Text>
                      <div>
                        <Text style={{ fontSize: "13px" }}>
                          {contract.branchNames}
                        </Text>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Mã chi nhánh
                      </Text>
                      <div>
                        <Space wrap>
                          {contract.branchCodes.map((code, idx) => (
                            <Tag
                              key={idx}
                              color="blue"
                              style={{ fontSize: "11px" }}
                            >
                              {code}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    </div>
                    {contract.contractPdf && (
                      <div style={{ marginBottom: "8px" }}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          File hợp đồng
                        </Text>
                        <div>
                          <Button
                            type="link"
                            icon={<FileTextOutlined />}
                            size="small"
                            href={contract.contractPdf}
                            target="_blank"
                          >
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                <Row
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid #f5f5f5",
                  }}
                >
                  <Col span={24}>
                    <Space split={<span style={{ color: "#d9d9d9" }}>•</span>}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Ngày tạo:{" "}
                        {dayjs(contract.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Cập nhật:{" "}
                        {dayjs(contract.updatedAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">Không có dữ liệu hợp đồng</Text>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserDetail;
