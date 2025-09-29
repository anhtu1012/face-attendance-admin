"use client";

import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  TimePicker,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaDownload,
  FaEnvelope,
  FaMapMarked,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import InvitationTemplate from "./InvitationTemplate";
import { generateInvitationHTML } from "./invitationTemplateHTML";
import "./InterviewScheduleModal.scss";

const { Text } = Typography;
const { TextArea } = Input;

interface InterviewScheduleModalProps {
  open: boolean;
  onClose: () => void;
  candidateData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface InterviewFormData {
  date: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  interviewType: "online" | "offline";
  meetingLink?: string;
  interviewer: string;
  interviewerEmail: string;
  notes?: string;
}

interface CompanyLocation {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
}

interface InterviewDetails {
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
  location?: CompanyLocation;
  meetingLink?: string;
  interviewer: string;
  interviewerEmail: string;
  notes: string;
  fullDateTime: string;
}

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  open,
  onClose,
  candidateData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [interviewDetails, setInterviewDetails] =
    useState<InterviewDetails | null>(null);
  const [interviewType, setInterviewType] = useState<"online" | "offline">(
    "offline"
  );

  // Company location (only one location)
  const companyLocation: CompanyLocation = {
    id: "hq",
    name: "FaceAI Technology Solutions",
    address: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận Ba Đình, Hà Nội",
    mapUrl: "https://maps.google.com/?q=123+Đường+XYZ+Quận+Ba+Đình+Hà+Nội",
  };

  // Mock data for interviewers
  const interviewers = [
    {
      value: "nguyen.van.a",
      label: "Nguyễn Văn A - HR Manager",
      email: "nguyen.van.a@company.com",
    },
    {
      value: "tran.thi.b",
      label: "Trần Thị B - Technical Lead",
      email: "tran.thi.b@company.com",
    },
    {
      value: "le.van.c",
      label: "Lê Văn C - Senior Developer",
      email: "le.van.c@company.com",
    },
    {
      value: "pham.thi.d",
      label: "Phạm Thị D - Project Manager",
      email: "pham.thi.d@company.com",
    },
  ];

  useEffect(() => {
    if (open && candidateData) {
      form.resetFields();
      setShowInvitation(false);
      setInterviewDetails(null);
      setInterviewType("offline");
    }
  }, [open, candidateData, form]);

  const handleInterviewTypeChange = (type: "online" | "offline") => {
    setInterviewType(type);
  };

  const handleInterviewerChange = (interviewerValue: string) => {
    const interviewer = interviewers.find(
      (int) => int.value === interviewerValue
    );
    if (interviewer) {
      form.setFieldsValue({ interviewerEmail: interviewer.email });
    }
  };

