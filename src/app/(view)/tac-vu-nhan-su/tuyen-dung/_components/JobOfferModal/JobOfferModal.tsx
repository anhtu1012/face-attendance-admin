/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JobOfferItem } from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import JobOfferServices from "@/services/tac-vu-nhan-su/phong-van-nhan-viec/job-offer.service";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import { generateUsernameFromFullName } from "@/utils/client/generateUsernameFromFullName";
import { Button, Card, DatePicker, Form, Input, Modal, Select } from "antd";
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
import { useSelector } from "react-redux";
import "./JobOfferModal.scss";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";

const { TextArea } = Input;

interface JobOfferModalProps {
  open: boolean;
  onClose: () => void;
  candidateData: TuyenDungItem | TuyenDungItem[] | null;
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
  const [scheduleTemplate, setScheduleTemplate] = useState<JobOfferItem[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);

  const { userProfile } = useSelector(selectAuthLogin);
  const messageApi = useAntdMessage();

  // Normalize candidateData to array
  const candidates = useMemo(() => {
    console.log("candidateData", candidateData);

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
      // reset any template selection state when opening modal
      setIsTemplateSelected(false);
    }
  }, [open, candidateData, form, candidates]);

  useEffect(() => {
    const loadTemplates = async () => {
      if (!open) return;
      try {
        const param = {
          fromDate: dayjs().startOf("day").toISOString(),
          toDate: dayjs().endOf("month").toISOString(),
          jobId: jobId,
        };
        const res = await JobOfferServices.getJobOffers([], undefined, param);
        const data = res?.data || [];
        setScheduleTemplate(data);
        const opts = data.map((t: any) => ({
          value: t.id,
          label: `${t.date ? dayjs(t.date).format("DD/MM/YYYY HH:mm") : ""}`,
        }));
        setTemplateOptions(opts);
      } catch (err) {
        console.error("Failed to load job-offer templates:", err);
      }
    };

    loadTemplates();
  }, [open, jobId]);

  const handleTemplateSelect = (templateId: string | undefined) => {
    if (!templateId) {
      setIsTemplateSelected(false);
      form.setFieldsValue({
        date: undefined,
        note: undefined,
      });
      return;
    }

    const tpl = scheduleTemplate.find((m) => m.id === templateId);
    if (!tpl) return;

    setIsTemplateSelected(true);

    const dateVal = tpl.date ? dayjs(tpl.date) : undefined;

    form.setFieldsValue({
      date: dateVal,
      userName:
        tpl.jobInfor?.recruiter?.fullName || tpl.jobInfor?.jobTitle || "",
      note: tpl.notes || undefined,
    });
  };

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
        listParticipantId: candidates
          .map((c) => c.id)
          .filter((id): id is string => id !== undefined),
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
      width={900}
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

              <Form.Item
                label="Các lịch nhận việc đã có"
                name="scheduleTemplate"
              >
                <Select
                  placeholder="Chọn lịch đã có để tự động điền"
                  size="large"
                  onChange={handleTemplateSelect}
                  options={templateOptions}
                  allowClear
                />
              </Form.Item>

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
                      disabled={isTemplateSelected}
                      size="large"
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
        </div>
      </div>
    </Modal>
  );
};

export default JobOfferModal;
