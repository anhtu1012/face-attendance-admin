"use client";

import { Button, Card, Typography } from "antd";
import React from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaMapMarked,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const { Title } = Typography;

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
    location?: {
      id: string;
      name: string;
      address: string;
      mapUrl: string;
    };
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
  // For demo purposes, using a search URL without API key
  const getDemoMapUrl = () => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096857648785!2d105.78405031442596!3d21.02880539313429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd5c3cfb3%3A0x1c98063b23b5a7b1!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1677837562541!5m2!1svi!2s`;
  };

  return (
    <Card className="invitation-card">
      <div className="invitation-header">
        <div className="company-logo">
          <FaBuilding className="logo-icon" />
        </div>

        <div className="invitation-title-section">
          <Title level={2} className="invitation-title">
            THÔNG BÁO MỜI PHỎNG VẤN
          </Title>
          <div className="company-name">FaceAI Technology Solutions</div>
          <div className="invitation-date">
            Ngày: {new Date().toLocaleDateString("vi-VN")}
          </div>
        </div>

        <div className="candidate-info">
          <div className="greeting">Kính gửi:</div>
          <div className="candidate-name">
            {interviewDetails.candidate.lastName}{" "}
            {interviewDetails.candidate.firstName}
          </div>
        </div>
      </div>

      <div className="invitation-body">
        <div className="intro-text">
          Công ty FaceAI Technology Solutions trân trọng thông báo về lịch phỏng
          vấn. Chúng tôi rất mong được gặp gỡ và trao đổi với Anh/Chị về cơ hội
          nghề nghiệp tại công ty.
        </div>

        <div className="interview-details-container">
          <div className="interview-details">
            <div className="details-title">
              <FaCalendarAlt className="title-icon" />
              THÔNG TIN PHỎNG VẤN
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Thời gian</div>
                  <div className="detail-value">
                    {interviewDetails.fullDateTime}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <FaBuilding className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">
                    {interviewDetails.interviewType === "offline"
                      ? "Địa điểm"
                      : "Hình thức"}
                  </div>
                  <div className="detail-value">
                    {interviewDetails.interviewType === "offline" &&
                    interviewDetails.location
                      ? interviewDetails.location.name
                      : "Phỏng vấn trực tuyến"}
                  </div>
                </div>
              </div>

              {interviewDetails.interviewType === "offline" &&
                interviewDetails.location && (
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Địa chỉ</div>
                      <div className="detail-value">
                        {interviewDetails.location.address}
                      </div>
                    </div>
                  </div>
                )}

              {interviewDetails.interviewType === "online" &&
                interviewDetails.meetingLink && (
                  <div className="detail-item">
                    <MdEmail className="detail-icon" />
                    <div className="detail-content">
                      <div className="detail-label">Link meeting</div>
                      <div className="detail-value">
                        <a
                          href={interviewDetails.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {interviewDetails.meetingLink}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Người phỏng vấn</div>
                  <div className="detail-value">
                    {interviewDetails.interviewer}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <MdEmail className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Email liên hệ</div>
                  <div className="detail-value">
                    {interviewDetails.interviewerEmail}
                  </div>
                </div>
              </div>

              {interviewDetails.notes && (
                <div className="detail-item">
                  <div className="detail-content">
                    <div className="detail-label">🗒️ Ghi chú</div>
                    <div className="detail-value">{interviewDetails.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="map-section">
            <div className="map-title">
              <FaMapMarked className="map-title-icon" />
              BẢN ĐỒ ĐỊNH VỊ
            </div>

            {interviewDetails.interviewType === "offline" &&
            interviewDetails.location ? (
              <div className="map-content">
                <div className="map-container">
                  <iframe
                    src={getDemoMapUrl()}
                    title="Interview Location Map"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="map-actions">
                  <Button
                    className="map-link"
                    icon={<FaMapMarked />}
                    href={interviewDetails.location.mapUrl}
                    target="_blank"
                  >
                    Xem trên Google Maps
                  </Button>
                </div>
              </div>
            ) : (
              <div className="online-meeting-info">
                <p>Buổi phỏng vấn sẽ được thực hiện trực tuyến.</p>
                {interviewDetails.meetingLink && (
                  <p>
                    Link meeting:
                    <a
                      href={interviewDetails.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {interviewDetails.meetingLink}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="closing-section">
          <div className="closing-text">
            Vui lòng xác nhận tham dự và có mặt đúng giờ. Chúng tôi rất mong
            được gặp gỡ Anh/Chị!
            <br />
            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ trực tiếp qua email
            hoặc số điện thoại bên dưới.
          </div>

          <div className="signature-section">
            <div className="signature">
              <div className="signature-title">Trân trọng,</div>
              <div className="signature-name">Ban Nhân sự</div>
            </div>

            <div className="company-info">
              <div className="company-name">FaceAI Technology Solutions</div>
              <div className="contact-info">
                Email: hr@faceai.vn
                <br />
                Phone: (028) 1234-5678
                <br />
                Website: www.faceai.vn
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvitationTemplate;
