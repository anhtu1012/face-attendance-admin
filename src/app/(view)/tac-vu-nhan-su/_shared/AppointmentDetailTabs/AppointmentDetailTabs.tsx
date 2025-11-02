"use client";

import { Tabs } from "antd";
import { useState } from "react";
import AppointmentInfoTab from "./components/AppointmentInfoTab/AppointmentInfoTab";
import "./AppointmentDetailTabs.scss";
import { CandidateListTab } from "./components";
import { AppointmentListWithInterview } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/appointment.dto";

interface AppointmentDetailTabsProps {
  interview: AppointmentListWithInterview;
  onRefresh: () => void;
  defaultTab?: string;
}

export default function AppointmentDetailTabs({
  interview,
  onRefresh,
  defaultTab = "info",
}: AppointmentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabItems = [
    {
      key: "info",
      label: (
        <span className="tab-label">
          <span className="tab-icon"></span>
          Thông tin buổi hẹn
        </span>
      ),
      children: (
        <AppointmentInfoTab interview={interview} onRefresh={onRefresh} />
      ),
    },
    {
      key: "candidates",
      label: (
        <span className="tab-label">
          <span className="tab-icon"></span>
          Danh sách ứng viên
        </span>
      ),
      children: (
        <CandidateListTab
          jobId={interview.jobInfor?.jobId}
          appointmentId={interview.id}
        />
      ),
    },
  ];

  return (
    <div className="interview-detail-tabs-wrapper">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="detail-tabs"
        size="large"
      />
    </div>
  );
}
