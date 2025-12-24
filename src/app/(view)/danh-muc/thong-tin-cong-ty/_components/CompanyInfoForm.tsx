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
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import dayjs from "dayjs";
import "../index.scss"; // Import styles
import { LegalRepresentativeDto } from "@/types/dtoRepresent";
import DanhMucCompanyInfoServices from "@/services/danh-muc/thong-tin-cong-ty/thong-tin-cong-ty.service";

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
  const [upcomingOffDays, setUpcomingOffDays] = useState<string[]>([]);
  const [loadingOffDays, setLoadingOffDays] = useState(false);
  const messageApi = useAntdMessage();
  const { modal } = App.useApp();

  // Use Form.useWatch to reactively watch logoUrl (which may be a fileList or a url string)
  const watchedLogoUrl = Form.useWatch("logoUrl", form);

  // Fetch upcoming off days
  const fetchOffDays = async () => {
    try {
      const offDays = await DanhMucCompanyInfoServices.getOffDayList();
      setUpcomingOffDays(offDays || []);
    } catch (error) {
      console.error("Failed to fetch off days:", error);
    }
  };

  // Fetch upcoming off days on mount
  useEffect(() => {
    fetchOffDays();
  }, []);

  useEffect(() => {
    // Normalize watched value into a fileList for the Upload preview
    if (!watchedLogoUrl) {
      setLogoFileList([]);
      return;
    }

    // If form stores a string URL, create a done file entry
    if (typeof watchedLogoUrl === "string") {
      setLogoFileList([
        {
          uid: "-1",
          name: "logo.jpg",
          status: "done",
          url: watchedLogoUrl,
        },
      ]);
      return;
    }

    // If form stores antd Upload fileList, use it directly
    if (Array.isArray(watchedLogoUrl)) {
      setLogoFileList(watchedLogoUrl as any[]);
      return;
    }

    // Otherwise clear
    setLogoFileList([]);
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
    // Update form field with the fileList
    form.setFieldsValue({ logoUrl: fileList });
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
      messageApi.error("Chỉ có thể tải lên file JPG/PNG!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return false; // Prevent auto upload, handle manually
  };
  // Handle delete upcoming off days
  const handleDeleteOffDays = () => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh sách ngày nghỉ sắp áp dụng?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        setLoadingOffDays(true);
        try {
          await DanhMucCompanyInfoServices.deleteOffDayList();
          setUpcomingOffDays([]);
          messageApi.success("Đã xóa danh sách ngày nghỉ sắp áp dụng");
        } catch (error) {
          console.error("Failed to delete off days:", error);
          messageApi.error("Xóa danh sách ngày nghỉ thất bại!");
        } finally {
          setLoadingOffDays(false);
        }
      },
    });
  };

  // Handle form validation failure
  const handleFinishFailed = (errorInfo: any) => {
    console.log("Form validation failed:", errorInfo);
    messageApi.error("Vui lòng kiểm tra lại các trường bắt buộc!");
  };

  // Wrapper for handleSubmit to refresh off days after
  const handleFormSubmit = async (values: any) => {
    await handleSubmit(values);
    // Refresh off days list after successful submission
    await fetchOffDays();
  };

  return (
    <Card title="Thông tin công ty" className="company-info-card">
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 24 }}
        onFinish={handleFormSubmit}
        onFinishFailed={handleFinishFailed}
        initialValues={{
          country: "Việt Nam",
          offDay: "CN",
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
              valuePropName="fileList"
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) return e;
                return e && e.fileList ? e.fileList : undefined;
              }}
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
                  // fileList is controlled for preview only; Form keeps canonical value
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item
              label={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Ngày nghỉ</span>
                </div>
              }
              name="offDays"
              rules={[{ required: true, message: "Vui lòng chọn ngày nghỉ" }]}
            >
              <Select
                size="large"
                mode="multiple"
                options={[
                  { label: "Thứ 2", value: "T2" },
                  { label: "Thứ 3", value: "T3" },
                  { label: "Thứ 4", value: "T4" },
                  { label: "Thứ 5", value: "T5" },
                  { label: "Thứ 6", value: "T6" },
                  { label: "Thứ 7", value: "T7" },
                  { label: "Chủ nhật", value: "CN" },
                ]}
              />
            </Form.Item>
            {upcomingOffDays.length > 0 && (
              <div
                style={{
                  marginTop: "-12px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "12px", color: "#888" }}>
                  ( Sẽ áp dụng đầu tháng)
                </span>
                {upcomingOffDays.map((day) => (
                  <span
                    key={day}
                    style={{
                      background: "#e6f7ff",
                      border: "1px solid #91d5ff",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "12px",
                      color: "#0050b3",
                    }}
                  >
                    {day}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleDeleteOffDays}
                  disabled={loadingOffDays}
                  style={{
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 12px",
                    fontSize: "12px",
                    cursor: loadingOffDays ? "not-allowed" : "pointer",
                    opacity: loadingOffDays ? 0.6 : 1,
                  }}
                >
                  {loadingOffDays ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            )}
          </Col>
          <Col span={6}>
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
