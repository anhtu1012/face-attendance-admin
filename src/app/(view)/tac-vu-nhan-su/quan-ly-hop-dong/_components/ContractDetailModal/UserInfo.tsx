import {
  ContractDetail,
  UserInfor,
} from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { Card, Col, Descriptions, Divider, Image, Row, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { FaBuilding, FaMoneyBillWave, FaUser, FaUserTie } from "react-icons/fa";

const { Text } = Typography;

interface UserInfoProps {
  userInfor: UserInfor;
  contract: ContractDetail;
}

const UserInfo: React.FC<UserInfoProps> = ({ userInfor, contract }) => {
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  return (
    <Card className="info-card">
      <Row gutter={[24, 24]}>
        {userInfor.faceImg && (
          <Col span={24} style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                background:
                  "linear-gradient(45deg, rgba(13, 71, 161, 0.15), rgba(30, 136, 229, 0.15), rgba(13, 71, 161, 0.15))",
                borderRadius: "50%",
                boxShadow: "0 6px 20px rgba(13, 71, 161, 0.2)",
              }}
            >
              <Image
                src={userInfor.faceImg}
                alt="User Avatar"
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid white",
                }}
              />
            </div>
          </Col>
        )}

        <Col span={24}>
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item
              label={
                <span>
                  <FaUser /> Họ và tên
                </span>
              }
            >
              <Text strong style={{ fontSize: "16px" }}>
                {userInfor.fullName}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Mã nhân viên">
              {userInfor.userCode || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {userInfor.email || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Số điện thoại">
              {userInfor.phone || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Giới tính">
              {userInfor.gender || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày sinh">
              {userInfor.birthday ? formatDate(userInfor.birthday) : "N/A"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <FaUserTie /> Người quản lý
                </span>
              }
              span={2}
            >
              {userInfor.manageByFullName || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <FaBuilding /> Phòng ban
                </span>
              }
            >
              {contract.departmentName}
            </Descriptions.Item>

            <Descriptions.Item label="Chức vụ">
              {contract.positionName}
            </Descriptions.Item>

            <Descriptions.Item label="CMND/CCCD" span={2}>
              {userInfor.citizenIdentityCard || "N/A"}
            </Descriptions.Item>

            {userInfor.issueDate && (
              <>
                <Descriptions.Item label="Ngày cấp">
                  {formatDate(userInfor.issueDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Nơi cấp">
                  {userInfor.issueAt || "N/A"}
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Quốc tịch">
              {userInfor.nationality || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Dân tộc">
              {userInfor.nation || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Tình trạng hôn nhân">
              {userInfor.marriedStatus || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Tình trạng nghĩa vụ">
              {userInfor.militaryStatus || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ thường trú" span={2}>
              {userInfor.permanentAddress || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ hiện tại" span={2}>
              {userInfor.currentAddress || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Mã số thuế" span={2}>
              {userInfor.taxCode || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span>
                  <FaMoneyBillWave /> Ngân hàng
                </span>
              }
            >
              {userInfor.bankingName || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Số tài khoản">
              {userInfor.bankingAccountNo || "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Tên tài khoản" span={2}>
              {userInfor.bankingAccountName || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        {(userInfor.identityCardImgFront || userInfor.identityCardImgBack) && (
          <Col span={24}>
            <Divider orientation="left">Hình ảnh CMND/CCCD</Divider>
            <Row gutter={[16, 16]}>
              {userInfor.identityCardImgFront && (
                <Col span={12}>
                  <Card title="Mặt trước" className="id-card">
                    <Image
                      src={userInfor.identityCardImgFront}
                      alt="ID Card Front"
                      width="100%"
                    />
                  </Card>
                </Col>
              )}
              {userInfor.identityCardImgBack && (
                <Col span={12}>
                  <Card title="Mặt sau" className="id-card">
                    <Image
                      src={userInfor.identityCardImgBack}
                      alt="ID Card Back"
                      width="100%"
                    />
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default UserInfo;
