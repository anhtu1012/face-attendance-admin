/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  UserOutlined
} from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Steps,
  Tabs,
  Typography
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import FullscreenMarkdownEditor from "../FullscreenMarkdownEditor/FullscreenMarkdownEditor";
import "./ContractFormView.scss";
import { branchOptions, contractTemplates, managerOptions, positionOptions, statusOptions } from "./data";

function ContractFormView() {
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [currentStep, setCurrentStep] = useState(0);

  const { Text, Title } = Typography;

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("Form values:", values);
      // Xử lý submit form ở đây
      // await submitContract(values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Contract saved successfully!");
    } catch (error) {
      console.error("Error saving contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormReset = () => {
    form.resetFields();
    setDescription("");
    setSelectedTemplate("");
  };

  const calculateDuration = (startDate: any, endDate: any) => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const diffInDays = end.diff(start, "day");
      const months = Math.floor(diffInDays / 30);
      const days = diffInDays % 30;

      if (months > 0) {
        return `${months} tháng ${days > 0 ? `${days} ngày` : ""}`;
      }
      return `${diffInDays} ngày`;
    }
    return "";
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = contractTemplates.find((t) => t.id === templateId);
    if (template) {
      setDescription(template.content);
      form.setFieldValue("description", template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleClearTemplate = () => {
    setDescription("");
    form.setFieldValue("description", "");
    setSelectedTemplate("");
  };

  // Fullscreen modal handlers
  const openFullscreenEditor = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreenEditor = () => {
    setIsFullscreenOpen(false);
  };

  const saveFullscreenContent = (content: string) => {
    setDescription(content);
    form.setFieldValue("description", content);
  };

  // Calculate form completion progress
  const calculateProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = ["title", "status", "startTime", "endTime", "branchCodes"];
    const completedFields = requiredFields.filter(field => values[field] && values[field] !== "");
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Check if current tab is valid
  const isTabValid = (tabKey: string) => {
    const values = form.getFieldsValue();
    switch (tabKey) {
      case "basic":
        return values.title && values.status;
      case "time":
        return values.startTime && values.endTime;
      case "work":
        return values.branchCodes && values.branchCodes.length > 0;
      case "content":
        return description && description.trim().length > 0;
      default:
        return true;
    }
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      icon: <FileTextOutlined />,
      description: 'Tiêu đề và trạng thái'
    },
    {
      title: 'Thời gian',
      icon: <ClockCircleOutlined />,
      description: 'Ngày bắt đầu và kết thúc'
    },
    {
      title: 'Thông tin công việc',
      icon: <UserOutlined />,
      description: 'Chi nhánh và chức vụ'
    },
    {
      title: 'Nội dung hợp đồng',
      icon: <EditOutlined />,
      description: 'Mô tả chi tiết'
    }
  ];

  return (
    <div className="contract-content-main">
      <div className="contract-form-view-modern">
        <Card className="contract-form-card-modern">
          {/* Header with Progress */}
          <div className="form-header">
            <div className="header-content">
              <Title level={2} className="form-title">
                <FileTextOutlined /> Tạo hợp đồng mới
              </Title>
              <div className="progress-section">
                <Text className="progress-label">Tiến độ hoàn thành</Text>
                <Progress 
                  percent={calculateProgress()} 
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  className="progress-bar"
                />
              </div>
            </div>
          </div>

          {/* Steps Navigation
          <div className="steps-section">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              items={steps}
              className="contract-steps"
            />
          </div> */}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            onValuesChange={(changedValues) => {
              if (changedValues.startTime || changedValues.endTime) {
                const startTime =
                  changedValues.startTime || form.getFieldValue("startTime");
                const endTime =
                  changedValues.endTime || form.getFieldValue("endTime");
                const duration = calculateDuration(startTime, endTime);
                form.setFieldValue("duration", duration);
              }
            }}
            className="modern-form"
          >
            {/* Tab-based Content */}
            <div className="form-content" style={{marginTop:"12px"}}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="contract-tabs"
                items={[
                  {
                    key: "basic",
                    label: (
                      <div className="tab-label">
                        <FileTextOutlined />
                        <span>Thông tin cơ bản</span>
                        {isTabValid("basic") && <CheckCircleOutlined className="valid-icon" />}
                      </div>
                    ),
                    children: (
                      <div className="tab-content">
                        <div className="section-header">
                          <Title level={4}>Thông tin cơ bản của hợp đồng</Title>
                          <Text type="secondary">Nhập tiêu đề và trạng thái hợp đồng</Text>
                        </div>
                        
                        <Row gutter={[24, 24]}>
                          <Col xs={24} lg={16}>
                            <Form.Item
                              name="title"
                              label="Tiêu đề hợp đồng"
                              rules={[
                                { required: true, message: "Vui lòng nhập tiêu đề!" },
                                { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" }
                              ]}
                            >
                              <Input 
                                placeholder="Ví dụ: Hợp đồng lao động - Nhân viên IT" 
                                size="large"
                                showCount
                                maxLength={200}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={8}>
                            <Form.Item
                              name="status"
                              label="Trạng thái"
                              rules={[
                                { required: true, message: "Vui lòng chọn trạng thái!" },
                              ]}
                            >
                              <Select
                                placeholder="Chọn trạng thái"
                                size="large"
                                options={statusOptions}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* Hidden fields */}
                        <Form.Item name="userCode" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item name="id" hidden>
                          <Input />
                        </Form.Item>
                      </div>
                    ),
                  },
                  {
                    key: "time",
                    label: (
                      <div className="tab-label">
                        <ClockCircleOutlined />
                        <span>Thời gian hiệu lực</span>
                        {isTabValid("time") && <CheckCircleOutlined className="valid-icon" />}
                      </div>
                    ),
                    children: (
                      <div className="tab-content">
                        <div className="section-header">
                          <Title level={4}>Thời gian hiệu lực hợp đồng</Title>
                          <Text type="secondary">Xác định ngày bắt đầu và kết thúc hợp đồng</Text>
                        </div>

                        <Row gutter={[24, 24]}>
                          <Col xs={24} md={8}>
                            <Form.Item
                              name="startTime"
                              label="Ngày bắt đầu"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày bắt đầu!",
                                },
                              ]}
                              getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                              })}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
                                disabledDate={(current) => {
                                  return current && current < dayjs().startOf("day");
                                }}
                                placeholder="Chọn ngày bắt đầu"
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              name="endTime"
                              label="Ngày kết thúc"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày kết thúc!",
                                },
                              ]}
                              getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                              })}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày kết thúc"
                                size="large"
                                disabledDate={(current) => {
                                  const startTime = form.getFieldValue("startTime");
                                  if (startTime) {
                                    return current && current <= dayjs(startTime);
                                  }
                                  return current && current < dayjs().startOf("day");
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item name="duration" label="Thời hạn hợp đồng">
                              <Input
                                disabled
                                size="large"
                                placeholder="Tự động tính toán"
                                prefix={<ClockCircleOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ),
                  },
                  {
                    key: "work",
                    label: (
                      <div className="tab-label">
                        <UserOutlined />
                        <span>Thông tin công việc</span>
                        {isTabValid("work") && <CheckCircleOutlined className="valid-icon" />}
                      </div>
                    ),
                    children: (
                      <div className="tab-content">
                        <div className="section-header">
                          <Title level={4}>Thông tin công việc</Title>
                          <Text type="secondary">Chi nhánh làm việc, chức vụ và người quản lý</Text>
                        </div>

                        <Row gutter={[24, 24]}>
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="branchCodes"
                              label="Chi nhánh làm việc"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ít nhất một chi nhánh!",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Chọn các chi nhánh làm việc"
                                size="large"
                                mode="multiple"
                                options={branchOptions}
                                maxTagCount="responsive"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={6}>
                            <Form.Item name="positionCode" label="Chức vụ">
                              <Select
                                size="large"
                                options={positionOptions}
                                placeholder="Chọn chức vụ"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} lg={6}>
                            <Form.Item name="managedBy" label="Quản lý bởi">
                              <Select
                                size="large"
                                allowClear
                                options={managerOptions}
                                placeholder="Chọn người quản lý"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ),
                  },
                  {
                    key: "content",
                    label: (
                      <div className="tab-label">
                        <EditOutlined />
                        <span>Nội dung hợp đồng</span>
                        {isTabValid("content") && <CheckCircleOutlined className="valid-icon" />}
                      </div>
                    ),
                    children: (
                      <div className="tab-content">
                        <div className="section-header">
                          <Title level={4}>Nội dung hợp đồng</Title>
                          <Text type="secondary">Chọn template hoặc tạo nội dung tùy chỉnh</Text>
                        </div>

                        {/* Enhanced Template Selector */}
                        <div className="template-selector-modern">
                          <div className="template-header">
                            <div className="template-info">
                              <Title level={5}>Chọn template mẫu</Title>
                              <Text type="secondary">
                                Sử dụng template có sẵn để tiết kiệm thời gian hoặc tạo nội dung hoàn toàn mới
                              </Text>
                            </div>
                            <Button
                              type="primary"
                              icon={<FullscreenOutlined />}
                              onClick={openFullscreenEditor}
                              size="large"
                            >
                              Toàn màn hình
                            </Button>
                          </div>
                          
                          <Row gutter={[16, 16]}>
                            <Col span={24}>
                              <Select
                                placeholder="🔍 Tìm kiếm và chọn template hợp đồng..."
                                size="large"
                                style={{ width: "100%" }}
                                value={selectedTemplate}
                                onChange={handleTemplateSelect}
                                allowClear
                                onClear={handleClearTemplate}
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.children as any)?.toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                {contractTemplates.map((template) => (
                                  <Select.Option key={template.id} value={template.id}>
                                    <div className="template-option">
                                      <div className="template-name">
                                        <FileTextOutlined /> {template.name}
                                      </div>
                                     
                                    </div>
                                  </Select.Option>
                                ))}
                              </Select>
                            </Col>
                          </Row>
                        </div>

                        {/* Markdown Editor */}
                        <div className="editor-section">
                          <Form.Item
                            name="description"
                            label="Nội dung chi tiết"
                            getValueFromEvent={(value) => value}
                            getValueProps={(value) => ({ value })}
                          >
                            <div className="markdown-editor-wrapper-modern">
                              <MDEditor
                                value={description}
                                onChange={(value) => {
                                  setDescription(value);
                                  form.setFieldValue("description", value);
                                }}
                                data-color-mode="light"
                                preview="edit"
                                hideToolbar={false}
                                visibleDragbar={false}
                                height={500}
                                textareaProps={{
                                  placeholder:
                                    "💡 Chọn template mẫu ở trên hoặc bắt đầu viết nội dung hợp đồng...\n\n📝 Sử dụng Markdown để định dạng:\n# Tiêu đề chính\n## Tiêu đề phụ\n- Danh sách\n**Chữ đậm** *Chữ nghiêng*\n\n> Trích dẫn quan trọng\n\n```\nCode block\n```",
                                  style: {
                                    fontSize: 15,
                                    lineHeight: 1.7,
                                    minHeight: 400,
                                  },
                                }}
                              />
                            </div>
                          </Form.Item>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Navigation & Actions */}
            <div className="form-actions-modern">
              <div className="navigation-buttons">
                <Button
                  size="large"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Quay lại
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                      setActiveTab(["basic", "time", "work", "content"][currentStep + 1]);
                    }
                  }}
                  disabled={currentStep === steps.length - 1}
                >
                  Tiếp tục
                </Button>
              </div>
              
              <div className="action-buttons">
                <Button
                  size="large"
                  onClick={handleFormReset}
                  disabled={loading}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                >
                  Lưu hợp đồng
                </Button>
              </div>
            </div>
           </Form>
        </Card>
      </div>

      {/* Fullscreen Markdown Editor Modal */}
      <FullscreenMarkdownEditor
        open={isFullscreenOpen}
        content={description || ""}
        onSave={saveFullscreenContent}
        onClose={closeFullscreenEditor}
      />
    </div>
  );
}

export default ContractFormView;
