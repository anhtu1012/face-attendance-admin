"use client";

import { Badge, Card, Empty, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaLink,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUserTie,
  FaVideo,
} from "react-icons/fa";
import "./SharedCardList.scss";

interface CompanyLocation {
  address?: string;
  name?: string;
}

interface BaseCardItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  interviewType: "online" | "offline";
  location?: CompanyLocation;
  meetingLink?: string;
  notes?: string;
  statusInterview:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";
  jobTitle?: string;
  department?: string;
  jobLevel?: string;
  originalData?: unknown;
}

interface InterviewCardItem extends BaseCardItem {
  type: "interview";
  interviewer?: string;
}

interface JobOfferCardItem extends BaseCardItem {
  type: "jobOffer";
  guidePersonName?: string;
}

type CardItem = InterviewCardItem | JobOfferCardItem;

interface SharedCardListProps<T = CardItem> {
  data: T[];
  loading: boolean;
  onChangeHandler?: (item: T) => void;
  baseRoute: string;
}

const statusConfig = {
  PENDING: {
    text: "Chờ xác nhận",
    color: "#FB8C00",
    gradient: "linear-gradient(135deg, #FFB74D, #FF9800)",
  },
  ACCEPTED: {
    text: "Đã chấp nhận",
    color: "#43A047",
    gradient: "linear-gradient(135deg, #66BB6A, #43A047)",
  },
  REJECTED: {
    text: "Từ chối",
    color: "#E53935",
    gradient: "linear-gradient(135deg, #EF5350, #E53935)",
  },
  COMPLETED: {
    text: "Hoàn thành",
    color: "#2E7D32",
    gradient: "linear-gradient(135deg, #4CAF50, #2E7D32)",
  },
  CANCELLED: {
    text: "Đã hủy",
    color: "#757575",
    gradient: "linear-gradient(135deg, #BDBDBD, #757575)",
  },
};

const SharedCardList = <T extends CardItem>({
  data,
  loading,
  baseRoute,
}: SharedCardListProps<T>) => {
  const router = useRouter();

  const handleCardClick = (item: T) => {
    router.push(`${baseRoute}/${item.id}`);
  };

  if (loading) {
    return (
      <div className="shared-card-list-loading">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="shared-card-list-empty">
        <Empty description="Chưa có lịch hẹn nào" />
      </div>
    );
  }

  return (
    <div className="shared-card-list">
      {data.map((item) => {
        const statusInfo = statusConfig[item.statusInterview];
        const isInterview = item.type === "interview";
        const isOnline = item.interviewType === "online";
        const locationDisplay =
          item.location?.name || item.location?.address || "Chưa xác định";

        return (
          <Card
            key={item.id}
            className="shared-card"
            hoverable
            onClick={() => handleCardClick(item)}
          >
            {/* Card Header - Status Color Background */}
            <div
              className="card-header"
              style={{ background: statusInfo.gradient }}
            >
              <div className="header-left">
                <div className="date-time">
                  <FaCalendarAlt className="icon" />
                  <span className="date">
                    {dayjs(item.date).format("DD/MM/YYYY")}
                  </span>
                  <span className="separator">•</span>
                  <FaClock className="icon" />
                  <span className="time">
                    {item.startTime} - {item.endTime}
                  </span>
                </div>
                <div className="status-text">{statusInfo.text}</div>
              </div>
              {isOnline && (
                <Badge
                  status="processing"
                  text="online"
                  className="online-badge"
                />
              )}
            </div>

            {/* Card Body - Compact Info */}
            <div className="card-body">
              {/* Job Title */}
              {item.jobTitle && (
                <h3 className="job-title">
                  <FaBriefcase className="title-icon" />
                  {item.jobTitle}
                </h3>
              )}

              {/* Job Meta */}
              {(item.department || item.jobLevel) && (
                <div className="job-meta">
                  {item.department && <Tag color="blue">{item.department}</Tag>}
                  {item.jobLevel && <Tag color="purple">{item.jobLevel}</Tag>}
                </div>
              )}

              {/* Location */}
              <div className="location-info">
                {isOnline ? (
                  <>
                    <FaVideo className="icon" />
                    {item.meetingLink ? (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meeting-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Tham gia cuộc họp <FaLink />
                      </a>
                    ) : (
                      <span>Phỏng vấn trực tuyến</span>
                    )}
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="icon" />
                    <span>{locationDisplay}</span>
                  </>
                )}
              </div>

              {/* Handler */}
              <div className="handler-info">
                <FaUserTie className="icon" />
                <span className="label">{isInterview ? "PV:" : "HD:"}</span>
                <span className="name">
                  {isInterview
                    ? item.interviewer || "Chưa phân công"
                    : item.guidePersonName || "Chưa phân công"}
                </span>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="notes">
                  <FaStickyNote className="icon" />
                  <span>{item.notes}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SharedCardList;
