import React from "react";
import { Card, Table, Tag, Progress } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./TopCandidatesTable.scss";

interface TopCandidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  matchScore: number;
  status: string;
  appliedDate: string;
  experience: string;
  skills: string[];
}

interface TopCandidatesTableProps {
  data: TopCandidate[];
  loading?: boolean;
  title?: string;
}

const TopCandidatesTable: React.FC<TopCandidatesTableProps> = ({
  data,
  loading = false,
  title = "Top ứng viên tiềm năng",
}) => {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      TO_CONTACT: "blue",
      TO_INTERVIEW: "purple",
      INTERVIEW_SCHEDULED: "cyan",
      TO_INTERVIEW_R1: "green",
      JOB_OFFERED: "orange",
      CONTRACT_SIGNING: "gold",
      HOAN_THANH: "success",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      TO_CONTACT: "Chờ liên hệ",
      TO_INTERVIEW: "Chờ phỏng vấn",
      INTERVIEW_SCHEDULED: "Đã hẹn PV",
      TO_INTERVIEW_R1: "Đậu vòng 1",
      TO_INTERVIEW_R2: "Đậu vòng 2",
      TO_INTERVIEW_R3: "Đậu vòng 3",
      JOB_OFFERED: "Đã offer",
      CONTRACT_SIGNING: "Chờ ký HĐ",
      HOAN_THANH: "Hoàn thành",
    };
    return statusTexts[status] || status;
  };

  const columns = [
    {
      title: "Xếp hạng",
      key: "rank",
      width: 80,
      align: "center" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, __: any, index: number) => (
        <div className="rank-badge">
          {index === 0 && "🥇"}
          {index === 1 && "🥈"}
          {index === 2 && "🥉"}
          {index > 2 && <span className="rank-number">#{index + 1}</span>}
        </div>
      ),
    },
    {
      title: "Ứng viên",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      render: (text: string, record: TopCandidate) => (
        <div className="candidate-info">
          <div className="candidate-name">{text}</div>
          <div className="candidate-contact">
            <small>{record.email}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Vị trí ứng tuyển",
      dataIndex: "position",
      key: "position",
      width: 150,
    },
    {
      title: "Độ phù hợp",
      dataIndex: "matchScore",
      key: "matchScore",
      width: 150,
      align: "center" as const,
      render: (score: number) => (
        <div>
          <Progress
            percent={score}
            size="small"
            strokeColor={
              score >= 80 ? "#52c41a" : score >= 60 ? "#faad14" : "#ff4d4f"
            }
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
      sorter: (a: TopCandidate, b: TopCandidate) => b.matchScore - a.matchScore,
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Kỹ năng",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string[]) => (
        <div className="skills-container">
          {skills?.slice(0, 3).map((skill, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {skill}
            </Tag>
          ))}
          {skills?.length > 3 && (
            <Tag color="default">+{skills.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status === "HOAN_THANH" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "appliedDate",
      key: "appliedDate",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a: TopCandidate, b: TopCandidate) =>
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime(),
    },
  ];

  return (
    <Card
      className="top-candidates-table"
      title={title}
      loading={loading}
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} ứng viên`,
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default TopCandidatesTable;
