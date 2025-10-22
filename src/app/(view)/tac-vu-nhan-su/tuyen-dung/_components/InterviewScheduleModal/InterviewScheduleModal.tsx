/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SelectOption } from "@/dtos/select/select.dto";
import {
  AppointmentItem,
  CreateAppointmentRequest,
} from "@/dtos/tac-vu-nhan-su/phong-van-nhan-viec/interview.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { InterviewFormData, InterviewScheduleModalProps } from ".";
import "./InterviewScheduleModal.scss";
import InfoInterviewLeader from "../InfoInterviewLeader/InfoInterviewLeader";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";

const { TextArea } = Input;

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  open,
  onClose,
  candidateData,
  jobId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { companyInformation } = useSelector(selectAuthLogin);
  const [interviewType, setInterviewType] = useState<"online" | "offline">(
    "offline"
  );

  const [selectedInterviewers, setSelectedInterviewers] = useState<any[]>([]);
  const [timeKey, setTimeKey] = useState(0);
  const [scheduleTemplate, setScheduleTemplate] = useState<AppointmentItem[]>(
    []
  );
  const [templateOptions, setTemplateOptions] = useState<SelectOption[]>([]);
  const messageApi = useAntdMessage();

  const handleTemplateSelect = (templateId: string | undefined) => {
    if (!templateId) {
      // clear template selection
      form.setFieldsValue({
        date: undefined,
        startTime: undefined,
        endTime: undefined,
        meetingLink: undefined,
      });
      return;
    }

    const tpl = scheduleTemplate.find(
      (m: AppointmentItem) => m.id === templateId
    );
    if (!tpl) return;

    // Normalize interviewType to match form values (lowercase)
    const normalizedType =
      typeof tpl.interviewType === "string" &&
      tpl.interviewType.toLowerCase() === "online"
        ? "online"
        : "offline";

    setInterviewType(normalizedType as "online" | "offline");

    // tpl fields are ISO strings; convert to Dayjs for Antd DatePicker/TimePicker
    const dateVal = tpl.interviewDate ? dayjs(tpl.interviewDate) : undefined;
    const startVal = tpl.startTime ? dayjs(tpl.startTime) : undefined;
    const endVal = tpl.endTime ? dayjs(tpl.endTime) : undefined;

    form.setFieldsValue({
      date: dateVal,
      startTime: startVal,
      endTime: endVal,
      typeAppointment: normalizedType,
      linkMeet: tpl.meetingLink || undefined,
    });
  };

  useEffect(() => {
    if (open && candidateData) {
      form.resetFields();
      setInterviewType("offline");
    }
  }, [open, candidateData, form]);

  // Fetch interviewers for the given job when modal opens or jobId changes
  useEffect(() => {
    const loadInterviewers = async () => {
      if (!open) return;

      try {
        if (!jobId) return;
        const resSh = await TuyenDungServices.getDanhSachPhongVan(
          [],
          undefined,
          {
            jobId,
          }
        );
        setScheduleTemplate(resSh?.data);
        const data = resSh.data.map((t: AppointmentItem) => ({
          value: t.id as string,
          label: `${dayjs(t.interviewDate).format("DD/MM/YYYY")} - ${dayjs(
            t.startTime
          ).format("HH:mm")} đến ${dayjs(t.endTime).format("HH:mm")}`,
        }));
        setTemplateOptions(data);
      } catch (err) {
        console.error("Failed to load interviewers:", err);
        messageApi.error("Không thể tải danh sách người phỏng vấn");
      }
    };

    loadInterviewers();
  }, [open, jobId, messageApi, candidateData]);

  const handleInterviewTypeChange = (type: "online" | "offline") => {
    setInterviewType(type);
  };

  const handleSubmit = async (values: InterviewFormData) => {
    if (!candidateData) return;
    if (selectedInterviewers.length === 0) {
      messageApi.error("Vui lòng chọn ít nhất một người phỏng vấn!");
      return;
    }
    const selectedDate = values.date ? dayjs(values.date) : undefined;
    const start = values.startTime ? dayjs(values.startTime) : undefined;
    const end = values.endTime ? dayjs(values.endTime) : undefined;
    // If date is today, start time cannot be before now
    if (selectedDate && start && selectedDate.isSame(dayjs(), "day")) {
      if (start.isBefore(dayjs())) {
        messageApi.error("Giờ bắt đầu phải sau thời gian hiện tại!");
        return;
      }
    }
    // Start must be strictly before end
    if (start && end && !start.isBefore(end)) {
      messageApi.error("Giờ bắt đầu phải trước giờ kết thúc!");
      return;
    }

    // Convert values to ISO strings for submission, ensure string type (fallback to empty string if missing)
    const dateStr = values.date ? dayjs(values.date).toISOString() : "";
    const startTimeStr = values.startTime
      ? dayjs(values.startTime).toISOString()
      : "";
    const endTimeStr = values.endTime
      ? dayjs(values.endTime).toISOString()
      : "";

    setLoading(true);
    try {
      const payload: CreateAppointmentRequest = {
        ...values,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        listIntervieweeId: [candidateData.id],
        address: companyInformation.addressLine,
        jobId: jobId || "",
        interviewerId: selectedInterviewers.map(
          (interviewer) => interviewer.value
        ),
        interviewerCount: selectedInterviewers.length,
      };
      // Update candidate status to INTERVIEW_SCHEDULED
      await TuyenDungServices.createAppointment(
        payload as CreateAppointmentRequest
      );

      messageApi.success("Tạo lịch phỏng vấn thành công!");
      try {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      } catch (err) {
        // swallow errors from parent callback
        console.warn("onSuccess callback failed:", err);
      }
    } catch (error: unknown) {
      const errMsg =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Có lỗi xảy ra khi tạo lịch phỏng vấn!";
      messageApi.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setInterviewType("offline");
    onClose();
  };

  const disabledDate = (current: Dayjs) => {
    return current && current <= dayjs().endOf("day");
  };

  // Disable times for startTime when selected date is today: can't pick past times
  const disabledStartHours = () => {
    const raw = form.getFieldValue("date");
    if (!raw) return [];
    const selected = dayjs(raw);
    const today = dayjs();
    if (selected.isAfter(today, "day")) {
      // future date -> no disabled hours
      return [];
    }
    if (selected.isSame(today, "day")) {
      const curHour = today.hour();
      return Array.from({ length: curHour }, (_, i) => i);
    }
    return [];
  };

  const disabledStartMinutes = (selectedHour: number) => {
    const raw = form.getFieldValue("date");
    if (!raw) return [];
    const selected = dayjs(raw);
    const today = dayjs();
    if (selected.isAfter(today, "day")) return [];
    if (selected.isSame(today, "day")) {
      const now = today;
      if (selectedHour === now.hour()) {
        const curMinute = now.minute();
        return Array.from({ length: curMinute + 1 }, (_, i) => i);
      }
    }
    return [];
  };

  // Disable times for endTime so it cannot be before or equal to startTime
  const disabledEndHours = () => {
    const startRaw: Dayjs | undefined = form.getFieldValue("startTime");
    if (!startRaw) return [];
    const start = dayjs(startRaw);
    const startHour = start.hour();
    return Array.from({ length: startHour }, (_, i) => i);
  };

  const disabledEndMinutes = (selectedHour: number) => {
    const startRaw: Dayjs | undefined = form.getFieldValue("startTime");
    if (!startRaw) return [];
    const s = dayjs(startRaw);
    const sHour = s.hour();
    const sMin = s.minute();
    if (selectedHour === sHour) {
      return Array.from({ length: sMin + 1 }, (_, i) => i);
    }
    return [];
  };

  const disabledStartTime = () => ({
    disabledHours: disabledStartHours,
    disabledMinutes: disabledStartMinutes,
  });

  const disabledEndTime = () => ({
    disabledHours: disabledEndHours,
    disabledMinutes: disabledEndMinutes,
  });

  return (
    <Modal
      title={
        <div className="modal-title">
          <FaCalendarAlt /> Tạo lịch phỏng vấn
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
          {loading ? "Đang tạo lịch..." : "Tạo lịch phỏng vấn"}
        </Button>,
      ]}
      width={1400}
      className="interview-schedule-modal"
    >
      <div className="modal-content">
        <>
          {candidateData && (
            <Card className="candidate-card" size="small">
              <div className="candidate-info-header">
                <div className="candidate-info">
                  <div className="candidate-avatar">
                    <FaUser />
                  </div>
                  <div className="candidate-name-section">
                    <h3 className="candidate-name">{candidateData.fullName}</h3>
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
              </div>
            </Card>
          )}

          <div className="form-container">
            <div className="form-section">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="interview-form"
                onValuesChange={(changedValues) => {
                  if (
                    changedValues &&
                    (changedValues.date || changedValues.startTime)
                  ) {
                    setTimeKey((k) => k + 1);
                  }
                }}
              >
                <div className="form-section-title">
                  <FaCalendarAlt />
                  Thông tin thời gian
                </div>

                <Form.Item label="Các lịch hẹn đã có" name="scheduleTemplate">
                  <Select
                    placeholder="Chọn mẫu để tự động điền"
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
                      label="Ngày phỏng vấn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày phỏng vấn!",
                        },
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
                        {
                          required: true,
                          message: "Vui lòng chọn giờ bắt đầu!",
                        },
                      ]}
                    >
                      <TimePicker
                        placeholder="Giờ bắt đầu"
                        style={{ width: "100%" }}
                        format="HH:mm"
                        size="large"
                        disabledTime={disabledStartTime}
                        key={timeKey}
                      />
                    </Form.Item>
                  </div>
                  <div className="form-col-3">
                    <Form.Item
                      name="endTime"
                      label="Giờ kết thúc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giờ kết thúc!",
                        },
                      ]}
                    >
                      <TimePicker
                        placeholder="Giờ kết thúc"
                        style={{ width: "100%" }}
                        format="HH:mm"
                        size="large"
                        disabledTime={disabledEndTime}
                        key={timeKey}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-col-6">
                    <Form.Item
                      name="typeAppointment"
                      label="Hình thức phỏng vấn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn hình thức phỏng vấn!",
                        },
                      ]}
                      initialValue="offline"
                    >
                      <Select
                        placeholder="Chọn hình thức phỏng vấn"
                        size="large"
                        onChange={handleInterviewTypeChange}
                        options={[
                          {
                            value: "offline",
                            label: "Phỏng vấn trực tiếp tại công ty",
                          },
                          { value: "online", label: "Phỏng vấn trực tuyến" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>
                {interviewType === "online" && (
                  <Form.Item
                    name="linkMeet"
                    label="Link meeting"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập link meeting!",
                      },
                      { type: "url", message: "Link không hợp lệ!" },
                    ]}
                  >
                    <Input
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      size="large"
                    />
                  </Form.Item>
                )}

                <Form.Item name="notes" label="Ghi chú">
                  <TextArea
                    rows={4}
                    placeholder="Ghi chú thêm về buổi phỏng vấn (không bắt buộc)"
                  />
                </Form.Item>
              </Form>
            </div>

            <div className="map-section">
              <div className="map-header">
                <FaUser />
                Thông tin người phỏng vấn
              </div>
              <div>
                <InfoInterviewLeader
                  jobId={jobId}
                  onSelectedChange={(selectInterviwer) => {
                    setSelectedInterviewers(selectInterviwer);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      </div>
    </Modal>
  );
};

export default InterviewScheduleModal;
