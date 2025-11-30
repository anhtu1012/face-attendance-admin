/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CvPromptSettingsService from "@/services/admin/quan-tri-he-thong/cv-prompt-settings.service";
import type { CvPromptSettings } from "@/types/CvPromptSettings";
import { DEFAULT_CV_PROMPT_SETTINGS_VI } from "@/types/CvPromptSettings";
import {
  BulbOutlined,
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import "./cv-prompt-settings.scss";
import { translations } from "./translations";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";

const { TextArea } = Input;
const { TabPane } = Tabs;

// Bilingual label component
const BilingualLabel = ({ vi, en }: { vi: string; en: string }) => (
  <span>
    {vi} <span className="label-en">({en})</span>
  </span>
);

function CvPromptSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<CvPromptSettings[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CvPromptSettingsService.getAll();
      // Normalize response to an array and map fields that may come in different shapes
      // (some APIs return { data, total } while others return an array)
      // Also handle variations in field names like `matchScoreWeight` vs `matchScoreWeights`
      // and `analysisInstruction` vs `analysisInstructions`.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const respAny: any = response;
      let items: any[] = [];
      if (Array.isArray(respAny)) {
        items = respAny;
      } else if (respAny && Array.isArray(respAny.data)) {
        items = respAny.data;
      }

      const normalized = items.map((it: any) => {
        const matchScoreWeights = it.matchScoreWeights ??
          it.matchScoreWeight ?? {
            technicalSkills: 0,
            experience: 0,
            seniority: 0,
          };

        const analysisInstructions = it.analysisInstructions ??
          it.analysisInstruction ?? {
            summaryGuidelines: [],
            strengthsGuidelines: [],
            weaknessesGuidelines: [],
            generalRules: [],
            maxStrengthsCount: 3,
            maxWeaknessesCount: 3,
            summarySentencesCount: 2,
          };

        return {
          ...it,
          matchScoreWeights,
          analysisInstructions,
        };
      });

      setSettings(normalized);
    } catch (error: any) {
      message.error(error.message || translations.messages.loadError.vi);
      // If no settings in DB, show default
      setSettings([DEFAULT_CV_PROMPT_SETTINGS_VI]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Helper to convert array fields to/from textarea
  const arrayToText = (arr: string[]) => arr.join("\n");
  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

  // Handle create/update
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Convert textarea strings to arrays
      const payload = {
        ...values,
        analysisInstructions: {
          ...values.analysisInstructions,
          summaryGuidelines: textToArray(
            values.analysisInstructions.summaryGuidelines
          ),
          strengthsGuidelines: textToArray(
            values.analysisInstructions.strengthsGuidelines
          ),
          weaknessesGuidelines: textToArray(
            values.analysisInstructions.weaknessesGuidelines
          ),
          generalRules: textToArray(values.analysisInstructions.generalRules),
        },
      };

      if (editingId) {
        // Update
        await CvPromptSettingsService.update(editingId, payload);
        message.success(translations.messages.updateSuccess.vi);
      } else {
        // Create
        await CvPromptSettingsService.create(payload);
        message.success(translations.messages.createSuccess.vi);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchSettings();
    } catch (error: any) {
      message.error(error.message || translations.messages.saveError.vi);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await CvPromptSettingsService.delete(id);
      message.success(translations.messages.deleteSuccess.vi);
      fetchSettings();
    } catch (error: any) {
      message.error(error.message || translations.messages.deleteError.vi);
    } finally {
      setLoading(false);
    }
  };

  // Handle set as default
  const handleSetDefault = async (id: string) => {
    try {
      setLoading(true);
      await CvPromptSettingsService.setAsDefault(id);
      message.success(translations.messages.setDefaultSuccess.vi);
      fetchSettings();
    } catch (error: any) {
      message.error(error.message || translations.messages.setDefaultError.vi);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      await CvPromptSettingsService.toggleActive(id, isActive);
      message.success(translations.messages.toggleActiveSuccess.vi(isActive));
      fetchSettings();
    } catch (error: any) {
      message.error(
        error.message || translations.messages.toggleActiveError.vi
      );
    } finally {
      setLoading(false);
    }
  };

  // Open modal for create
  const handleCreate = () => {
    form.resetFields();
    // Convert arrays to text for form
    const defaultValues = {
      ...DEFAULT_CV_PROMPT_SETTINGS_VI,
      analysisInstructions: {
        ...DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstructions,
        summaryGuidelines: arrayToText(
          DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstructions.summaryGuidelines
        ),
        strengthsGuidelines: arrayToText(
          DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstructions.strengthsGuidelines
        ),
        weaknessesGuidelines: arrayToText(
          DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstructions
            .weaknessesGuidelines
        ),
        generalRules: arrayToText(
          DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstructions.generalRules
        ),
      },
    };
    form.setFieldsValue(defaultValues);
    setEditingId(null);
    setIsModalVisible(true);
  };

  // Open modal for edit
  const handleEdit = (record: CvPromptSettings) => {
    // Convert arrays to text for form
    const formValues = {
      ...record,
      analysisInstructions: {
        ...record.analysisInstructions,
        summaryGuidelines: arrayToText(
          record.analysisInstructions.summaryGuidelines
        ),
        strengthsGuidelines: arrayToText(
          record.analysisInstructions.strengthsGuidelines
        ),
        weaknessesGuidelines: arrayToText(
          record.analysisInstructions.weaknessesGuidelines
        ),
        generalRules: arrayToText(record.analysisInstructions.generalRules),
      },
    };
    form.setFieldsValue(formValues);
    setEditingId(record.id || null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: (
        <BilingualLabel
          vi={translations.columns.name.vi}
          en={translations.columns.name.en}
        />
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: (
        <BilingualLabel
          vi={translations.columns.description.vi}
          en={translations.columns.description.en}
        />
      ),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: (
        <BilingualLabel
          vi={translations.columns.status.vi}
          en={translations.columns.status.en}
        />
      ),
      key: "status",
      width: 150,
      render: (_: any, record: CvPromptSettings) => (
        <Space>
          {record.isDefault ? (
            <Tooltip title="Cấu hình mặc định / Default configuration">
              <Badge status="warning" />
              <Tag
                className="cv-prompt-settings__tag--default"
                icon={<StarOutlined />}
              >
                {translations.status.default.vi}
              </Tag>
            </Tooltip>
          ) : (
            <>
              {" "}
              <Tooltip
                title={
                  record.isActive
                    ? "Click để vô hiệu hóa / Click to deactivate"
                    : "Click để kích hoạt / Click to activate"
                }
              >
                <Switch
                  className="cv-prompt-settings__switch"
                  checked={record.isActive}
                  onChange={(checked) =>
                    handleToggleActive(record.id!, checked)
                  }
                  checkedChildren={translations.status.active.vi}
                  unCheckedChildren={translations.status.inactive.vi}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
    {
      title: (
        <BilingualLabel
          vi={translations.columns.weights.vi}
          en={translations.columns.weights.en}
        />
      ),
      key: "weights",
      width: 200,
      render: (_: any, record: CvPromptSettings) => {
        const weights =
          // support both plural and singular field names
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (record as any).matchScoreWeights ??
            (record as any).matchScoreWeight ?? {
              technicalSkills: 0,
              experience: 0,
              seniority: 0,
            };

        return (
          <div className="cv-prompt-settings__weights">
            <div>
              <span>{translations.weights.technicalSkills.vi}:</span>
              <span>{weights.technicalSkills}%</span>
            </div>
            <div>
              <span>{translations.weights.experience.vi}:</span>
              <span>{weights.experience}%</span>
            </div>
            <div>
              <span>{translations.weights.seniority.vi}:</span>
              <span>{weights.seniority}%</span>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <BilingualLabel
          vi={translations.columns.actions.vi}
          en={translations.columns.actions.en}
        />
      ),
      key: "action",
      width: 150,
      render: (_: any, record: CvPromptSettings) => (
        <div className="cv-prompt-settings__action-buttons">
          {!record.isDefault && (
            <Tooltip title="Đặt làm cấu hình mặc định / Set as default">
              <Button
                type="link"
                icon={<StarOutlined />}
                onClick={() => handleSetDefault(record.id!)}
              >
                {translations.actions.setDefault.vi}
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa cấu hình / Edit configuration">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              {translations.actions.edit.vi}
            </Button>
          </Tooltip>
          {!record.isDefault && (
            <Popconfirm
              title={translations.actions.confirmDelete.vi}
              description={translations.actions.deleteDescription.vi}
              onConfirm={() => handleDelete(record.id!)}
              okText={translations.actions.delete.vi}
              cancelText={translations.cancelButton.vi}
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa cấu hình / Delete configuration">
                <Button type="link" danger icon={<DeleteOutlined />}>
                  {translations.actions.delete.vi}
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <div className="cv-prompt-settings__container">
            <Card
              className="cv-prompt-settings__card"
              title={
                <BilingualLabel
                  vi={translations.pageTitle.vi}
                  en={translations.pageTitle.en}
                />
              }
              extra={
                <Button
                  type="primary"
                  className="cv-prompt-settings__button--create"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  {translations.createButton.vi}
                </Button>
              }
            >
              <Table
                className="cv-prompt-settings__table"
                loading={loading}
                dataSource={settings}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </div>
        }
      />
      <Modal
        className="cv-prompt-settings__modal"
        title={
          editingId ? (
            <BilingualLabel
              vi={translations.editTitle.vi}
              en={translations.editTitle.en}
            />
          ) : (
            <BilingualLabel
              vi={translations.createTitle.vi}
              en={translations.createTitle.en}
            />
          )
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        width={900}
        okText={translations.saveButton.vi}
        cancelText={translations.cancelButton.vi}
        confirmLoading={loading}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="cv-settings-form">
          <Tabs defaultActiveKey="1" animated={{ inkBar: true, tabPane: true }}>
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  <BilingualLabel
                    vi={translations.tabs.basicInfo.vi}
                    en={translations.tabs.basicInfo.en}
                  />
                </span>
              }
              key="1"
            >
              <Form.Item
                name="name"
                label={
                  <BilingualLabel
                    vi={translations.form.name.vi}
                    en={translations.form.name.en}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: translations.messages.nameRequired.vi,
                  },
                ]}
              >
                <Input placeholder={translations.placeholders.name.vi} />
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <BilingualLabel
                    vi={translations.form.description.vi}
                    en={translations.form.description.en}
                  />
                }
              >
                <TextArea
                  rows={2}
                  placeholder={translations.placeholders.description.vi}
                />
              </Form.Item>

              <Space>
                <Form.Item
                  name="isActive"
                  label={
                    <BilingualLabel
                      vi={translations.form.isActive.vi}
                      en={translations.form.isActive.en}
                    />
                  }
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={translations.form.yes.vi}
                    unCheckedChildren={translations.form.no.vi}
                  />
                </Form.Item>

                <Form.Item
                  name="isDefault"
                  label={
                    <BilingualLabel
                      vi={translations.form.isDefault.vi}
                      en={translations.form.isDefault.en}
                    />
                  }
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={translations.form.yes.vi}
                    unCheckedChildren={translations.form.no.vi}
                  />
                </Form.Item>
              </Space>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <PercentageOutlined style={{ marginRight: 8 }} />
                  <BilingualLabel
                    vi={translations.tabs.matchScoreWeights.vi}
                    en={translations.tabs.matchScoreWeights.en}
                  />
                </span>
              }
              key="2"
            >
              <Form.Item
                name={["matchScoreWeights", "technicalSkills"]}
                label={
                  <BilingualLabel
                    vi={translations.form.technicalSkills.vi}
                    en={translations.form.technicalSkills.en}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: translations.messages.weightRequired.vi,
                  },
                ]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name={["matchScoreWeights", "experience"]}
                label={
                  <BilingualLabel
                    vi={translations.form.experience.vi}
                    en={translations.form.experience.en}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: translations.messages.weightRequired.vi,
                  },
                ]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name={["matchScoreWeights", "seniority"]}
                label={
                  <BilingualLabel
                    vi={translations.form.seniority.vi}
                    en={translations.form.seniority.en}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: translations.messages.weightRequired.vi,
                  },
                ]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <StarOutlined style={{ marginRight: 8 }} />
                  <BilingualLabel
                    vi={translations.tabs.recommendationThresholds.vi}
                    en={translations.tabs.recommendationThresholds.en}
                  />
                </span>
              }
              key="3"
            >
              <Divider>{translations.form.stronglyRecommend.vi}</Divider>
              <div className="threshold-fields">
                <Form.Item
                  name={[
                    "recommendationThresholds",
                    "stronglyRecommend",
                    "min",
                  ]}
                  label={
                    <BilingualLabel
                      vi={translations.form.min.vi}
                      en={translations.form.min.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={[
                    "recommendationThresholds",
                    "stronglyRecommend",
                    "max",
                  ]}
                  label={
                    <BilingualLabel
                      vi={translations.form.max.vi}
                      en={translations.form.max.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={[
                    "recommendationThresholds",
                    "stronglyRecommend",
                    "label",
                  ]}
                  label={
                    <BilingualLabel
                      vi={translations.form.label.vi}
                      en={translations.form.label.en}
                    />
                  }
                >
                  <Input />
                </Form.Item>
              </div>

              <Divider>{translations.form.recommend.vi}</Divider>
              <div className="threshold-fields">
                <Form.Item
                  name={["recommendationThresholds", "recommend", "min"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.min.vi}
                      en={translations.form.min.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "recommend", "max"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.max.vi}
                      en={translations.form.max.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "recommend", "label"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.label.vi}
                      en={translations.form.label.en}
                    />
                  }
                >
                  <Input />
                </Form.Item>
              </div>

              <Divider>{translations.form.consider.vi}</Divider>
              <div className="threshold-fields">
                <Form.Item
                  name={["recommendationThresholds", "consider", "min"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.min.vi}
                      en={translations.form.min.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "consider", "max"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.max.vi}
                      en={translations.form.max.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "consider", "label"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.label.vi}
                      en={translations.form.label.en}
                    />
                  }
                >
                  <Input />
                </Form.Item>
              </div>

              <Divider>{translations.form.notGoodFit.vi}</Divider>
              <div className="threshold-fields">
                <Form.Item
                  name={["recommendationThresholds", "notGoodFit", "min"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.min.vi}
                      en={translations.form.min.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "notGoodFit", "max"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.max.vi}
                      en={translations.form.max.en}
                    />
                  }
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                  name={["recommendationThresholds", "notGoodFit", "label"]}
                  label={
                    <BilingualLabel
                      vi={translations.form.label.vi}
                      en={translations.form.label.en}
                    />
                  }
                >
                  <Input />
                </Form.Item>
              </div>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <BulbOutlined style={{ marginRight: 8 }} />
                  <BilingualLabel
                    vi={translations.tabs.analysisInstructions.vi}
                    en={translations.tabs.analysisInstructions.en}
                  />
                </span>
              }
              key="4"
            >
              <Form.Item
                name={["analysisInstructions", "summarySentencesCount"]}
                label={
                  <BilingualLabel
                    vi={translations.form.summarySentencesCount.vi}
                    en={translations.form.summarySentencesCount.en}
                  />
                }
              >
                <InputNumber min={1} max={5} />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "maxStrengthsCount"]}
                label={
                  <BilingualLabel
                    vi={translations.form.maxStrengthsCount.vi}
                    en={translations.form.maxStrengthsCount.en}
                  />
                }
              >
                <InputNumber min={1} max={10} />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "maxWeaknessesCount"]}
                label={
                  <BilingualLabel
                    vi={translations.form.maxWeaknessesCount.vi}
                    en={translations.form.maxWeaknessesCount.en}
                  />
                }
              >
                <InputNumber min={1} max={10} />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "summaryGuidelines"]}
                label={
                  <BilingualLabel
                    vi={translations.form.summaryGuidelines.vi}
                    en={translations.form.summaryGuidelines.en}
                  />
                }
              >
                <TextArea
                  rows={4}
                  placeholder={translations.placeholders.guidelines.vi}
                />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "strengthsGuidelines"]}
                label={
                  <BilingualLabel
                    vi={translations.form.strengthsGuidelines.vi}
                    en={translations.form.strengthsGuidelines.en}
                  />
                }
              >
                <TextArea
                  rows={4}
                  placeholder={translations.placeholders.guidelines.vi}
                />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "weaknessesGuidelines"]}
                label={
                  <BilingualLabel
                    vi={translations.form.weaknessesGuidelines.vi}
                    en={translations.form.weaknessesGuidelines.en}
                  />
                }
              >
                <TextArea
                  rows={4}
                  placeholder={translations.placeholders.guidelines.vi}
                />
              </Form.Item>

              <Form.Item
                name={["analysisInstructions", "generalRules"]}
                label={
                  <BilingualLabel
                    vi={translations.form.generalRules.vi}
                    en={translations.form.generalRules.en}
                  />
                }
              >
                <TextArea
                  rows={6}
                  placeholder={translations.placeholders.rules.vi}
                />
              </Form.Item>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <GlobalOutlined style={{ marginRight: 8 }} />
                  <BilingualLabel
                    vi={translations.tabs.languageConfig.vi}
                    en={translations.tabs.languageConfig.en}
                  />
                </span>
              }
              key="5"
            >
              <Divider>{translations.form.vietnamese.vi}</Divider>
              <Form.Item
                name={["languages", "vi", "roleDescription"]}
                label={
                  <BilingualLabel
                    vi={translations.form.roleDescription.vi}
                    en={translations.form.roleDescription.en}
                  />
                }
              >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item
                name={["languages", "vi", "analysisTitle"]}
                label={
                  <BilingualLabel
                    vi={translations.form.analysisTitle.vi}
                    en={translations.form.analysisTitle.en}
                  />
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["languages", "vi", "rulesTitle"]}
                label={
                  <BilingualLabel
                    vi={translations.form.rulesTitle.vi}
                    en={translations.form.rulesTitle.en}
                  />
                }
              >
                <Input />
              </Form.Item>

              <Divider>{translations.form.english.vi}</Divider>
              <Form.Item
                name={["languages", "en", "roleDescription"]}
                label={
                  <BilingualLabel
                    vi={translations.form.roleDescription.en}
                    en={translations.form.roleDescription.vi}
                  />
                }
              >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item
                name={["languages", "en", "analysisTitle"]}
                label={
                  <BilingualLabel
                    vi={translations.form.analysisTitle.en}
                    en={translations.form.analysisTitle.vi}
                  />
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["languages", "en", "rulesTitle"]}
                label={
                  <BilingualLabel
                    vi={translations.form.rulesTitle.en}
                    en={translations.form.rulesTitle.vi}
                  />
                }
              >
                <Input />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
}

export default CvPromptSettingsPage;
