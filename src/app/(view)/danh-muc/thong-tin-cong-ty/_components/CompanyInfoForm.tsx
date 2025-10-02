/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Upload,
  Modal,
} from "antd";
import { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "../index.scss"; // Import styles
import { LegalRepresentativeDto } from "@/types/dtoRepresent";

const { Option } = Select;

interface CompanyInfoFormProps {
  form: FormInstance;
  handleSubmit: (values: any) => Promise<void>;
  addressOptions: any[];
  addressLoading: boolean;
  handleAddressSearch: (searchText: string) => Promise<void>;
  handleAddressSelectEnhanced: (placeId: string, option: any) => Promise<void>;
  handleAddressClear?: () => void;
  mapComponent?: React.ReactNode;
  children?: React.ReactNode;
  legalRepresentativeOptions?: LegalRepresentativeDto[];
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  form,
  handleSubmit,
  addressOptions,
  addressLoading,
  handleAddressSearch,
  handleAddressSelectEnhanced,
  handleAddressClear,
  mapComponent,
  children,
  legalRepresentativeOptions,
}) => {
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const { message } = App.useApp();

  // Use Form.useWatch to reactively watch logoUrl and update fileList in an effect
  const watchedLogoUrl = Form.useWatch("logoUrl", form);

  useEffect(() => {
    if (watchedLogoUrl && typeof watchedLogoUrl === "string") {
      const currentUrl = logoFileList[0]?.url;
      if (currentUrl !== watchedLogoUrl) {
        setLogoFileList([
          {
            uid: "-1",
            name: "logo.jpg",
            status: "done",
            url: watchedLogoUrl,
          },
        ]);
      }
    } else if (!watchedLogoUrl && logoFileList.length > 0) {
      setLogoFileList([]);
    }
    // Only run when watchedLogoUrl changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedLogoUrl]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Handle logo upload
  const handleLogoChange = ({ fileList }: any) => {
    setLogoFileList(fileList);
    // Update form field with the file
    if (fileList.length > 0) {
      form.setFieldsValue({ logoUrl: fileList[0] });
    } else {
      form.setFieldsValue({ logoUrl: null });
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || "Xem ảnh");
  };

  // Before upload validation
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể tải lên file JPG/PNG!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return false; // Prevent auto upload, handle manually
  };
  // Handle form validation failure
  const handleFinishFailed = (errorInfo: any) => {
    console.log("Form validation failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại các trường bắt buộc!");
  };

  return (
    <Card title="Thông tin công ty" className="company-info-card">
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        onFinish={handleSubmit}
        onFinishFailed={handleFinishFailed}
        initialValues={{
          shift: [{ shiftName: "", startTime: null, endTime: null }],
          country: "Việt Nam",
        }}
      >
        {/* Thông tin công ty */}
        <Row gutter={16}>
          <Col span={21}>
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item
                  label="Tên công ty"
                  name="companyName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên công ty!" },
                  ]}
                >
                  <Input placeholder="Nhập tên công ty" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Mã số doanh nghiệp"
                  name="taxCode"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã số doanh nghiệp!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã số doanh nghiệp" size="large" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  label="Tên viết tắt"
                  name="shortName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên viết tắt!" },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên viết tắt (VD: ABC)"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày thành lập"
                  name="establishDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày thành lập!",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày thành lập"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giấy phép kinh doanh số"
                  name="businessLicenseNo"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số giấy phép kinh doanh!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số giấy phép kinh doanh"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={3}>
            <Form.Item
              label="Logo công ty"
              name="logoUrl"
              style={{ height: "100%" }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Upload
                  name="logo"
                  listType="picture-card"
                  fileList={logoFileList}
                  onChange={handleLogoChange}
                  onPreview={handlePreview}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  accept="image/*"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="logo-upload-full-height"
                >
                  {logoFileList.length >= 1 ? null : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "150px",
                      }}
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={() => setPreviewOpen(false)}
                  centered
                >
                  <img
                    alt="logo preview"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>
          </Col>
        </Row>
        {/* Thông tin liên hệ */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9+\-\s()]+$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Website"
              name="website"
              rules={[{ type: "url", message: "Website không hợp lệ!" }]}
            >
              <Input placeholder="Nhập website (http://...)" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            {/* Địa chỉ và bản đồ */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ trụ sở chính"
                  name="addressLine"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa chỉ!" },
                  ]}
                >
                  <Select
                    size="large"
                    showSearch
                    placeholder="Tìm kiếm và chọn địa chỉ"
                    filterOption={false}
                    onSearch={handleAddressSearch}
                    onSelect={(value, option) =>
                      handleAddressSelectEnhanced(value, option)
                    }
                    onClear={handleAddressClear}
                    loading={addressLoading}
                    notFoundContent={
                      addressLoading ? "Đang tìm kiếm..." : "Không tìm thấy"
                    }
                    allowClear
                  >
                    {addressOptions.map((option) => (
                      <Option
                        key={option.value}
                        value={option.label}
                        data-place-id={option.value}
                      >
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* Hidden field to store placeId */}
                <Form.Item name="placeId" hidden>
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Form.Item label="Quận/Huyện" name="district">
                  <Input placeholder="Quận/Huyện" disabled size="large" />
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item label="Tỉnh/Thành phố" name="city">
                  <Input placeholder="Tỉnh/Thành phố" disabled size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quốc gia"
                  name="country"
                  rules={[
                    { required: true, message: "Vui lòng nhập quốc gia!" },
                  ]}
                >
                  <Input placeholder="Nhập quốc gia" disabled size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div style={{ height: "100%", marginTop: "30px", width: "100%" }}>
              <div
                style={{
                  background: "#f0f8ff",
                  border: "2px solid #e1f5fe",
                  borderRadius: "8px",
                  height: "100%",
                  padding: "4px",
                }}
              >
                {mapComponent}
              </div>
            </div>
          </Col>
        </Row>

        {/* Thông tin người đại diện pháp luật */}
        <div style={{ marginTop: "24px", marginBottom: "16px" }}>
          <h3 style={{ color: "rgb(21, 101, 192)", margin: 0 }}>
            Thông tin người đại diện pháp luật
          </h3>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="legalRepresentativeId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn người đại diện!",
                },
              ]}
            >
              <Select
                placeholder="Chọn họ và tên người đại diện"
                size="large"
                onChange={(value) => {
                  const list = legalRepresentativeOptions ?? [];
                  const selected = list.find(
                    (item) => item.legalRepresentativeId === value
                  );
                  if (selected) {
                    form.setFieldsValue({
                      legalRepresentativeId: selected.legalRepresentativeId,
                      legalRepresentative: selected.legalRepresentative,
                      position: selected.position,
                      identityNumber: selected.identityNumber,
                      identityIssuedDate: selected.identityIssuedDate
                        ? dayjs(selected.identityIssuedDate)
                        : null,
                      identityIssuedPlace: selected.identityIssuedPlace,
                    });
                  }
                }}
                allowClear
              >
                {(legalRepresentativeOptions ?? []).map((item) => (
                  <Option
                    key={item.legalRepresentativeId}
                    value={item.legalRepresentativeId}
                  >
                    {item.legalRepresentative}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chức vụ" name="position">
              <Input placeholder="Nhập chức vụ" disabled size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="CMND/CCCD/Hộ chiếu" name="identityNumber">
              <Input
                placeholder="Nhập số CMND/CCCD/Hộ chiếu"
                disabled
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày cấp" name="identityIssuedDate">
              <DatePicker
                disabled
                placeholder="Chọn ngày cấp"
                size="large"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Nơi cấp" name="identityIssuedPlace">
              <Input placeholder="Nhập nơi cấp" disabled size="large" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hidden coordinate fields */}
        <Form.Item name="legalRepresentativeId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="legalRepresentative" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="lat" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="long" hidden>
          <Input />
        </Form.Item>

        {/* logoUrl is watched via Form.useWatch and handled in useEffect above */}

        {/* Render children (e.g., ShiftManagementCard) inside the same Form */}
        {children}
      </Form>
    </Card>
  );
};

export default CompanyInfoForm;
