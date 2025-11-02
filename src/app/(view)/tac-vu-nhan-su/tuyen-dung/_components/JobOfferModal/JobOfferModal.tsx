/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { Button, Card, DatePicker, Form, Input, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaList,
  FaPhone,
  FaTh,
  FaUser,
} from "react-icons/fa";
import "./JobOfferModal.scss";
import { generateUsernameFromFullName } from "@/utils/client/generateUsernameFromFullName";
import InfoInterviewLeader from "../../../_components/InfoInterviewLeader/InfoInterviewLeader";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";

const { TextArea } = Input;

interface CandidateData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface JobOfferModalProps {
  open: boolean;
  onClose: () => void;
  candidateData?: CandidateData | CandidateData[];
  jobId: string;
  onSuccess?: () => void;
}

interface JobOfferFormData {
  date: Dayjs | null;
  userName: string;
  hrId: string;
  managedById: string;
  note?: string;
}

const JobOfferModal: React.FC<JobOfferModalProps> = ({
  open,
  onClose,
  candidateData,
  jobId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCandidateList, setShowCandidateList] = useState(true);
  const [displayMode, setDisplayMode] = useState<"list" | "chips">("chips");
  const [selectedInterviewers, setSelectedInterviewers] = useState<any[]>([]);
  const { userProfile } = useSelector(selectAuthLogin);
  const messageApi = useAntdMessage();

  // Normalize candidateData to array
  const candidates = useMemo(() => {
    if (!candidateData) return [];
    return Array.isArray(candidateData) ? candidateData : [candidateData];
  }, [candidateData]);

  useEffect(() => {
    if (open && candidateData) {
      form.resetFields();
      if (candidates.length === 1) {
        const defaultUsername = generateUsernameFromFullName(
          candidates[0].fullName
        );
        form.setFieldsValue({ userName: defaultUsername });
      } else {
        form.setFieldsValue({ userName: "" });
      }
    }
  }, [open, candidateData, form, candidates]);

  const handleSubmit = async (values: JobOfferFormData) => {
    if (candidates.length === 0) return;
    console.log("selectedInterviewers", values);

    setLoading(true);
    try {
      await TuyenDungServices.createOffer({
        date: values.date ? values.date.toISOString() : "",
        note: values.note,
        jobId: jobId,
        userName: values.userName,
        hrId: userProfile ? String(userProfile.id) : "",
        managedById:
          selectedInterviewers.length > 0
            ? selectedInterviewers[0].value
            : undefined,
        listParticipantId: candidates.map((c) => c.id),
      });
      messageApi.success("Tạo lịch hẹn nhận việc thành công!");

      if (onSuccess) {
        try {
          onSuccess();
        } catch (err) {
          console.warn("onSuccess callback failed:", err);
        }
      } else {
        handleClose();
      }
    } catch {
      messageApi.error("Có lỗi xảy ra khi tạo lịch hẹn nhận việc!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const disabledDate = (current: Dayjs) => {
    return current && current <= dayjs().startOf("day");
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaBuilding /> Tạo lịch hẹn nhận việc
        </div>
      }
      open={open}
      onCancel={handleClose}
      centered={false}
      footer={[
        <Button key="cancel" onClick={handleClose} size="large">
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          size="large"
          className="submit-btn"
          onClick={() => form.submit()}
        >
          {loading ? "Đang tạo lịch..." : "Tạo lịch hẹn nhận việc"}
        </Button>,
      ]}
      width={1200}
      className="job-offer-modal"
    >
      <div className="modal-content">
        {candidates.length > 0 && (
          <Card className="candidate-card" size="small">
            <div className="candidate-info-header">
              <div className="candidate-section-title">
                <FaUser style={{ marginRight: "8px" }} />
                <span>Danh sách ứng viên</span>
              </div>
              <div className="candidate-count-badge-wrapper">
                <div className="display-mode-toggle">
                  <button
                    className={`mode-btn ${
                      displayMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setDisplayMode("list")}
                    title="Hiển thị dạng danh sách"
                  >
                    <FaList />
                  </button>
                  <button
                    className={`mode-btn ${
                      displayMode === "chips" ? "active" : ""
                    }`}
                    onClick={() => setDisplayMode("chips")}
                    title="Hiển thị dạng chips"
                  >
                    <FaTh />
                  </button>
                </div>
                <div
                  className="candidate-count-badge"
                  onClick={() => setShowCandidateList(!showCandidateList)}
                >
                  <span className="count-number">{candidates.length}</span>
                  <span className="count-label">ứng viên</span>
                  {showCandidateList ? (
                    <FaChevronUp className="toggle-icon" />
                  ) : (
                    <FaChevronDown className="toggle-icon" />
                  )}
                </div>
              </div>
            </div>

            {showCandidateList && displayMode === "list" && (
              <div className="candidates-list">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-item">
                    <div className="candidate-number">{index + 1}</div>
                    <div className="candidate-info-content">
                      <h4 className="candidate-name">{candidate.fullName}</h4>
                      <div className="candidate-contact-details">
                        <div className="candidate-detail-item">
                          <FaEnvelope className="detail-icon" />
                          <span className="detail-text">{candidate.email}</span>
                        </div>
                        <div className="candidate-detail-item">
                          <FaPhone className="detail-icon" />
                          <span className="detail-text">{candidate.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showCandidateList && displayMode === "chips" && (
              <div className="candidates-chips">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-chip">
                    <span className="chip-number">{index + 1}</span>
                    <span className="chip-name">{candidate.fullName}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="form-container">
          <div className="form-section">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              labelCol={{ span: 24 }}
              className="job-offer-form"
            >
              <div className="form-section-title">
                <FaBuilding />
                Thông tin thời gian và địa điểm
              </div>

              <div className="form-row">
                <div className="form-col-6">
                  <Form.Item
                    name="date"
                    label="Ngày nhận việc"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày nhận việc!",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime
                      placeholder="Chọn ngày"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={disabledDate}
                      size="large"
                    />
                  </Form.Item>
                </div>
                <div className="form-col-6">
                  <Form.Item
                    name="userName"
                    label="Tên đăng nhập"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhận tên!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên đăng nhập"
                      size="large"
                      suffix={
                        <>
                          {" "}
                          <FaUser />
                        </>
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              <Form.Item name="note" label="Ghi chú">
                <TextArea
                  rows={4}
                  placeholder="Ghi chú thêm về buổi nhận việc (không bắt buộc)"
                />
              </Form.Item>
            </Form>
          </div>
          <div className="map-section">
            <div className="map-header">
              <FaUser />
              Chọn người quản lý
            </div>
            <div>
              <InfoInterviewLeader
                jobId={jobId}
                onSelectedChange={(selectInterviwer) => {
                  setSelectedInterviewers(selectInterviwer);
                }}
                maxSelectable={1}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobOfferModal;
