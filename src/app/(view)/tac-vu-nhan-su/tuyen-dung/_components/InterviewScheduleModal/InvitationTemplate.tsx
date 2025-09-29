"use client";

import { Button, Card, Typography } from "antd";
import React from "react";
import { FaCalendarAlt, FaMapMarked, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const { Title, Text } = Typography;

interface InvitationTemplateProps {
  interviewDetails: {
    candidate: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    interviewType: "online" | "offline";
    location?: { id: string; name: string; address: string; mapUrl: string };
    meetingLink?: string;
    interviewer: string;
    interviewerEmail: string;
    notes: string;
    fullDateTime: string;
  };
}

const InvitationTemplate: React.FC<InvitationTemplateProps> = ({
  interviewDetails,
}) => {
  const getDemoMapUrl = () =>
    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096857648785!2d105.78405031442596!3d21.02880539313429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd5c3cfb3%3A0x1c98063b23b5a7b1!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1677837562541!5m2!1svi!2s`;

  return (
    <Card size="small" style={{ maxWidth: 700 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          THÔNG BÁO MỜI PHỎNG VẤN
        </Title>
        <Text type="secondary">FaceAI Technology Solutions</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Kính gửi: </Text>
        <Text style={{ color: "#1890ff" }}>
          {interviewDetails.candidate.lastName}{" "}
          {interviewDetails.candidate.firstName}
        </Text>
      </div>

      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <FaCalendarAlt style={{ marginRight: 8, color: "#1890ff" }} />
          <Text strong>Thời gian: </Text>
          <Text>{interviewDetails.fullDateTime}</Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <FaUser style={{ marginRight: 8, color: "#1890ff" }} />
          <Text strong>Người phỏng vấn: </Text>
          <Text>{interviewDetails.interviewer}</Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <MdEmail style={{ marginRight: 8, color: "#1890ff" }} />
          <Text strong>Email: </Text>
          <Text>{interviewDetails.interviewerEmail}</Text>
        </div>

        {interviewDetails.interviewType === "offline" &&
        interviewDetails.location ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Hình thức: </Text>
              <Text>Phỏng vấn trực tiếp</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Địa điểm: </Text>
              <Text>{interviewDetails.location.name}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Địa chỉ: </Text>
              <Text>{interviewDetails.location.address}</Text>
            </div>
            <div style={{ marginTop: 12 }}>
              <iframe
                src={getDemoMapUrl()}
                title="Location Map"
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: 4 }}
                allowFullScreen
                loading="lazy"
              />
              <Button
                type="link"
                size="small"
                icon={<FaMapMarked />}
                href={interviewDetails.location.mapUrl}
                target="_blank"
                style={{ marginTop: 8 }}
              >
                Xem trên Google Maps
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Hình thức: </Text>
              <Text>Phỏng vấn trực tuyến</Text>
            </div>
            {interviewDetails.meetingLink && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>Link meeting: </Text>
                <a
                  href={interviewDetails.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {interviewDetails.meetingLink}
                </a>
              </div>
            )}
          </>
        )}

        {interviewDetails.notes && (
          <div style={{ marginTop: 8 }}>
            <Text strong>Ghi chú: </Text>
            <Text italic>{interviewDetails.notes}</Text>
          </div>
        )}
      </Card>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Text>Vui lòng xác nhận tham dự đúng giờ.</Text>
        <br />
        <Text type="secondary" style={{ fontSize: "12px", marginTop: 8 }}>
          Ban Nhân sự - FaceAI Technology Solutions
        </Text>
      </div>
    </Card>
  );
};

export default InvitationTemplate;
