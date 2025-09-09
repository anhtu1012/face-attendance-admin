import SelectServices from "@/services/select/select.service";
import {
  BankOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tag
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ContractFormViewProps } from "../types";

const { Option } = Select;
const { TextArea } = Input;

const ContractFormView: React.FC<ContractFormViewProps> = ({
  form,
  editingContract,
  fileList = [],
  positions = [],
  branches = [],
  handleUploadChange = () => {},
  ueserDetails,
}) => {
  console.log("ContractFormView props:", { fileList, editingContract });
  // State cho các chi nhánh được chọn
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    editingContract?.branchCodes || []
  );
  const roleCode = ueserDetails?.roleCode || "";

  const [managerrs, setManagers] = useState<{ label: string; value: string }[]>(
    []
  );
  const [filteredPositions, setFilteredPositions] =
    useState<{ label: string; value: string }[]>(positions);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  // Watch for changes in selected branches and role to load managers
  const branchCodes = Form.useWatch("branchCodes", form);

  useEffect(() => {
    if (branchCodes && branchCodes.length > 0 && roleCode) {
      loadManagers(branchCodes, roleCode);
    } else {
      setManagers([]);
    }
  }, [branchCodes, roleCode]);

  useEffect(() => {
    if (roleCode) {
      loadPositionsByRole(roleCode);
    } else {
      setFilteredPositions(positions);
    }
  }, [roleCode, positions]);

  // Sync fileList with form values when editing contract
  useEffect(() => {
    if (
      editingContract &&
      editingContract.contractPdf &&
      (!Array.isArray(fileList) || fileList.length === 0)
    ) {
      console.log(
        "Setting up fileList for editing contract:",
        editingContract.contractPdf
      );
      const existingFile: UploadFile = {
        uid: "-1",
        name: "contract.pdf",
        status: "done",
        url: editingContract.contractPdf,
      };
      // Update the fileList prop through handleUploadChange
      handleUploadChange({ fileList: [existingFile] });
    }
  }, [editingContract, fileList, handleUploadChange]);

  // Function to fetch managers based on branch and role
  const loadManagers = async (branches: string[], role: string) => {
    setLoadingManagers(true);
    try {
      const managersData = await SelectServices.getSelectManagers(
        branches,
        role
      );
      if (managersData) {
        setManagers(managersData);
      } else {
        setManagers([]);
        toast.error("Không thể tải danh sách người quản lý");
      }
    } catch (error) {
      console.error("Error loading managers:", error);
      toast.error("Lỗi khi tải danh sách người quản lý");
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  };

  // Function to fetch positions based on role
  const loadPositionsByRole = async (role: string) => {
    setLoadingPositions(true);
    try {
      const positionsData = await SelectServices.getSelectPositionByRole(role);
      if (positionsData) {
        setFilteredPositions(positionsData);
      } else {
        setFilteredPositions(positions);
        toast.error("Không thể tải danh sách chức vụ theo quyền");
      }
    } catch (error) {
      console.error("Error loading positions by role:", error);
      setFilteredPositions(positions);
    } finally {
      setLoadingPositions(false);
    }
  };

  /**
   * Tính toán thời hạn hợp đồng khi ngày bắt đầu hoặc kết thúc thay đổi
   */
  const calculateDuration = () => {
    const startTime = form?.getFieldValue("startTime");
    const endTime = form?.getFieldValue("endTime");

    if (startTime && endTime) {
      const start = dayjs(startTime);
      const end = dayjs(endTime);
      const years = end.diff(start, "year");
      const months = end.diff(start, "month") % 12;

      let duration = "";
      if (years > 0) {
        duration += `${years} năm `;
      }
      if (months > 0) {
        duration += `${months} tháng`;
      }

      form?.setFieldsValue({ duration: duration.trim() });
    }
  };


  return (
    <div className="contract-form-view">
      <div className="form-section basic-info">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tiêu đề hợp đồng"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input
                prefix={<FileTextOutlined />}
                placeholder="Nhập tiêu đề hợp đồng"
                size="large"
              />
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
                disabled={!editingContract}
              >
                <Option value="ACTIVE">Đang hiệu lực</Option>
                <Option value="INACTIVE">Chấm dứt</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <TextArea
                placeholder="Nhập mô tả về hợp đồng"
                rows={3}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section date-section">
        <Row gutter={16}>
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
                disabled={editingContract}
                placeholder="Chọn ngày bắt đầu"
                size="large"
                suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
                onChange={calculateDuration}
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
                disabled={editingContract}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày kết thúc"
                size="large"
                disabledDate={(current) => {
                  return (
                    current && current < dayjs().add(1, "month").startOf("day")
                  );
                }}
                suffixIcon={<CalendarOutlined style={{ color: "#6b7280" }} />}
                onChange={calculateDuration}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="duration" label="Thời hạn">
              <Input disabled size="large" placeholder="Thời hạn hợp đồng" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section workplace-section">
        <Row gutter={16}>
          <Col span={24}>
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
                options={branches}
                dropdownStyle={{ borderRadius: "10px" }}
                value={selectedBranches}
                onChange={(values) => setSelectedBranches(values)}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <Tag
                      color="blue"
                      closable={closable}
                      onClose={onClose}
                      style={{ marginRight: 3 }}
                    >
                      <BankOutlined style={{ marginRight: 5 }} />
                      {label}
                    </Tag>
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="positionCode"
              label="Chức vụ"
              rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
              tooltip={!roleCode ? "Vui lòng chọn Quyền trước" : ""}
            >
              <Select
                placeholder={
                  !roleCode
                    ? "Chọn Quyền trước"
                    : loadingPositions
                    ? "Đang tải..."
                    : "Chọn chức vụ"
                }
                size="large"
                options={filteredPositions}
                disabled={!roleCode || loadingPositions}
                dropdownStyle={{ borderRadius: "10px" }}
                notFoundContent={
                  loadingPositions ? <Spin size="small" /> : null
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="managedBy"
              label="Quản lý bởi"
              tooltip={
                !branchCodes || !roleCode
                  ? "Vui lòng chọn Chi nhánh và Quyền trước"
                  : ""
              }
            >
              <Select
                placeholder={
                  !branchCodes || !roleCode
                    ? "Chọn Chi nhánh và Quyền trước"
                    : loadingManagers
                    ? "Đang tải..."
                    : "Chọn người quản lý"
                }
                size="large"
                allowClear
                disabled={!branchCodes || !roleCode || loadingManagers}
                options={managerrs}
                notFoundContent={loadingManagers ? <Spin size="small" /> : null}
              />
            </Form.Item>
          </Col>
        </Row>
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
    </div>
  );
};

export default ContractFormView;
