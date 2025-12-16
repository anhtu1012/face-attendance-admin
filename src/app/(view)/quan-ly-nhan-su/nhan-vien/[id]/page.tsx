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
import UserContractTab from "./_components/UserContractTab/UserContractTab";
import UserOverviewTab from "./_components/UserOverviewTab/UserOverviewTab";
import UserFormsTab from "./_components/UserFormsTab/UserFormsTab";
import "./page.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { GiMoneyStack } from "react-icons/gi";
import { HiDocumentText } from "react-icons/hi";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdAssignment } from "react-icons/md";
import NguoiDungServices from "@/services/admin/quan-tri-he-thong/nguoi-dung.service";
import { NguoiDungItem } from "@/dtos/quan-tri-he-thong/nguoi-dung/nguoi-dung.dto";

function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<NguoiDungItem | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await NguoiDungServices.getNguoiDung([], undefined, {
        quicksearchCols: "id",
        quicksearch: userId,
      });
      setUserData(response.data[0]);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="tab-label">
          <AiOutlineDashboard size={20} />
          Tổng quan
        </span>
      ),
      children: <UserOverviewTab userId={userId} />,
    },
    {
      key: "info",
      label: (
        <span className="tab-label" style={{ marginLeft: "12px" }}>
          <FaRegUserCircle size={20} />
          Thông tin cá nhân
        </span>
      ),
      children: <UserInfoTab userData={userData} onRefresh={fetchUserDetail} />,
    },
    {
      key: "contract",
      label: (
        <span className="tab-label" style={{ marginLeft: "12px" }}>
          <HiDocumentText size={20} />
          Hợp đồng
        </span>
      ),
      children: <UserContractTab userId={userId} />,
    },
    {
      key: "forms",
      label: (
        <span className="tab-label" style={{ marginLeft: "12px" }}>
          <MdAssignment size={20} />
          Đơn từ
        </span>
      ),
      children: <UserFormsTab userId={userId} />,
    },
    {
      key: "timekeeping",
      label: (
        <span className="tab-label" style={{ marginLeft: "12px" }}>
          <IoMdTimer size={20} />
          Chấm công
        </span>
      ),
      children: <UserTimekeepingTab userId={userId} />,
    },
    {
      key: "salary",
      label: (
        <span className="tab-label">
          <GiMoneyStack size={20} />
          Lương theo chấm công
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
