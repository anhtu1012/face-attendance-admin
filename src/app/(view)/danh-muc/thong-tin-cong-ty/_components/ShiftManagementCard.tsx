/* eslint-disable @typescript-eslint/no-explicit-any */
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, TimePicker } from "antd";
import { FormInstance } from "antd/es/form";

interface ShiftManagementCardProps {
  form: FormInstance;
}

const ShiftManagementCard: React.FC<ShiftManagementCardProps> = () => {
  return (
    <Card title="Ca làm việc" className="shift-card">
      <Form.List name="shift">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="shift-row">
                <Row gutter={16} align="middle">
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, "shiftName"]}
                      label={key === 0 ? "Tên ca" : ""}
                      rules={[
                        { required: true, message: "Vui lòng nhập tên ca!" },
                      ]}
                    >
                      <Input placeholder="Nhập tên ca làm việc" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "startTime"]}
                      label={key === 0 ? "Giờ bắt đầu" : ""}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giờ bắt đầu!",
                        },
                      ]}
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="Giờ bắt đầu"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, "endTime"]}
                      label={key === 0 ? "Giờ kết thúc" : ""}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giờ kết thúc!",
                        },
                      ]}
                    >
                      <TimePicker
                        format="HH:mm"
                        placeholder="Giờ kết thúc"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    {key === 0 && (
                      <div
                        style={{
                          height: "40px",
                          lineHeight: "40px",
                          textAlign: "center",
                        }}
                      >
                        Xóa
                      </div>
                    )}
                    <div style={{ textAlign: "center" }}>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          size="large"
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                size="large"
              >
                Thêm ca làm việc
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default ShiftManagementCard;
