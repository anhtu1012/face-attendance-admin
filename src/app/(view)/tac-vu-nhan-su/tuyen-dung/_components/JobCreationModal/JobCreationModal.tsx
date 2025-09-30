import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  message,
  Tabs,
  InputNumber,
} from "antd";
import { FaCheck, FaBriefcase, FaInfoCircle, FaUsers } from "react-icons/fa";
import "react-quill-new/dist/quill.snow.css";
import "./JobCreationModal.scss";
import QuillEditor from "./QuillEditor";

interface JobCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (link: string) => void;
}

interface JobFormData {
  // Basic Info
  title: string;
  department: string;
  position: string;
  company: string;
  location: string;
  employmentType: string;

  // Salary & Experience
  salaryMin: number;
  salaryMax: number;
  experience: string;

  // Timeline
  deadline: Date;
  workingHours: string;
  probationPeriod: string;

  // Content
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;

  // Skills & Contact
  skillsRequired: string[];
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  recruiterPosition: string;
}

const JobCreationModal: React.FC<JobCreationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const departmentOptions = [
    { value: "IT", label: "Công Nghệ Thông Tin" },
    { value: "HR", label: "Nhân Sự" },
    { value: "MARKETING", label: "Marketing" },
    { value: "SALES", label: "Kinh Doanh" },
    { value: "FINANCE", label: "Kế Toán - Tài Chính" },
    { value: "OPERATIONS", label: "Vận Hành" },
    { value: "DESIGN", label: "Thiết Kế" },
  ];

  const experienceOptions = [
    { value: "FRESHER", label: "Fresher (0-1 năm)" },
    { value: "JUNIOR", label: "Junior (1-3 năm)" },
    { value: "MIDDLE", label: "Middle (3-5 năm)" },
    { value: "SENIOR", label: "Senior (5+ năm)" },
    { value: "LEAD", label: "Lead/Manager (7+ năm)" },
  ];

  const employmentTypeOptions = [
    { value: "FULL_TIME", label: "Toàn thời gian" },
    { value: "PART_TIME", label: "Bán thời gian" },
    { value: "CONTRACT", label: "Hợp đồng" },
    { value: "INTERN", label: "Thực tập" },
    { value: "REMOTE", label: "Làm việc từ xa" },
  ];

  const probationOptions = [
    { value: "1_MONTH", label: "1 tháng" },
    { value: "2_MONTHS", label: "2 tháng" },
    { value: "3_MONTHS", label: "3 tháng" },
    { value: "6_MONTHS", label: "6 tháng" },
  ];

  const skillOptions = [
    { value: "React", label: "React" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "PHP", label: "PHP" },
    { value: "UI/UX", label: "UI/UX Design" },
    { value: "Figma", label: "Figma" },
    { value: "Photoshop", label: "Photoshop" },
    { value: "Marketing", label: "Marketing" },
    { value: "SEO", label: "SEO" },
    { value: "Project Management", label: "Quản lý dự án" },
  ];

  const handleSubmit = async (values: JobFormData) => {
    console.log("Creating job with data:", values);
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock job link
      const jobId = `job-${Date.now()}`;
      const jobLink = `https://company.vn/careers/${jobId}`;

      message.success("Tạo công việc thành công!");
      form.resetFields();
      onSuccess(jobLink);
    } catch (error: unknown) {
      console.error("Error creating job:", error);
      message.error("Có lỗi xảy ra khi tạo công việc!");
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
          <FaBriefcase className="title-icon" />
          <span className="title-text">Tạo Công Việc Mới</span>
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
          company: "FaceAI Technology Solutions",
          workingHours: "8:00 - 17:30 (T2-T6)",
          probationPeriod: "2_MONTHS",
          employmentType: "FULL_TIME",
          recruiterPosition: "HR Manager",
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
                          name="title"
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
                          name="position"
                          label="Vị trí"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập vị trí!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: Developer, Designer, Manager..."
                            className="custom-input"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-4">
                        <Form.Item
                          name="department"
                          label="Phòng ban"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn phòng ban!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn phòng ban..."
                            options={departmentOptions}
                            className="custom-select"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-4">
                        <Form.Item
                          name="location"
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
                      <div className="form-col-4">
                        <Form.Item
                          name="employmentType"
                          label="Hình thức làm việc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn hình thức!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn hình thức..."
                            options={employmentTypeOptions}
                            className="custom-select"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="company"
                          label="Công ty"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên công ty!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Tên công ty"
                            className="custom-input"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-6">
                        <Form.Item
                          name="experience"
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
                            options={experienceOptions}
                            className="custom-select"
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
                          name="salaryMin"
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
                            className="custom-input"
                            style={{ width: "100%" }}
                            min={1}
                            max={200}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-3">
                        <Form.Item
                          name="salaryMax"
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
                            className="custom-input"
                            style={{ width: "100%" }}
                            min={1}
                            max={200}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-3">
                        <Form.Item
                          name="probationPeriod"
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
                          name="deadline"
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
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-col-6">
                        <Form.Item
                          name="workingHours"
                          label="Thời gian làm việc"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập thời gian làm việc!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="VD: 8:00 - 17:30 (T2-T6)"
                            className="custom-input"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-col-6">
                        <Form.Item
                          name="skillsRequired"
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
                            options={skillOptions}
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
                      name="description"
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
                      name="responsibilities"
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
                      name="requirements"
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
                      name="benefits"
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
                          name="recruiterName"
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
                            {Form.useWatch("recruiterName", form) ||
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
            {loading ? "Đang tạo công việc..." : "Tạo công việc"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default JobCreationModal;
