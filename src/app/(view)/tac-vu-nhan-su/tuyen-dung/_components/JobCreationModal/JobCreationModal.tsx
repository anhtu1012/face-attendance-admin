/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectOption } from "@/dtos/select/select.dto";
import { CreateJobRequest } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job.request.dto";
import { JobDetail } from "@/dtos/tac-vu-nhan-su/tuyen-dung/job/job-detail.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import SelectServices from "@/services/select/select.service";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tabs,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { FaBriefcase, FaCheck, FaInfoCircle, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./JobCreationModal.scss";
import QuillEditor from "./QuillEditor";

// Form values type with dayjs for DatePicker and extra fields for display
type JobFormValues = Omit<CreateJobRequest, "expirationDate"> & {
  expirationDate?: Dayjs | string;
  supervisorName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  recruiterPosition?: string;
  role?: string;
};

interface JobCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (link: string) => void;
  selectOptions: {
    selectRole: SelectOption[];
    selectSkill: SelectOption[];
    selectExperience: SelectOption[];
    selectDepartment: SelectOption[];
  };
  mode?: "create" | "edit";
  initialData?: JobDetail;
}

const JobCreationModal: React.FC<JobCreationModalProps> = ({
  open,
  onClose,
  onSuccess,
  selectOptions,
  mode = "create",
  initialData,
}) => {
  const [form] = Form.useForm<JobFormValues>();
  const [loading, setLoading] = useState(false);
  const messageApi = useAntdMessage();
  const { userProfile } = useSelector(selectAuthLogin);
  const [positionOptionsState, setPositionOptionsState] =
    useState<SelectOption[]>();
  // Do not keep duplicate state for role/department — read directly from the form when needed

  const fetchPositions = async (role?: string, departmentId?: string) => {
    if (!role || !departmentId) return;
    try {
      const res = await SelectServices.getSelectPositionWithRoleAndDepartment(
        departmentId
      );
      setPositionOptionsState(res.data || []);
      form.setFieldsValue({ positionId: undefined });
    } catch (err) {
      console.error("Error fetching positions for role+department", err);
      setPositionOptionsState([]);
    }
  };

  const handleRoleChange = (value: string) => {
    // read department from form to avoid stale state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dept = (form.getFieldValue as any)("departmentId") as
      | string
      | undefined;
    if (dept) {
      fetchPositions(value, dept);
    } else {
      setPositionOptionsState([]);
      form.setFieldsValue({ positionId: undefined });
    }
  };

  const handleDepartmentChange = (value: string) => {
    // read role from form to avoid stale state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (form.getFieldValue as any)("role") as string | undefined;
    if (role) {
      fetchPositions(role, value);
    } else {
      setPositionOptionsState([]);
      form.setFieldsValue({ positionId: undefined });
    }
  };

  const probationOptions = [
    { value: "1_MONTH", label: "1 tháng" },
    { value: "2_MONTHS", label: "2 tháng" },
    { value: "3_MONTHS", label: "3 tháng" },
    { value: "6_MONTHS", label: "6 tháng" },
  ];

  // Populate form when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData && open) {
      // Note: role and departmentId might not be in JobDetail, so we check carefully
      // For now, we'll populate available fields from initialData

      form.setFieldsValue({
        jobTitle: initialData.jobTitle,
        requireExperience: initialData.requireExperience,
        positionId: initialData.positionId
          ? String(initialData.positionId)
          : undefined,
        address: initialData.address,
        fromSalary: initialData.fromSalary,
        toSalary: initialData.toSalary,
        trialPeriod: initialData.trialPeriod,
        expirationDate: initialData.expirationDate
          ? dayjs(initialData.expirationDate)
          : undefined,
        requireSkill: Array.isArray(initialData.requireSkill)
          ? initialData.requireSkill.map((s) => {
              const str = String(s);
              const found = (selectOptions.selectSkill || []).find(
                (o) => o.value === str || o.label === str
              );
              return found ? found.value : str;
            })
          : initialData.requireSkill,
        jobDescription: initialData.jobDescription,
        jobResponsibility: initialData.jobResponsibility,
        jobOverview: initialData.jobOverview,
        jobBenefit: initialData.jobBenefit,
        supervisorId: initialData.supervisorId
          ? String(initialData.supervisorId)
          : undefined,
        supervisorName: initialData.recruiter?.fullName || "",
        recruiterEmail: initialData.recruiter?.email || "",
        recruiterPhone: initialData.recruiter?.phone || "",
        recruiterPosition: initialData.recruiter?.positionName || "HR Manager",
      });
    } else if (mode === "create" && open) {
      // Reset form when switching back to create mode
      form.resetFields();
    }
  }, [mode, initialData, open, form]);

  const handleSubmit = async (values: JobFormValues) => {
    setLoading(true);
    try {
      // Normalize requireSkill to array of values (strings) in case Select
      // returned label/value objects or mixed types during edit.
      const normalizedSkills = Array.isArray(values.requireSkill)
        ? values.requireSkill.map((s) =>
            typeof s === "string" ? s : (s as any)?.value ?? String(s)
          )
        : undefined;

      // Convert dayjs to ISO string if present
      const payload: CreateJobRequest = {
        ...values,
        requireSkill: normalizedSkills,
        expirationDate:
          values.expirationDate && dayjs.isDayjs(values.expirationDate)
            ? values.expirationDate.toISOString()
            : typeof values.expirationDate === "string"
            ? values.expirationDate
            : undefined,
      };

      if (mode === "edit" && initialData) {
        // Update existing job
        await JobServices.updateJob(String(initialData.id), payload);
        const jobLink = `${window.location.origin}/apply/${initialData.jobCode}`;
        messageApi.success("Cập nhật công việc thành công!");
        form.resetFields();
        onSuccess(jobLink);

        // Dispatch a global event so other components can refresh
        try {
          window.dispatchEvent(
            new CustomEvent("jobUpdated", {
              detail: { jobCode: initialData.jobCode },
            })
          );
        } catch (e) {
          console.warn("Failed to dispatch jobUpdated event", e);
        }
      } else {
        // Create new job
        const res = await JobServices.createJob(payload);
        const jobId = res?.jobCode || "12345";
        const jobLink = `${window.location.origin}/apply/${jobId}`;
        messageApi.success("Tạo công việc thành công!");
        form.resetFields();
        onSuccess(jobLink);

        // Dispatch a global event so other components (e.g., ListJob) can re-fetch job list
        try {
          const detail = res ?? { jobCode: jobId };
          window.dispatchEvent(new CustomEvent("jobCreated", { detail }));
        } catch (e) {
          console.warn("Failed to dispatch jobCreated event", e);
        }
      }
    } catch (error: unknown) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} job:`,
        error
      );
      messageApi.error(
        `Có lỗi xảy ra khi ${mode === "edit" ? "cập nhật" : "tạo"} công việc!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <div className="title-content">
            {/* <FaBriefcase className="title-icon" /> */}
            <span className="title-text">
              {mode === "edit" ? "Chỉnh Sửa Công Việc" : "Tạo Công Việc Mới"}
            </span>
          </div>

          <div className="title-decoration"></div>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      className="job-creation-modal"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="job-creation-form"
        requiredMark="optional"
        initialValues={{
          company: "IT Human Resources Company",
          workingHours: "8:00 - 17:30 (T2-T6)",
          trialPeriod: "0",
          role: "5",
          supervisorId: userProfile?.id || "",
          supervisorName: userProfile?.fullName || "",
          recruiterEmail: userProfile?.email || "",
          recruiterPhone: userProfile?.phone || "",
          recruiterPosition: "HR Manager",
          address: "Tp.HCM",
        }}
      >
        <Tabs
          defaultActiveKey="1"
          className="creation-tabs"
          items={[
            {
              key: "1",
              label: (
                <span>
                  <FaInfoCircle />
                  Thông tin cơ bản
                </span>
              ),
              children: (
                <div className="tab-content">
                  <div className="form-section">
                    <h4 className="section-title">
                      <FaBriefcase /> Thông tin công việc
                    </h4>
                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="jobTitle"
                          label="Tên công việc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên công việc!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: Senior Frontend Developer"
                            className="custom-input"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-6">
                        <Form.Item
                          name="requireExperience"
                          label="Kinh nghiệm yêu cầu"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn mức kinh nghiệm!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn mức kinh nghiệm..."
                            options={selectOptions.selectExperience}
                            className="custom-select"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-4">
                        <Form.Item
                          name="role"
                          label="Vai trò"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn vai trò!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn vai trò..."
                            options={selectOptions.selectRole}
                            className="custom-select"
                            onChange={handleRoleChange}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-4">
                        <Form.Item
                          name="departmentId"
                          label="Phòng ban"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn phòng ban!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn phòng ban"
                            options={selectOptions.selectDepartment}
                            className="custom-select"
                            onChange={handleDepartmentChange}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-4">
                        <Form.Item
                          name="positionId"
                          label="Vị trí"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn vị trí!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn vị trí..."
                            options={positionOptionsState}
                            className="custom-select"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row" style={{ display: "none" }}>
                      <div className="form-col-6">
                        <Form.Item
                          name="address"
                          label="Địa điểm"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập địa điểm!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: Hà Nội, TP.HCM, Remote..."
                            className="custom-input"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="section-title">Mức lương & Thời gian</h4>
                    <div className="form-row">
                      <div className="form-col-3">
                        <Form.Item
                          name="fromSalary"
                          label="Lương tối thiểu (triệu VNĐ)"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập lương tối thiểu!",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="15"
                            className="custom-input-number"
                            style={{ width: "100%" }}
                            min={0}
                            max={200}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-3">
                        <Form.Item
                          name="toSalary"
                          label="Lương tối đa (triệu VNĐ)"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập lương tối đa!",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="25"
                            className="custom-input-number"
                            style={{ width: "100%" }}
                            min={0}
                            max={200}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-3">
                        <Form.Item
                          name="trialPeriod"
                          label="Thời gian thử việc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thời gian thử việc!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn thời gian..."
                            options={probationOptions}
                            className="custom-select"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-3">
                        <Form.Item
                          name="expirationDate"
                          label="Hạn nộp hồ sơ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn hạn nộp!",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Chọn ngày hết hạn"
                            className="custom-datepicker"
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            disabledDate={(current) =>
                              !!current && current < dayjs().startOf("day")
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="requireSkill"
                          label="Kỹ năng yêu cầu"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ít nhất 1 kỹ năng!",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Chọn kỹ năng yêu cầu..."
                            options={selectOptions.selectSkill}
                            className="custom-select"
                            maxTagCount="responsive"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <FaBriefcase />
                  Mô tả công việc
                </span>
              ),
              children: (
                <div className="tab-content">
                  <div className="form-section">
                    <h4 className="section-title">Nội dung công việc</h4>

                    <Form.Item
                      name="jobDescription"
                      label="Mô tả tổng quan"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả công việc!",
                        },
                      ]}
                    >
                      <QuillEditor
                        placeholder="Mô tả tổng quan về công việc, môi trường làm việc, cơ hội phát triển..."
                        value=""
                        onChange={() => {}}
                        style={{ minHeight: "120px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="jobResponsibility"
                      label="Trách nhiệm công việc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập trách nhiệm công việc!",
                        },
                      ]}
                    >
                      <QuillEditor
                        placeholder="• Phát triển các tính năng frontend mới • Tối ưu hóa hiệu suất ứng dụng • Review code..."
                        value=""
                        onChange={() => {}}
                        style={{ minHeight: "120px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="jobOverview"
                      label="Yêu cầu ứng viên"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập yêu cầu ứng viên!",
                        },
                      ]}
                    >
                      <QuillEditor
                        placeholder="• Kinh nghiệm 3+ năm với React, TypeScript • Thành thạo Next.js..."
                        value=""
                        onChange={() => {}}
                        style={{ minHeight: "120px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="jobBenefit"
                      label="Quyền lợi & Phúc lợi"
                      rules={[
                        { required: true, message: "Vui lòng nhập quyền lợi!" },
                      ]}
                    >
                      <QuillEditor
                        placeholder="• Lương thưởng hấp dẫn • Bảo hiểm sức khỏe cao cấp..."
                        value=""
                        onChange={() => {}}
                        style={{ minHeight: "120px" }}
                      />
                    </Form.Item>
                  </div>
                </div>
              ),
            },
            {
              key: "3",
              label: (
                <span>
                  <FaUsers />
                  Thông tin liên hệ
                </span>
              ),
              children: (
                <div className="tab-content">
                  <div className="form-section">
                    <h4 className="section-title">
                      <FaUsers /> Người phụ trách tuyển dụng
                    </h4>

                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="supervisorName"
                          label="Họ và tên"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập họ tên!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: Nguyễn Thị Lan Anh"
                            className="custom-input"
                            disabled={mode === "edit"}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-6">
                        <Form.Item
                          name="recruiterPosition"
                          label="Chức vụ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chức vụ!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: HR Manager..."
                            className="custom-input"
                            disabled={mode === "edit"}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="recruiterEmail"
                          label="Email liên hệ"
                          rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                          ]}
                        >
                          <Input
                            placeholder="VD: lananh.nguyen@faceai.vn"
                            className="custom-input"
                            disabled={mode === "edit"}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-6">
                        <Form.Item
                          name="recruiterPhone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: 0912-345-678"
                            className="custom-input"
                            disabled={mode === "edit"}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="contact-preview">
                      <h5>Preview thông tin liên hệ:</h5>
                      <div className="preview-card">
                        <div className="preview-avatar">
                          <FaUsers />
                        </div>
                        <div className="preview-info">
                          <h6>
                            {Form.useWatch("supervisorName", form) ||
                              "Tên người tuyển dụng"}
                          </h6>
                          <p>
                            {Form.useWatch("recruiterPosition", form) ||
                              "Chức vụ"}
                          </p>
                          <div className="preview-contact">
                            <span>
                              📧{" "}
                              {Form.useWatch("recruiterEmail", form) ||
                                "email@company.com"}
                            </span>
                            <span>
                              📞{" "}
                              {Form.useWatch("recruiterPhone", form) ||
                                "0xxx-xxx-xxx"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />

        <div className="form-actions">
          <Button onClick={handleCancel} className="cancel-btn" size="large">
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-btn"
            size="large"
            icon={<FaCheck />}
          >
            {loading
              ? mode === "edit"
                ? "Đang cập nhật..."
                : "Đang tạo công việc..."
              : mode === "edit"
              ? "Cập nhật công việc"
              : "Tạo công việc"}
          </Button>
        </div>
        <Form.Item name="supervisorId" hidden>
          <input hidden />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobCreationModal;
