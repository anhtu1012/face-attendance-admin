/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AIAnalysisResultModal from "@/components/AIAnalysisResultModal/AIAnalysisResultModal";
import Cbutton from "@/components/basicUI/Cbutton";
import { CreateInterviewReportRequest } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.request.dto";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import QuanLyPhongVanServices from "@/services/tac-vu-nhan-su/quan-ly-phong-van/quan-ly-phong-van.service";
import { RoleAdmin } from "@/types/enum";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Popover,
  Progress,
  Space,
  Table,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaLightbulb,
  FaMedal,
  FaPhone,
  FaSearch,
  FaTrophy,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { useSelector } from "react-redux";
import ReportListModal from "../ReportListModal/ReportListModal";
import ReportModal from "../ReportModal/ReportModal";
import "./CandidateListTab.scss";
import { InfoCircleOutlined } from "@ant-design/icons";
interface CandidateListTabProps {
  jobId?: string;
  appointmentId?: string;
}

export default function CandidateListTab({
  jobId,
  appointmentId,
}: CandidateListTabProps) {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<TuyenDungItem[]>([]);
  const [searchText, setSearchText] = useState("");

  // new: modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<TuyenDungItem | null>(null);

  // report modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCandidate, setReportCandidate] = useState<TuyenDungItem | null>(
    null
  );

  // report list modal state
  const [reportListOpen, setReportListOpen] = useState(false);
  const [reportListCandidate, setReportListCandidate] =
    useState<TuyenDungItem | null>(null);
  const [reportList, setReportList] = useState<any[]>([]);

  const { userProfile } = useSelector(selectAuthLogin);
  const messageApi = useAntdMessage();

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, appointmentId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await QuanLyPhongVanServices.getUngVien([], undefined, {
        appointmentId: appointmentId || "",
      });
      setCandidates(response.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportList = async (
    candidateId?: string,
    candidate?: TuyenDungItem
  ) => {
    if (!candidateId) return;
    try {
      const response = await QuanLyPhongVanServices.getReportDetail(
        [],
        undefined,
        {
          intervieweeId: candidateId,
        }
      );
      setReportList(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      setReportListCandidate(candidate || null);
      setReportListOpen(true);
    } catch (error) {
      console.error("Error fetching report list:", error);
      messageApi.error("Không thể tải danh sách báo cáo");
    }
  };

  const columns: ColumnsType<TuyenDungItem> = [
    {
      title: "Ứng viên",
      key: "candidate",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <div className="candidate-info">
          <Avatar
            size={48}
            src={"../../../../../assets/images/default-avatar.png"}
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
            <div className="candidate-gender">
              {record.birthday
                ? dayjs(record.birthday).format("DD/MM/YYYY")
                : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tỉ lệ phù hợp",
      dataIndex: "analysisResult",
      key: "analysis",
      width: 120,
      render: (analysisResult: any) => {
        if (!analysisResult) return "-";
        const score =
          typeof analysisResult.matchScore === "number"
            ? analysisResult.matchScore
            : 0;

        return (
          <div
            className="match-recommend-cell"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              justifyContent: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Progress
                type="circle"
                percent={score}
                width={64}
                strokeWidth={8}
                strokeColor={{
                  "0%": "rgb(13, 71, 161)",
                  "100%": "rgb(30, 136, 229)",
                }}
                format={(p) => (
                  <span style={{ fontWeight: 700, color: "rgb(13,71,161)" }}>
                    {p}%
                  </span>
                )}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Khuyến nghị",
      dataIndex: "analysisResult",
      key: "analysis",
      width: 150,
      render: (analysisResult: any) => {
        if (!analysisResult) return "-";
        const getRecommendationBadge = (recommendation?: string) => {
          switch (recommendation) {
            case "Strongly Recommend":
              return {
                icon: <FaTrophy />,
                className: "strongly-recommend",
                text: "Khuyến nghị mạnh mẽ",
              };
            case "Recommend":
              return {
                icon: <FaMedal />,
                className: "recommend",
                text: "Khuyến nghị",
              };
            case "Consider":
              return {
                icon: <FaLightbulb />,
                className: "consider",
                text: "Cân nhắc",
              };
            default:
              return {
                icon: <FaExclamationCircle />,
                className: "not-a-good-fit",
                text: "Không phù hợp",
              };
          }
        };

        const badge = getRecommendationBadge(analysisResult.recommendation);

        return (
          <div
            className="match-recommend-cell"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              justifyContent: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 120,
              }}
            >
              <Tooltip title={analysisResult.recommendation}>
                <div
                  className={`rec-badge ${badge.className}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {badge.icon} {badge.text}
                </div>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thông tin liên hệ",
      key: "contact",
      width: 240,
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
      title: "TT ứng viên",
      dataIndex: "isExisted",
      key: "isExisted",
      width: 100,
      render: (_, record) => (
        <>
          {" "}
          <Popover
            content={record.reason}
            title={record.isExisted ? "Lý do (Nhân viên cũ)" : "Ghi chú"}
            trigger="click"
          >
            <Button
              size="small"
              type={record.isExisted ? "primary" : "default"}
              icon={<InfoCircleOutlined />}
            >
              {record.isExisted ? "Nhân viên cũ" : "Mới"}
            </Button>
          </Popover>
        </>
      ),
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
      width: 250,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Cbutton
            type="primary"
            size="small"
            icon={<IoMdAnalytics />}
            origin={{
              border: "1px solid rgb(21, 101, 192)",
              color: "white",
              bgcolor:
                "linear-gradient(135deg, rgb(21, 101, 192), rgb(30, 136, 229))",
            }}
            onClick={() => {
              setSelectedCandidate(record);
              setModalOpen(true);
            }}
          >
            Chi tiết
          </Cbutton>

          {userProfile.roleId === RoleAdmin.DEPARTMENT_MANAGER && (
            <Cbutton
              type="default"
              size="small"
              icon={<TfiWrite />}
              origin={{
                color: "rgb(21, 101, 192)",
                bgcolor: "white",
                border: "1px solid rgb(21, 101, 192)",
                hoverColor: "white",
                hoverBgColor:
                  "linear-gradient(135deg, rgb(21, 101, 192), rgb(30, 136, 229))",
              }}
              onClick={() => {
                setReportCandidate(record);
                setReportOpen(true);
              }}
            >
              Báo cáo
            </Cbutton>
          )}
          <Cbutton
            type="default"
            origin={{
              color: "rgb(21, 101, 192)",
              bgcolor: "white",
              border: "1px solid rgb(21, 101, 192)",
              hoverColor: "white",
              hoverBgColor:
                "linear-gradient(135deg, rgb(21, 101, 192), rgb(30, 136, 229))",
            }}
            size="small"
            icon={<FaEye />}
            onClick={() => {
              fetchReportList(record.id, record);
            }}
          >
            Xem BC
          </Cbutton>
        </Space>
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
  const handleSubmitReport = async (payload: {
    candidateId?: string;
    status: CreateInterviewReportRequest["status"];
    description: string;
  }) => {
    try {
      if (!payload.candidateId) {
        messageApi.error("Ứng viên không hợp lệ");
        return;
      }
      if (!userProfile?.id) {
        messageApi.error("Người dùng không hợp lệ");
        return;
      }

      const data: CreateInterviewReportRequest = {
        status: payload.status,
        description: payload.description,
        intervieweeId: payload.candidateId,
        userId: String(userProfile.id),
      };
      await QuanLyPhongVanServices.createReport(data);
      messageApi.success("Báo cáo ứng viên thành công");
      // Refresh candidate list after report submission
      fetchCandidates();
      setReportOpen(false);
      setReportCandidate(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      messageApi.error("Báo cáo ứng viên thất bại");
    }
  };

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

      {/* AI Analysis Result Modal */}
      <AIAnalysisResultModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCandidate(null);
        }}
        analysisResult={
          selectedCandidate ? selectedCandidate.analysisResult ?? null : null
        }
      />

      {/* Report Modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
          setReportCandidate(null);
        }}
        candidate={reportCandidate}
        onSubmit={handleSubmitReport}
      />

      {/* Report List Modal */}
      <ReportListModal
        open={reportListOpen}
        onClose={() => {
          setReportListOpen(false);
          setReportListCandidate(null);
          setReportList([]);
        }}
        reports={reportList}
        candidateName={reportListCandidate?.fullName}
        onViewDetail={(report) => {
          // You can open another modal or navigate to detail page
          console.log("View report detail:", report);
          messageApi.info("Chi tiết báo cáo: " + report.id);
        }}
      />
    </div>
  );
}
