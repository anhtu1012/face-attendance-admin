"use client";
import React from "react";
import { Modal, Tabs, List, Checkbox, Card, Tag, Descriptions } from "antd";
import dayjs from "dayjs";
import type { Holiday } from "../HolidayCalendar";
import Cbutton from "@/components/basicUI/Cbutton";

interface CompensationItem {
  holiday: Holiday;
  compensationDate: string;
  reason: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  previewHolidays: Holiday[];
  selectedHolidaysToCreate: string[];
  setSelectedHolidaysToCreate: (ids: string[]) => void;
  compensationDays: CompensationItem[];
  onConfirm: () => void;
  selectedYear: number;
}

export default function CreateYearHolidaysModal({
  open,
  onClose,
  previewHolidays,
  selectedHolidaysToCreate,
  setSelectedHolidaysToCreate,
  compensationDays,
  onConfirm,
  selectedYear,
}: Props) {
  const toggleSelection = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedHolidaysToCreate([...selectedHolidaysToCreate, id]);
    } else {
      setSelectedHolidaysToCreate(
        selectedHolidaysToCreate.filter((i) => i !== id)
      );
    }
  };

  return (
    <Modal
      title={`Tạo ngày nghỉ lễ trong năm ${selectedYear}`}
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Cbutton
          key="cancel"
          customVariant="default"
          onClick={onClose}
          style={{ marginRight: "5px" }}
        >
          Hủy
        </Cbutton>,
        <Cbutton
          key="create"
          customVariant="primary"
          onClick={onConfirm}
          disabled={selectedHolidaysToCreate.length === 0}
        >
          Tạo {selectedHolidaysToCreate.length} ngày nghỉ
        </Cbutton>,
      ]}
      className="year-holidays-modal"
    >
      <Tabs
        items={[
          {
            key: "public",
            label: `Ngày lễ công cộng (${
              previewHolidays.filter((h) => h.type === "public").length
            })`,
            children: (
              <List
                bordered
                dataSource={previewHolidays.filter((h) => h.type === "public")}
                renderItem={(holiday) => (
                  <List.Item>
                    <Checkbox
                      checked={selectedHolidaysToCreate.includes(holiday.id)}
                      onChange={(e) =>
                        toggleSelection(holiday.id, e.target.checked)
                      }
                    >
                      <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {holiday.name}
                        </div>
                        <Descriptions size="small" column={2}>
                          <Descriptions.Item label="Ngày">
                            {dayjs(holiday.date).format("DD/MM/YYYY")} —{" "}
                            {dayjs(holiday.date).format("dddd")}
                          </Descriptions.Item>
                          <Descriptions.Item label="Mô tả">
                            {holiday.description}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </Checkbox>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "lunar",
            label: `Tết Âm lịch (${
              previewHolidays.filter((h) => h.type === "lunar").length
            })`,
            children: (
              <List
                bordered
                dataSource={previewHolidays.filter((h) => h.type === "lunar")}
                renderItem={(holiday) => (
                  <List.Item>
                    <Checkbox
                      checked={selectedHolidaysToCreate.includes(holiday.id)}
                      onChange={(e) =>
                        toggleSelection(holiday.id, e.target.checked)
                      }
                    >
                      <div style={{ marginLeft: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          <Tag color="orange" style={{ marginRight: 8 }}>
                            Âm lịch
                          </Tag>
                          {holiday.name}
                        </div>
                        <Descriptions size="small" column={2}>
                          <Descriptions.Item label="Ngày">
                            {dayjs(holiday.date).format("DD/MM/YYYY")} —{" "}
                            {dayjs(holiday.date).format("dddd")}
                          </Descriptions.Item>
                          <Descriptions.Item label="Mô tả">
                            {holiday.description}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </Checkbox>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "compensation",
            label: `Ngày nghỉ bù (${
              previewHolidays.filter((h) => h.id.includes("compensation"))
                .length
            })`,
            children:
              compensationDays.length === 0 ? (
                <Card>
                  <p
                    style={{ textAlign: "center", margin: 0, color: "#595959" }}
                  >
                    Không có ngày nghỉ lễ nào rơi vào thứ 7 hoặc Chủ Nhật
                  </p>
                </Card>
              ) : (
                <List
                  bordered
                  dataSource={previewHolidays.filter((h) =>
                    h.id.includes("compensation")
                  )}
                  renderItem={(holiday) => (
                    <List.Item>
                      <Checkbox
                        checked={selectedHolidaysToCreate.includes(holiday.id)}
                        onChange={(e) =>
                          toggleSelection(holiday.id, e.target.checked)
                        }
                      >
                        <div style={{ marginLeft: 12, width: "100%" }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>
                            <Tag color="green" style={{ marginRight: 8 }}>
                              Nghỉ bù
                            </Tag>
                            {holiday.name}
                          </div>
                          <Descriptions size="small" column={1}>
                            <Descriptions.Item label="Ngày nghỉ bù">
                              {dayjs(holiday.date).format("DD/MM/YYYY")} —{" "}
                              {dayjs(holiday.date).format("dddd")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lý do">
                              {holiday.description}
                            </Descriptions.Item>
                          </Descriptions>
                        </div>
                      </Checkbox>
                    </List.Item>
                  )}
                />
              ),
          },
        ]}
      />
    </Modal>
  );
}
