/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import RichTextEditor from "@/components/RichTextEditor";
import { MauHopDong } from "@/dtos/danhMuc/mau-hop-dong/mau-hop-dong.dto";
import { SelectOption } from "@/dtos/select/select.dto";
import { UserCreateContractItem } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/user-create-contract/user-create-contract.dto";
import { ContractWithUser } from "@/dtos/tac-vu-nhan-su/quan-ly-hop-dong/contracts/contract.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useSelectData } from "@/hooks/useSelectData";
import MauHopDongServices from "@/services/danh-muc/mau-hop-dong/mau-hop-dong.service";
import DanhMucMucLuongServices from "@/services/danh-muc/muc-luong/mucLuong.service";
import SelectServices from "@/services/select/select.service";
import QuanLyHopDongServices from "@/services/tac-vu-nhan-su/quan-ly-hop-dong/quan-ly-hop-dong.service";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Progress,
  Row,
  Select,
  Tabs,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import FullscreenMarkdownEditor from "../FullscreenMarkdownEditor/FullscreenMarkdownEditor";
import "./ContractFormView.scss";
import { FormValues } from "./prop";

function ContractFormView({
  selectedUser,
  contractDetailData,
  onMarkdownChange,
  onExportPdf,
  onContractTypeChange,
  mode = "create",
  pdfRef,
}: {
  selectedUser?: UserCreateContractItem | null;
  contractDetailData?: ContractWithUser | null;
  onMarkdownChange?: (markdown: string) => void;
  onExportPdf?: () => void;
  onContractTypeChange?: (contractTypeName: string) => void;
  mode?: "create" | "appendix";
  pdfRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const messageApi = useAntdMessage();
  const [form] = Form.useForm<FormValues>();
  const [content, setDescription] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-time");
  const { selectContractType, selectDepartment, selectAllowance } =
    useSelectData({
      fetchContractType: true,
      fetchDepartment: true,
      fetchAllowance: true,
    });
  const [positionOptionsState, setPositionOptionsState] =
    useState<SelectOption[]>();

  const [contractTemplates, setContractTemplates] = useState<MauHopDong[]>([]);
  const [levelSalaries, setLevelSalaries] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldValue("userId", selectedUser.id);
    }
  }, [selectedUser, form]);

  // Fetch level salary data
  useEffect(() => {
    const fetchLevelSalaries = async () => {
      try {
        const response = await DanhMucMucLuongServices.getDanhMucMucLuong();
        setLevelSalaries(response.data || []);
      } catch (error) {
        console.error("Error fetching level salaries:", error);
      }
    };
    fetchLevelSalaries();
  }, []);

  useEffect(() => {
    if (contractDetailData) {
      // Populate form with contract detail data
      const contract = contractDetailData.contract;
      const userInfo = contractDetailData.userInfor;

      form.setFieldsValue({
        userId: contract.userId,
        contractTypeId: contract.contractTypeId,
        positionId: contract.positionId,
        departmentId: selectedUser?.departmentId,
        grossSalary: parseFloat(contract.grossSalary) / 1_000_000, // Convert to millions
        allowanceIds: contract.allowanceInfors?.map((a) => a.allowanceId),
      });

      // Set content if available
      if (contract.content) {
        setDescription(contract.content);
      }

      // Set contract type name
      if (onContractTypeChange) {
        onContractTypeChange(contract.contractTypeName);
      }

      // Fetch position options for the department if method exists
      if (
        userInfo.departmentId &&
        (SelectServices as any).getPositionByDepartment
      ) {
        (SelectServices as any)
          .getPositionByDepartment(userInfo.departmentId)
          .then((data: SelectOption[]) => {
            setPositionOptionsState(data);
          });
      }
    }
  }, [contractDetailData, form, onContractTypeChange]);

  useEffect(() => {
    onMarkdownChange?.(content || "");
  }, [content, onMarkdownChange]);

  const { Text, Title } = Typography;

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Process dates
      if (values.startDate) {
        values.startDate = dayjs(values.startDate).toISOString();
      }

      if (values.endDate) {
        values.endDate = dayjs(values.endDate).toISOString();
      }

      // Process salary
      if (
        values.grossSalary !== undefined &&
        values.grossSalary !== null &&
        values.grossSalary !== ""
      ) {
        const grossNum = Number(values.grossSalary) || 0;
        const amountVND = Math.round(grossNum * 1_000_000);
        values.grossSalary = String(amountVND);
      }

      // Handle based on mode
      if (mode === "appendix") {
        // Creating an appendix for existing contract
        if (!contractDetailData?.contract?.id) {
          messageApi.error("Không tìm thấy hợp đồng gốc!");
          return;
        }

        const appendixData = {
          ...values,
          userContractId: contractDetailData.contract.id,
        };

        const response = await QuanLyHopDongServices.createPhucLucHopDong(
          appendixData
        );
        messageApi.success("Phụ lục hợp đồng đã được tạo thành công!");

        // Upload the PDF file after successful creation
        if (response?.id && pdfRef?.current) {
          try {
            // Wait a bit for DOM to fully render
            await new Promise((resolve) => setTimeout(resolve, 500));

            messageApi.loading("Đang tạo file PDF...", 0);

            // Generate PDF as File from pdfRef
            const pdfFile = await generatePdfFileFromElement();

            if (pdfFile) {
              messageApi.destroy();
              messageApi.loading("Đang tải file lên...", 0);

              const formData = new FormData();
              formData.append("userContractExtendedId", response.id);
              formData.append("fileContract", pdfFile);

              await QuanLyHopDongServices.uploadAppendixMultipart(formData);
              messageApi.destroy();
              messageApi.success("File phụ lục đã được tải lên thành công!");
            } else {
              messageApi.destroy();
              messageApi.warning("Không thể tạo file PDF!");
            }
          } catch (uploadError) {
            messageApi.destroy();
            console.error("Error uploading appendix PDF:", uploadError);
            messageApi.warning(
              "Phụ lục đã được tạo nhưng không thể tải file lên!"
            );
          }
        }
      } else {
        await onExportPdf?.();
        await QuanLyHopDongServices.createQuanLyHopDong(values);
        messageApi.success("Hợp đồng đã được tạo thành công!");
      }

      // Clear/reset all fields and editor after successful creation
      form.resetFields();
      setDescription("");
      setSelectedTemplate("");
      setPositionOptionsState([]);
      setIsFullscreenOpen(false);
      setActiveTab("basic-time");
      setContractTemplates([]);
      onMarkdownChange?.("");
    } catch (error) {
      console.error("Error saving contract:", error);
      messageApi.error(
        mode === "appendix"
          ? "Lỗi khi tạo phụ lục hợp đồng!"
          : "Lỗi khi tạo hợp đồng!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate PDF as File object from pdfRef
  const generatePdfFileFromElement = async (): Promise<File | null> => {
    if (!pdfRef?.current) {
      console.error("PDF generation failed: pdfRef not available");
      return null;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = pdfRef.current;

      // Generate canvas from HTML with better quality
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        background: "#ffffff",
        allowTaint: true,
        height: element.scrollHeight, // Capture full height
        width: element.scrollWidth, // Capture full width
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the height of the image when scaled to fit page width
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // Add image to PDF, splitting into multiple pages if needed
      let heightLeft = scaledHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, scaledHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      // Convert PDF to Blob then to File with appropriate name
      const pdfBlob = pdf.output("blob");
      const fileName =
        mode === "appendix" ? "phu-luc-hop-dong.pdf" : "hop-dong.pdf";
      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      return pdfFile;
    } catch (error) {
      console.error("Error generating PDF file:", error);
      return null;
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
      const months = end.diff(start, "month");
      const tempDate = start.add(months, "month");
      const days = end.diff(tempDate, "day");

      if (months > 0) {
        return `${months} tháng ${days > 0 ? `${days} ngày` : ""}`;
      }
      return `${days} ngày`;
    }
    return "";
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = contractTemplates.find((t) => t.id === templateId);
    if (template) {
      setDescription(template.content);
      form.setFieldValue("content", template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleClearTemplate = () => {
    setDescription("");
    form.setFieldValue("content", "");
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
    form.setFieldValue("content", content);
  };

  // Calculate form completion progress
  const calculateProgress = () => {
    const values = form.getFieldsValue() as Partial<FormValues>;
    // For appendix mode we don't require department/position to be filled
    const requiredFields: (keyof FormValues)[] =
      mode === "appendix"
        ? ["contractTypeId", "startDate", "grossSalary", "content"]
        : [
            "contractTypeId",
            "startDate",
            "positionId",
            "grossSalary",
            "content",
          ];

    const completedFields = requiredFields.filter((field) => {
      const v = values[field];
      return v !== undefined && v !== null && v !== "";
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Check if current tab is valid
  const isTabValid = (tabKey: string) => {
    const values = form.getFieldsValue();
    switch (tabKey) {
      case "basic-time":
        return values.contractTypeId && values.startDate;
      case "work":
        // In appendix mode we don't require department/position; only check salary
        if (mode === "appendix") {
          return Boolean(values.grossSalary);
        }
        return (
          Boolean(values.positionId) &&
          Array.isArray(values.allowanceIds) &&
          values.allowanceIds.length > 0 &&
          values.grossSalary
        );
      case "content":
        return content && content.trim().length > 0;
      default:
        return true;
    }
  };

  // Check if form is ready to submit
  const isFormValid = () => {
    const values = form.getFieldsValue();
    console.log("values", values);

    if (mode === "appendix") {
      // For appendix: contractTypeId, startDate, grossSalary, content
      return (
        values.contractTypeId &&
        values.startDate &&
        values.grossSalary &&
        content &&
        content.trim().length > 0
      );
    } else {
      // For new contract: contractTypeId, startDate, positionId, grossSalary, content
      return (
        values.contractTypeId &&
        values.startDate &&
        values.positionId &&
        values.grossSalary &&
        content &&
        content.trim().length > 0
      );
    }
  };
  const fetchPositions = async (departmentId?: string) => {
    if (!departmentId) return;
    try {
      const res = await SelectServices.getSelectPositionWithRoleAndDepartment(
        departmentId
      );
      setPositionOptionsState(res.data || []);
      form.setFieldsValue({ positionId: undefined });
    } catch (err) {
      console.error("Error fetching positions for department", err);
      setPositionOptionsState([]);
    }
  };
  const fetchTemplate = async (contractTypeId?: string) => {
    if (!contractTypeId) return;
    try {
      const response = await MauHopDongServices.getMauHopDong([], undefined, {
        quicksearchCols: "contractTypeId",
        quicksearch: contractTypeId,
      });

      setContractTemplates(response.data || []);
    } catch (err) {
      console.error("Error fetching positions for department", err);
      setPositionOptionsState([]);
    }
  };

  const handleDepartmentChange = (value: string) => {
    if (value) {
      fetchPositions(value);
    } else {
      setPositionOptionsState([]);
      form.setFieldsValue({ positionId: undefined });
    }
  };

  const handleLevelSalaryChange = (value: string) => {
    const level = levelSalaries.find((l) => l.id === value);
    setSelectedLevel(level);
    // Reset grossSalary when level changes
    form.setFieldsValue({ grossSalary: undefined });
  };

  const validateGrossSalary = (_: any, value: number) => {
    if (!selectedLevel) {
      return Promise.reject(new Error("Vui lòng chọn cấp bậc trước!"));
    }
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập lương cứng!"));
    }
    const startSalary = Number(selectedLevel.startSalary) / 1000000; // Convert to triệu
    const endSalary = Number(selectedLevel.endSalary) / 1000000; // Convert to triệu
    if (value < startSalary || value > endSalary) {
      return Promise.reject(
        new Error(
          `Lương phải nằm trong khoảng ${startSalary.toFixed(
            0
          )} - ${endSalary.toFixed(0)} triệu VNĐ`
        )
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="contract-content-main">
      <div className="contract-form-view-modern">
        <div className="form-header">
          <div className="header-content">
            <Title level={2} className="form-title">
              <FileTextOutlined />{" "}
              {mode === "appendix"
                ? "Tạo phụ lục hợp đồng"
                : "Tạo hợp đồng mới"}
            </Title>
            {mode === "appendix" && contractDetailData && (
              <Text
                type="secondary"
                style={{ marginTop: "8px", display: "block" }}
              >
                Hợp đồng gốc: {contractDetailData.contract.contractNumber} -{" "}
                {contractDetailData.contract.contractTypeName}
              </Text>
            )}
            <div className="progress-section">
              <Text className="progress-label">Tiến độ hoàn thành</Text>
              <Progress
                percent={calculateProgress()}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                className="progress-bar"
              />
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          onValuesChange={(changedValues) => {
            // Keep duration up-to-date when dates change
            if (changedValues.startDate || changedValues.endDate) {
              const startDate =
                changedValues.startDate || form.getFieldValue("startDate");
              const endDate =
                changedValues.endDate || form.getFieldValue("endDate");
              const duration = calculateDuration(startDate, endDate);
              form.setFieldValue("duration", duration);
            }
            if (changedValues.contractTypeId) {
              const selectedType = selectContractType?.find(
                (opt) =>
                  String(opt.value) === String(changedValues.contractTypeId)
              );
              if (selectedType && onContractTypeChange) {
                onContractTypeChange(selectedType.label);
              }
            }
          }}
          initialValues={{
            departmentId:
              contractDetailData?.contract.departmentId || undefined,
          }}
          className="modern-form"
        >
          {/* Tab-based Content */}
          <div className="form-content" style={{ marginTop: "12px" }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="contract-tabs"
              items={[
                {
                  key: "basic-time",
                  label: (
                    <div className="tab-label">
                      <FileTextOutlined />
                      <span>Thông tin cơ bản</span>
                      {isTabValid("basic-time") && (
                        <CheckCircleOutlined className="valid-icon" />
                      )}
                    </div>
                  ),
                  children: (
                    <div className="tab-content">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} lg={24}>
                          <Form.Item
                            name="contractTypeId"
                            label="Tiêu đề hợp đồng"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn tên hợp đồng"
                              size="large"
                              options={selectContractType}
                              onChange={(value) => {
                                fetchTemplate(value);
                                const selectedType = selectContractType?.find(
                                  (opt) => opt.value == (value as any)
                                );
                                if (selectedType && onContractTypeChange) {
                                  onContractTypeChange(selectedType.label);
                                } else if (onContractTypeChange) {
                                  // Fallback: try string match in case values are objects
                                  const fallback = selectContractType?.find(
                                    (opt) =>
                                      String(opt.value) === String(value as any)
                                  );
                                  if (fallback)
                                    onContractTypeChange(fallback.label);
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Thời gian hiệu lực */}
                      <div
                        className="section-header"
                        style={{ marginTop: "12px" }}
                      >
                        <Title level={4}>Thời gian hiệu lực hợp đồng</Title>
                        <Text type="secondary">
                          Xác định ngày bắt đầu và kết thúc hợp đồng
                        </Text>
                      </div>

                      <Row gutter={[24, 24]}>
                        {mode === "appendix" ? (
                          <Col xs={24} md={24}>
                            <Form.Item
                              name="startDate"
                              label="Tháng bắt đầu"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày bắt đầu!",
                                },
                              ]}
                              getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                              })}
                              normalize={(value) => {
                                return value
                                  ? value.startOf("month").toISOString()
                                  : undefined;
                              }}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                picker="month"
                                format="MM/YYYY"
                                disabledDate={(current) => {
                                  return (
                                    current &&
                                    current <
                                      dayjs().add(1, "month").startOf("month")
                                  );
                                }}
                                placeholder="Chọn tháng bắt đầu"
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                        ) : (
                          <>
                            <Col xs={24} md={8}>
                              <Form.Item
                                name="startDate"
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
                                    return (
                                      current &&
                                      current < dayjs().startOf("day")
                                    );
                                  }}
                                  placeholder="Chọn ngày bắt đầu"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                              <Form.Item
                                name="endDate"
                                label="Ngày kết thúc"
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
                                    const startDate =
                                      form.getFieldValue("startDate");
                                    if (startDate) {
                                      return (
                                        current && current <= dayjs(startDate)
                                      );
                                    }
                                    return (
                                      current &&
                                      current < dayjs().startOf("day")
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                              <Form.Item
                                name="duration"
                                label="Thời hạn hợp đồng"
                              >
                                <Input
                                  disabled
                                  size="large"
                                  placeholder="Tự động tính toán"
                                  prefix={<ClockCircleOutlined />}
                                />
                              </Form.Item>
                            </Col>
                          </>
                        )}
                      </Row>

                      {/* Hidden fields */}
                      <Form.Item name="userId" hidden>
                        <Input />
                      </Form.Item>
                    </div>
                  ),
                },
                {
                  key: "work",
                  label: (
                    <div className="tab-label">
                      <UserOutlined />
                      <span>Thông tin công việc</span>
                      {isTabValid("work") && (
                        <CheckCircleOutlined className="valid-icon" />
                      )}
                    </div>
                  ),
                  children: (
                    <div className="tab-content">
                      <div className="section-header">
                        {/* <Title level={4}>Thông tin công việc</Title> */}
                        <Text type="secondary">
                          Phòng ban ,chức vụ , lương cứng và các thông tin phụ
                          cấp
                        </Text>
                      </div>

                      <Row gutter={[24, 24]}>
                        {mode !== "appendix" && (
                          <Col xs={24} lg={12}>
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
                                options={selectDepartment}
                                className="custom-select"
                                onChange={handleDepartmentChange}
                              />
                            </Form.Item>
                          </Col>
                        )}

                        {mode !== "appendix" && (
                          <Col xs={24} lg={12}>
                            <Form.Item
                              name="positionId"
                              label="Chức vụ"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn chức vụ!",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Chọn chức vụ..."
                                options={positionOptionsState}
                                className="custom-select"
                              />
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} lg={12}>
                          <Form.Item
                            name="levelSalaryId"
                            label="Cấp bậc"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn cấp bậc!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Chọn cấp bậc ..."
                              className="custom-select"
                              onChange={handleLevelSalaryChange}
                              options={levelSalaries.map((level) => ({
                                label: level.levelName,
                                value: level.id,
                              }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item
                            name="grossSalary"
                            label="Lương cứng (triệu VNĐ)"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập lương cứng!",
                              },
                              { validator: validateGrossSalary },
                            ]}
                          >
                            <InputNumber
                              placeholder="25"
                              className="custom-input-number"
                              style={{ width: "100%" }}
                              min={1}
                              max={250}
                              disabled={!selectedLevel}
                            />
                          </Form.Item>
                          {selectedLevel && (
                            <div style={{ marginTop: 5 }}>
                              <Typography.Text
                                type="secondary"
                                style={{ fontSize: 12 }}
                              >
                                Khoảng lương:{" "}
                                <strong>
                                  {(
                                    Number(selectedLevel.startSalary) / 1000000
                                  ).toFixed(0)}{" "}
                                  -{" "}
                                  {(
                                    Number(selectedLevel.endSalary) / 1000000
                                  ).toFixed(0)}{" "}
                                  triệu VNĐ
                                </strong>
                              </Typography.Text>
                            </div>
                          )}
                        </Col>
                        <Col xs={24} lg={24}>
                          <Form.Item
                            name="allowanceIds"
                            label="Phụ cấp theo tháng (nếu có)"
                          >
                            <Select
                              placeholder="Chọn phụ cấp hỗ trợ..."
                              options={selectAllowance}
                              className="custom-select"
                              mode="multiple"
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
                      {isTabValid("content") && (
                        <CheckCircleOutlined className="valid-icon" />
                      )}
                    </div>
                  ),
                  children: (
                    <div className="tab-content">
                      {/* Enhanced Template Selector */}
                      <div className="template-selector-modern">
                        <div className="template-header">
                          <div className="template-info">
                            <Title level={5}>Chọn template mẫu</Title>
                            <Text type="secondary">
                              Sử dụng template có sẵn để tiết kiệm thời gian
                              hoặc tạo nội dung hoàn toàn mới
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
                                (option?.children as any)
                                  ?.toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {contractTemplates.map((template) => (
                                <Select.Option
                                  key={template.id}
                                  value={template.id}
                                >
                                  <div className="template-option">
                                    <div className="template-name">
                                      <FileTextOutlined />{" "}
                                      {template.templateContract}
                                    </div>
                                  </div>
                                </Select.Option>
                              ))}
                            </Select>
                          </Col>
                        </Row>
                      </div>

                      {/* Rich Text Editor */}
                      <div className="editor-section">
                        <Form.Item
                          name="content"
                          // label="Nội dung chi tiết"
                          getValueFromEvent={(value) => value}
                          getValueProps={(value) => ({ value })}
                        >
                          <RichTextEditor
                            value={content}
                            onChange={(value) => {
                              setDescription(value);
                              form.setFieldValue("content", value);
                            }}
                            placeholder="💡 Chọn template mẫu ở trên hoặc bắt đầu viết nội dung hợp đồng..."
                            height={300}
                          />
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
                onClick={onExportPdf}
                disabled={!onExportPdf}
                icon={<FileTextOutlined />}
              >
                Xuất PDF
              </Button>
            </div>

            <div className="action-buttons">
              <Button size="large" onClick={handleFormReset} disabled={loading}>
                Hủy bỏ
              </Button>

              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                disabled={!isFormValid()}
                icon={<CheckCircleOutlined />}
              >
                {mode === "appendix" ? "Lưu phụ lục" : "Lưu hợp đồng"}
              </Button>
            </div>
          </div>
        </Form>
        {/* </Card> */}
      </div>

      {/* Fullscreen Markdown Editor Modal */}
      <FullscreenMarkdownEditor
        open={isFullscreenOpen}
        content={content || ""}
        onSave={saveFullscreenContent}
        onClose={closeFullscreenEditor}
      />
    </div>
  );
}

export default ContractFormView;
