/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Table, Card, Tag, Avatar, Button, Space, Input, Badge } from "antd";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSearch,
  FaDownload,
  FaEye,
  FaUsers,
} from "react-icons/fa";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import "./CandidateListTab.scss";

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthday?: string;
  skillIds?: string[];
  fileCV?: string;
  gender: "M" | "F" | "";
  status: string;
  experience?: string;
  createdAt?: string;
  avatar?: string;
}

interface CandidateListTabProps {
  jobId?: string;
  interviewId?: string;
}

const statusConfig: Record<string, { text: string; color: string }> = {
  APPLYING: { text: "Đang ứng tuyển", color: "blue" },
  INTERVIEWING: { text: "Đang phỏng vấn", color: "orange" },
  OFFERED: { text: "Đã nhận offer", color: "green" },
  ONBOARDING: { text: "Đang nhận việc", color: "cyan" },
  HIRED: { text: "Đã tuyển", color: "success" },
  REJECTED: { text: "Từ chối", color: "red" },
};

export default function CandidateListTab({ jobId, interviewId }: CandidateListTabProps) {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, interviewId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Try to fetch candidates from API. Endpoint attempts:
      // 1. /v1/interview/{interviewId}/candidates
      // 2. /v1/job/{jobId}/candidates
      const { AxiosService } = await import("@/apis/axios.base");
      const axiosService = AxiosService.getInstance();

  let data: unknown[] = [];
      if (typeof interviewId !== "undefined") {
        try {
          data = await axiosService.get(`/v1/interview/${interviewId}/candidates`);
        } catch {
          // fallback: try job endpoint if interview endpoint doesn't exist
        }
      }

      if ((!data || data.length === 0) && typeof jobId !== "undefined") {
        try {
          data = await axiosService.get(`/v1/job/${jobId}/candidates`);
        } catch {
          // no-op, will fall back to empty
        }
      }

      if (!data || data.length === 0) {
        // fallback to empty array
        data = [];
      }

      // Map API response to Candidate[] shape if necessary
      const mapped: Candidate[] = (data as any[]).map((it) => ({
        id: it.id || it.candidateId || String((it as any)._id || ""),
        fullName: it.fullName || it.candidateName || "",
        email: it.email || it.candidateEmail || "",
        phone: it.phone || it.candidatePhone || "",
        birthday: it.birthday || (it as any).dateOfBirth || undefined,
        gender: it.gender || "",
        experience: it.experience || (it as any).yearsOfExperience || undefined,
        status: it.status || "",
        fileCV: it.fileCV || (it as any).cvUrl || undefined,
        skillIds: (it as any).skills || (it as any).skillIds || [],
        createdAt: it.createdAt || (it as any).appliedAt || undefined,
      }));

      setCandidates(mapped);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Candidate> = [
    {
      title: "Ứng viên",
      key: "candidate",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <div className="candidate-info">
          <Avatar
            size={48}
            src={record.avatar}
            icon={<FaUser />}
            className="candidate-avatar"
          />
          <div className="candidate-details">
            <div className="candidate-name">{record.fullName}</div>
            <div className="candidate-gender">
              {record.gender === "M"
                ? "Nam"
                : record.gender === "F"
                ? "Nữ"
                : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin liên hệ",
      key: "contact",
      width: 280,
      render: (_, record) => (
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon gradient-icon" />
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon gradient-icon" />
            <a href={`tel:${record.phone}`}>{record.phone}</a>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      width: 120,
      render: (birthday) =>
        birthday ? dayjs(birthday).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
      width: 120,
      render: (exp) => exp || "-",
    },
    {
      title: "Kỹ năng",
      dataIndex: "skillIds",
      key: "skills",
      width: 200,
      render: (skills: string[]) => (
        <div className="skills-tags">
          {skills?.slice(0, 3).map((skill, index) => (
            <Tag key={index} color="blue">
              {skill}
            </Tag>
          ))}
          {skills?.length > 3 && <Tag>+{skills.length - 3}</Tag>}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const config = statusConfig[status] || {
          text: status,
          color: "default",
        };
        return (
          <Badge status="processing" color={config.color}>
            <span className="status-text">{config.text}</span>
          </Badge>
        );
      },
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "CV",
      key: "cv",
      width: 100,
      align: "center",
      render: (_, record) =>
        record.fileCV ? (
          <Space size="small">
            <Button
              type="link"
              icon={<FaEye />}
              size="small"
              onClick={() => window.open(record.fileCV, "_blank")}
            >
              Xem
            </Button>
            <Button
              type="link"
              icon={<FaDownload />}
              size="small"
              onClick={() => {
                const link = document.createElement("a");
                link.href = record.fileCV!;
                link.download = `CV_${record.fullName}.pdf`;
                link.click();
              }}
            />
          </Space>
        ) : (
          <span className="no-cv">-</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right",
      align: "center",
      render: () => (
        <Button type="primary" size="small">
          Chi tiết
        </Button>
      ),
    },
  ];

  const filteredData = candidates.filter((candidate) => {
    const searchLower = searchText.toLowerCase();
    return (
      candidate.fullName.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.phone.includes(searchText)
    );
  });

  return (
    <div className="candidate-list-tab">
      <Card
        title={
          <div className="card-header">
            <div className="header-left">
              <FaUsers className="header-icon gradient-icon" />
              <span className="header-title">Danh sách ứng viên</span>
              <Badge
                count={candidates.length}
                showZero
                className="count-badge"
              />
            </div>
            <Input
              placeholder="Tìm kiếm ứng viên..."
              prefix={<FaSearch className="gradient-icon" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
              allowClear
            />
          </div>
        }
        className="candidates-card"
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} ứng viên`,
          }}
          scroll={{ x: 1400 }}
          className="candidates-table"
        />
      </Card>
    </div>
  );
}
