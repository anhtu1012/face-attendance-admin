/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Col, Descriptions, Row, Tag, Avatar, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, IdcardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./UserInfoTab.scss";

interface UserInfoTabProps {
  userData: any;
  onRefresh?: () => void;
}

function UserInfoTab({ userData }: UserInfoTabProps) {
  if (!userData) {
    return <div>Không có dữ liệu</div>;
  }

  const formatDate = (date: string) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "N/A";
  };

  return (
    <div className="user-info-tab">
      {/* Profile Card */}
      <Card className="profile-card">
        <Row gutter={24}>
          <Col xs={24} md={6} className="avatar-section">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={userData.faceImg}
              className="user-avatar"
            />
            <div className="quick-info">
              <h3>{userData.fullName}</h3>
              <p className="user-code">{userData.userCode}</p>
              {userData.isActive ? (
                <Tag color="success">Đang hoạt động</Tag>
              ) : (
                <Tag color="error">Ngừng hoạt động</Tag>
              )}
              {userData.isRegisterFace && (
                <Tag color="blue">Đã đăng ký khuôn mặt</Tag>
              )}
            </div>
          </Col>

          <Col xs={24} md={18}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ và tên" span={2}>
                {userData.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">
                {userData.userName}
              </Descriptions.Item>
              <Descriptions.Item label="Mã nhân viên">
                {userData.userCode}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                <MailOutlined /> {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <PhoneOutlined /> {userData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {userData.gender === "M" ? "Nam" : userData.gender === "F" ? "Nữ" : "Khác"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {formatDate(userData.birthday)}
              </Descriptions.Item>
              <Descriptions.Item label="Dân tộc">
                {userData.nation}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Work Information */}
      <Card title="Thông tin công việc" className="info-card">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Chức vụ">
            {userData.positionName}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng ban">
            Phòng ban {userData.departmentId}
          </Descriptions.Item>
          <Descriptions.Item label="Người quản lý" span={2}>
            {userData.managerName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDate(userData.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {formatDate(userData.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={16}>
        {/* Identity Information */}
        <Col xs={24} lg={12}>
          <Card title={<><IdcardOutlined /> Thông tin CMND/CCCD</>} className="info-card">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Số CMND/CCCD">
                {userData.citizenIdentityCard}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cấp">
                {formatDate(userData.issueDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Nơi cấp">
                {userData.issueAt}
              </Descriptions.Item>
              <Descriptions.Item label="Quốc tịch">
                {userData.nationality}
              </Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">
                {userData.taxCode}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Bank Information */}
        <Col xs={24} lg={12}>
          <Card title={<><BankOutlined /> Thông tin ngân hàng</>} className="info-card">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên ngân hàng">
                {userData.bankingName || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Số tài khoản">
                {userData.bankingAccountNo || "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Tên chủ tài khoản">
                {userData.bankingAccountName || "Chưa cập nhật"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="additional-info">
              <p><strong>Tình trạng hôn nhân:</strong> {userData.marriedStatus || "Chưa cập nhật"}</p>
              <p><strong>Tình trạng nghĩa vụ:</strong> {userData.militaryStatus || "Chưa cập nhật"}</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Address Information */}
      <Card title="Thông tin địa chỉ" className="info-card">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Địa chỉ thường trú">
            {userData.permanentAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ hiện tại">
            {userData.currentAddress}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default UserInfoTab;