  const handleSubmit = async (values: InterviewFormData) => {
    if (!candidateData) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const interviewer = interviewers.find(
        (int) => int.value === values.interviewer
      );

      const details: InterviewDetails = {
        candidate: candidateData,
        date: values.date?.format("DD/MM/YYYY") || "",
        startTime: values.startTime?.format("HH:mm") || "",
        endTime: values.endTime?.format("HH:mm") || "",
        interviewType: values.interviewType,
        location:
          values.interviewType === "offline" ? companyLocation : undefined,
        meetingLink: values.meetingLink,
        interviewer: interviewer?.label || "",
        interviewerEmail: values.interviewerEmail,
        notes: values.notes || "",
        fullDateTime: `${values.date?.format(
          "DD/MM/YYYY"
        )} từ ${values.startTime?.format("HH:mm")} đến ${values.endTime?.format(
          "HH:mm"
        )}`,
      };

      setInterviewDetails(details);
      setShowInvitation(true);

      message.success("Tạo lịch phỏng vấn thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi tạo lịch phỏng vấn!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvitation = async () => {
    if (!interviewDetails) return;

    try {
      // Dynamic import for html2canvas
      const html2canvas = (await import("html2canvas")).default;

      // Create a temporary div to render the invitation
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.padding = "40px";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Create invitation HTML content using the template
      tempDiv.innerHTML = generateInvitationHTML(interviewDetails);

      // Use html2canvas to convert to image
      const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Thu_moi_phong_van_${interviewDetails.candidate.lastName}_${interviewDetails.candidate.firstName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          message.success("Đã tải ảnh thư mời phỏng vấn!");
        }
      }, "image/png");

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating invitation image:", error);
      message.error("Có lỗi xảy ra khi tạo ảnh thư mời!");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setShowInvitation(false);
    setInterviewDetails(null);
    setInterviewType("offline");
    onClose();
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  if (showInvitation && interviewDetails) {
    return (
      <Modal
        title={
          <div className="modal-title">
            <FaCalendarAlt /> Thư mời phỏng vấn
          </div>
        }
        open={open}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Đóng
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<FaDownload />}
            onClick={handleDownloadInvitation}
            className="download-btn"
          >
            Tải ảnh thư mời
          </Button>,
        ]}
        width={1500}
        className="interview-invitation-modal"
      >
        <div className="invitation-content">
          <InvitationTemplate interviewDetails={interviewDetails} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaCalendarAlt /> Tạo lịch phỏng vấn
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={1000}
      className="interview-schedule-modal"
    >
      <div className="modal-content">
        {candidateData && (
          <Card className="candidate-card" size="small">
            <div className="candidate-info-header">
              <div className="candidate-avatar">
                <FaUser />
              </div>
              <div className="candidate-info">
                <h3 className="candidate-name">
                  {candidateData.lastName} {candidateData.firstName}
                </h3>
                <div className="candidate-title">Ứng viên phỏng vấn</div>
              </div>
            </div>
            <div className="candidate-details">
              <div className="candidate-detail-item">
                <FaEnvelope className="detail-icon" />
                <span className="detail-text">{candidateData.email}</span>
              </div>
              <div className="candidate-detail-item">
                <FaPhone className="detail-icon" />
                <span className="detail-text">{candidateData.phone}</span>
              </div>
            </div>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="interview-form"
        >
          <div className="form-row">
            <div className="form-col-6">
              <Form.Item
                name="date"
                label="Ngày phỏng vấn"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày phỏng vấn!" },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  disabledDate={disabledDate}
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="form-col-3">
              <Form.Item
                name="startTime"
                label="Giờ bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ bắt đầu!" },
                ]}
              >
                <TimePicker
                  placeholder="Giờ bắt đầu"
                  style={{ width: "100%" }}
                  format="HH:mm"
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="form-col-3">
              <Form.Item
                name="endTime"
                label="Giờ kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ kết thúc!" },
                ]}
              >
                <TimePicker
                  placeholder="Giờ kết thúc"
                  style={{ width: "100%" }}
                  format="HH:mm"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="interviewType"
            label="Hình thức phỏng vấn"
            rules={[
              { required: true, message: "Vui lòng chọn hình thức phỏng vấn!" },
            ]}
            initialValue="offline"
          >
            <Select
              placeholder="Chọn hình thức phỏng vấn"
              size="large"
              onChange={handleInterviewTypeChange}
              options={[
                { value: "offline", label: "Phỏng vấn trực tiếp tại công ty" },
                { value: "online", label: "Phỏng vấn trực tuyến" },
              ]}
            />
          </Form.Item>

          {interviewType === "offline" && (
            <Card className="location-info" size="small">
              <div className="location-item">
                <MdLocationOn className="location-icon" />
                <Text>
                  <strong>{companyLocation.name}</strong>
                </Text>
              </div>
              <div className="location-item">
                <Text>{companyLocation.address}</Text>
              </div>

              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096857648785!2d105.78405031442596!3d21.02880539313429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd5c3cfb3%3A0x1c98063b23b5a7b1!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1677837562541!5m2!1svi!2s"
                  title="Location Map"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "8px", marginTop: "12px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <Button
                type="link"
                size="small"
                icon={<FaMapMarked />}
                href={companyLocation.mapUrl}
                target="_blank"
                style={{ marginTop: "8px" }}
              >
                Xem trên Google Maps
              </Button>
            </Card>
          )}

          {interviewType === "online" && (
            <Form.Item
              name="meetingLink"
              label="Link meeting"
              rules={[
                { required: true, message: "Vui lòng nhập link meeting!" },
                { type: "url", message: "Link không hợp lệ!" },
              ]}
            >
              <Input
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                size="large"
              />
            </Form.Item>
          )}

          <div className="form-row">
            <div className="form-col-6">
              <Form.Item
                name="interviewer"
                label="Người phỏng vấn"
                rules={[
                  { required: true, message: "Vui lòng chọn người phỏng vấn!" },
                ]}
              >
                <Select
                  placeholder="Chọn người phỏng vấn"
                  size="large"
                  onChange={handleInterviewerChange}
                  options={interviewers}
                />
              </Form.Item>
            </div>
            <div className="form-col-6">
              <Form.Item
                name="interviewerEmail"
                label="Email người phỏng vấn"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Email người phỏng vấn"
                  size="large"
                  readOnly
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm về buổi phỏng vấn (không bắt buộc)"
            />
          </Form.Item>

          <div className="form-actions">
            <Space>
              <Button onClick={handleClose} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="submit-btn"
              >
                {loading ? "Đang tạo lịch..." : "Tạo lịch phỏng vấn"}
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default InterviewScheduleModal;
