"use client";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { SelectOption } from "@/dtos/select/select.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useSelectData } from "@/hooks/useSelectData";
import MauHopDongServices from "@/services/danh-muc/mau-hop-dong/mau-hop-dong.service";
import { UpdateMauHopDongeRequest } from "@/dtos/danhMuc/mau-hop-dong/mau-hop-dong.request.dto";
import { FileTextOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import "./index.scss";

const { TextArea } = Input;
const { Title } = Typography;

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface TemplateContractForm {
  contractTypeId: string;
  templateContract: string;
  template?: string;
  content: string;
  description: string;
}

function Page() {
  const [form] = Form.useForm<TemplateContractForm>();
  const [loading, setLoading] = useState(false);
  const [templateOptions, setTemplateOptions] = useState<SelectOption[]>([]);
  const [content, setContent] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const messageApi = useAntdMessage();
  const { selectContractType } = useSelectData({ fetchContractType: true });

  // Quill modules configuration
  const quillModules = React.useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];
  const handleChangeContractType = async (value: string) => {
    console.log("Selected contract type ID:", value);
    // If contract type was cleared, reset template-related state
    if (!value) {
      setTemplateOptions([]);
      form.setFieldsValue({
        templateContract: "",
        template: "",
        description: "",
        content: "",
      });
      setContent("");
      setSelectedTemplateId(null);
      return;
    }

    await MauHopDongServices.getMauHopDong([], undefined, {
      quicksearchCols: "contractTypeId",
      quicksearch: value,
    })
      .then((response) => {
        const options = response.data.map((item) => ({
          label: item.templateContract ?? "",
          value: item.id.toString(),
        }));
        setTemplateOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching template contracts:", error);
        setTemplateOptions([]);
      });
  };
  const handleChooseTemplate = async (value: string) => {
    // If template selection was cleared, reset fields and hide update button
    if (!value) {
      form.setFieldsValue({ templateContract: "", description: "" });
      setContent("");
      setSelectedTemplateId(null);
      return;
    }

    await MauHopDongServices.getMauHopDong([], undefined, {
      quicksearchCols: "id",
      quicksearch: value,
    })
      .then((response) => {
        if (response.data.length > 0) {
          setSelectedTemplateId(value);
          form.setFieldsValue({
            templateContract: response.data[0].templateContract || "",
            description: response.data[0].description || "",
          });
          setContent(response.data[0].content || "");
        }
      })
      .catch((error) => {
        console.error("Error fetching template contracts:", error);
      });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: TemplateContractForm = {
        contractTypeId: values.contractTypeId,
        templateContract: values.templateContract,
        content: content,
        description: values.description,
      };

      // TODO: Call API to save template contract
      await MauHopDongServices.createMauHopDong(payload);

      messageApi?.success("Lưu mẫu hợp đồng thành công!");
      form.resetFields();
      setContent("");
    } catch (error) {
      console.error("Error saving template contract:", error);
      messageApi?.error("Lưu mẫu hợp đồng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedTemplateId) {
        messageApi?.error("Vui lòng chọn mẫu hợp đồng để cập nhật");
        return;
      }
      setLoading(true);

      const payload: UpdateMauHopDongeRequest = {
        templateContract: values.templateContract,
        content: content,
        description: values.description,
      };

      // Call update API
      await MauHopDongServices.updateMauHopDong(selectedTemplateId, payload);

      messageApi?.success("Cập nhật mẫu hợp đồng thành công!");
      form.resetFields();
      setContent("");
      setSelectedTemplateId(null);
      setTemplateOptions([]);
    } catch (error) {
      console.error("Error updating template contract:", error);
      messageApi?.error("Cập nhật mẫu hợp đồng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const content1Component = (
    <div className="mau-hop-dong-container">
      <Card className="form-card" bodyStyle={{ padding: "0px" }}>
        <div className="form-header">
          <div className="header-content">
            <Title level={2} className="form-title">
              <FileTextOutlined /> Thông tin mẫu hợp đồng
            </Title>
          </div>
        </div>

        <Form form={form} layout="vertical" className="template-contract-form">
          <Row gutter={[12, 12]}>
            <Col span={12}>
              {" "}
              <Form.Item
                name="contractTypeId"
                label="Loại hợp đồng"
                rules={[
                  { required: true, message: "Vui lòng chọn loại hợp đồng!" },
                ]}
              >
                <Select
                  placeholder="Chọn loại hợp đồng"
                  className="custom-select"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  onChange={handleChangeContractType}
                  allowClear
                  options={selectContractType}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="template" label="Mẫu hợp đồng">
                <Select
                  placeholder="Chọn mẫu hợp đồng"
                  className="custom-select"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  onChange={handleChooseTemplate}
                  allowClear
                  options={templateOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="templateContract"
            label="Tên mẫu hợp đồng"
            rules={[
              { required: true, message: "Vui lòng nhập tên mẫu hợp đồng!" },
            ]}
          >
            <Input
              placeholder="Nhập tên mẫu hợp đồng"
              className="custom-input"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea
              placeholder="Nhập mô tả cho mẫu hợp đồng"
              className="custom-textarea"
              rows={4}
            />
          </Form.Item>
        </Form>

        {/* Update (shown only when a template is selected) and Save Buttons inside content1 */}
        <div style={{ padding: "12px", paddingTop: 0 }}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={!selectedTemplateId ? handleSave : handleUpdate}
            loading={loading}
            block
          >
            {!selectedTemplateId ? "Tạo mẫu hợp đồng" : "Cập nhật mẫu hợp đồng"}
          </Button>
        </div>
      </Card>
    </div>
  );

  const content2Component = (
    <div className="mau-hop-dong-container">
      <Card className="form-card" bodyStyle={{ padding: "0px" }}>
        <div className="editor-content-wrapper">
          <div className="quill-editor-wrapper">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập nội dung mẫu hợp đồng..."
            />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <LayoutContent
      layoutType={5}
      option={{
        floatButton: true,
        sizeAdjust: [5, 5],
      }}
      content1={content1Component}
      content2={content2Component}
    />
  );
}

export default Page;
