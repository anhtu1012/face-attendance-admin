/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spin, Tabs, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import UserInfoTab from "./_components/UserInfoTab/UserInfoTab";
import UserTimekeepingTab from "./_components/UserTimekeepingTab/UserTimekeepingTab";
import UserSalaryTab from "./_components/UserSalaryTab/UserSalaryTab";
import "./page.scss";

interface UserDetailData {
  id: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userCode: string;
  roleId: string;
  departmentId: string;
  manageByUserId: string;
  managerName: string;
  positionId: string;
  positionName: string;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  birthday: string;
  faceImg: string | null;
  marriedStatus: string | null;
  nation: string;
  bankingAccountNo: string | null;
  bankingAccountName: string | null;
  bankingName: string | null;
  militaryStatus: string | null;
  citizenIdentityCard: string;
  identityCardImgFront: string | null;
  identityCardImgBack: string | null;
  taxCode: string;
  issueDate: string;
  issueAt: string;
  nationality: string;
  permanentAddress: string;
  currentAddress: string;
  status: string | null;
  reason: string | null;
  isActive: boolean;
  userPushToken: string;
  isRegisterFace: boolean;
  dependent: any[];
}

function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      // const response = await UserService.getUserDetail(userId);
      const mockData: UserDetailData = {
        id: userId,
        createdAt: "2025-11-19T08:10:38.296Z",
        updatedAt: "2025-11-19T08:10:38.296Z",
        userName: "staff",
        userCode: "CTA-STAFF-250001",
        roleId: "5",
        departmentId: "1",
        manageByUserId: "12",
        managerName: "admin admin",
        positionId: "7",
        positionName: "Frontend Developer",
        fullName: "Phạm Hoàng Phúc",
        email: "phamhoangphuc1824@gmail.com",
        gender: "M",
        phone: "0703049999",
        birthday: "2004-08-09T17:00:00.000Z",
        faceImg: null,
        marriedStatus: null,
        nation: "Kinh",
        bankingAccountNo: null,
        bankingAccountName: null,
        bankingName: null,
        militaryStatus: null,
        citizenIdentityCard: "049204001340",
        identityCardImgFront: null,
        identityCardImgBack: null,
        taxCode: "1234568888888",
        issueDate: "2021-04-15T17:00:00.000Z",
        issueAt: "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
        nationality: "Việt Nam",
        permanentAddress: "Tổ 12A, Phong Hòa, Sơn Phong, Hội An, Quảng Nam",
        currentAddress: "123 Nguyen Van Linh, Q9, helio",
        status: null,
        reason: null,
        isActive: true,
        userPushToken: "ExponentPushToken[6HhKiXFbD1fCDb7Xi1tM56]",
        isRegisterFace: true,
        dependent: [],
      };
      setUserData(mockData);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "info",
      label: (
        <span className="tab-label">
          <span className="tab-icon">👤</span>
          Thông tin cá nhân
        </span>
      ),
      children: <UserInfoTab userData={userData} onRefresh={fetchUserDetail} />,
    },
    {
      key: "timekeeping",
      label: (
        <span className="tab-label">
          <span className="tab-icon">⏰</span>
          Chấm công
        </span>
      ),
      children: <UserTimekeepingTab userId={userId} />,
    },
    {
      key: "salary",
      label: (
        <span className="tab-label">
          <span className="tab-icon">💰</span>
          Lương
        </span>
      ),
      children: <UserSalaryTab userId={userId} />,
    },
  ];

  if (loading) {
    return (
      <div className="user-detail-loading">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="user-detail-error">
        <p>Không tìm thấy thông tin người dùng</p>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <div className="user-detail-page">
          <div className="user-detail-container">
            {/* Header */}
            <div className="user-detail-header">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="back-button"
              >
                Quay lại
              </Button>
              <div className="user-header-info">
                <h1>{userData.fullName}</h1>
                <div className="user-meta">
                  <span className="user-code">{userData.userCode}</span>
                  <span className="separator">•</span>
                  <span className="position">{userData.positionName}</span>
                  {userData.isActive && (
                    <>
                      <span className="separator">•</span>
                      <span className="status active">Đang hoạt động</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="user-detail-tabs"
              size="large"
            />
          </div>
        </div>
      }
    />
  );
}

export default UserDetailPage;
