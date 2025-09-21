"use client";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import "./index.scss";
function ContractFormView() {
  const [form] = Form.useForm();
  return (
    <div className="contract-form-view">
      <div className="form-title">
        <h2>Thông tin hợp đồng</h2>
      </div>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tiêu đề hợp đồng"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề hợp đồng" size="large" />
            </Form.Item>
            <Form.Item name="userCode" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                size="large"
                dropdownStyle={{ borderRadius: "10px" }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <TextArea
                placeholder="Nhập mô tả về hợp đồng"
                rows={3}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="startTime"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                // {
                //   validator: (_, value) => {
                //     if (!value) return Promise.resolve();

                //     const today = dayjs().startOf("day");
                //     if (value.isBefore(today)) {
                //       return Promise.reject(
                //         new Error("Ngày bắt đầu phải từ hôm nay trở đi!")
                //       );
                //     }

                //     return Promise.resolve();
                //   },
                // },
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
          <Col span={8}>
            <Form.Item
              name="endTime"
              label="Ngày kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
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
                  return (
                    current && current < dayjs().add(1, "month").startOf("day")
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="duration" label="Thời hạn">
              <Input disabled size="large" placeholder="Thời hạn hợp đồng" />
            </Form.Item>
          </Col>
          <Col span={8}>
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
                dropdownStyle={{ borderRadius: "10px" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="positionCode" label="Chức vụ">
              <Select size="large" dropdownStyle={{ borderRadius: "10px" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="managedBy" label="Quản lý bởi">
              <Select size="large" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-actions">
          <Button type="primary" size="large" htmlType="submit">
            Lưu hợp đồng
          </Button>
        </div>

        {/* <div className="form-section document-section">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="contractPdf"
              label="Tệp hợp đồng"
              // Không dùng valuePropName="fileList" vì contractPdf có thể là File hoặc string
              getValueFromEvent={(e) => {
                // Nếu là event từ Upload thì lấy file object, nếu là string thì giữ nguyên
                if (e && e.fileList && e.fileList.length > 0) {
                  const fileObj = e.fileList[0];
                  // Nếu là file mới upload
                  if (fileObj.originFileObj) return fileObj.originFileObj;
                  // Nếu là file đã có (string url)
                  if (fileObj.url) return fileObj.url;
                }
                // Nếu xóa file
                if (e && e.fileList && e.fileList.length === 0) {
                  return undefined;
                }
                return e;
              }}
            >
              <Upload
                listType="picture-card"
                fileList={Array.isArray(fileList) ? fileList : []}
                onPreview={(file) => {
                  // Nếu là file đã upload thì mở url, nếu là file mới thì không preview
                  if (file.url) window.open(file.url, "_blank");
                }}
                onChange={(info) => {
                  // Đảm bảo truyền đúng fileList lên cha
                  handleUploadChange(info);
                }}
                beforeUpload={(file) => {
                  // Validate file type
                  const isPDF = file.type === "application/pdf";
                  if (!isPDF) {
                    toast.error("Chỉ chấp nhận file PDF!");
                    return false;
                  }
                  // Validate file size (max 10MB)
                  const isLt10M = file.size / 1024 / 1024 < 10;
                  if (!isLt10M) {
                    toast.error("File phải nhỏ hơn 10MB!");
                    return false;
                  }
                  return false; // Prevent auto upload
                }}
                maxCount={1}
                accept=".pdf"
                onRemove={() => {
                  // Khi xóa file thì set contractPdf về undefined
                  form.setFieldValue("contractPdf", undefined);
                  return true;
                }}
              >
                {(Array.isArray(fileList) ? fileList : []).length >= 1
                  ? null
                  : uploadButton}
              </Upload>
            </Form.Item>
            {editingContract?.contractPdf &&
              typeof editingContract.contractPdf === "string" && (
                <div className="pdf-preview-button">
                  <Button
                    type="link"
                    icon={<FileOutlined />}
                    onClick={() =>
                      window.open(editingContract.contractPdf, "_blank")
                    }
                  >
                    Xem hợp đồng
                  </Button>
                </div>
              )}
          </Col>
        </Row>
      </div> */}
      </Form>
    </div>
  );
}

export default ContractFormView;
