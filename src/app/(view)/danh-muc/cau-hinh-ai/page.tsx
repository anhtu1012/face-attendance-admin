/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CvPromptSettingsService from "@/services/admin/quan-tri-he-thong/cv-prompt-settings.service";
import type { CvPromptSettings } from "@/types/CvPromptSettings";
import { DEFAULT_CV_PROMPT_SETTINGS_VI } from "@/types/CvPromptSettings";
import {
  BulbOutlined,
  EditOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Tabs,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import "./cv-prompt-settings.scss";
import { translations } from "./translations";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";

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
  const [defaultSetting, setDefaultSetting] = useState<CvPromptSettings | null>(
    null
  );
  const messageApi = useAntdMessage();

  // Helper to convert array fields to/from textarea
  const arrayToText = (arr: string[]) => arr.join("\n");
  const textToArray = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

  // Fetch default settings only
  const fetchDefaultSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CvPromptSettingsService.getAll();

      const items: CvPromptSettings[] = Array.isArray(res)
        ? res
        : res?.data || [];

      const defaultItem =
        items.find((item: CvPromptSettings) => item.isDefault === true) || null;
      console.log("defau", defaultItem);

      if (defaultItem) {
        // Normalize field names
        const normalized = {
          ...defaultItem,
          matchScoreWeights: defaultItem.matchScoreWeight ?? {
            technicalSkills: 0,
            experience: 0,
            seniority: 0,
          },
          analysisInstruction: defaultItem.analysisInstruction ?? {
            summaryGuidelines: [],
            strengthsGuidelines: [],
            weaknessesGuidelines: [],
            generalRules: [],
            maxStrengthsCount: 3,
            maxWeaknessesCount: 3,
            summarySentencesCount: 2,
          },
        };
        setDefaultSetting(normalized);

        // Set form values with arrays converted to text
        const formValues = {
          ...normalized,
          analysisInstruction: {
            ...normalized.analysisInstruction,
            summaryGuidelines: arrayToText(
              normalized.analysisInstruction.summaryGuidelines
            ),
            strengthsGuidelines: arrayToText(
              normalized.analysisInstruction.strengthsGuidelines
            ),
            weaknessesGuidelines: arrayToText(
              normalized.analysisInstruction.weaknessesGuidelines
            ),
            generalRules: arrayToText(
              normalized.analysisInstruction.generalRules
            ),
          },
        };
        form.setFieldsValue(formValues);
      } else {
        // No default found, use constant default
        setDefaultSetting(DEFAULT_CV_PROMPT_SETTINGS_VI);
        const formValues = {
          ...DEFAULT_CV_PROMPT_SETTINGS_VI,
          analysisInstruction: {
            ...DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstruction,
            summaryGuidelines: arrayToText(
              DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstruction
                .summaryGuidelines
            ),
            strengthsGuidelines: arrayToText(
              DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstruction
                .strengthsGuidelines
            ),
            weaknessesGuidelines: arrayToText(
              DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstruction
                .weaknessesGuidelines
            ),
            generalRules: arrayToText(
              DEFAULT_CV_PROMPT_SETTINGS_VI.analysisInstruction.generalRules
            ),
          },
        };
        form.setFieldsValue(formValues);
      }
    } catch (error: any) {
      messageApi.error(error.message || translations.messages.loadError.vi);
      setDefaultSetting(DEFAULT_CV_PROMPT_SETTINGS_VI);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchDefaultSettings();
  }, [fetchDefaultSettings]);

  // Handle update default settings
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Convert textarea strings to arrays
      const payload = {
        ...values,
        analysisInstruction: {
          ...values.analysisInstruction,
          summaryGuidelines: textToArray(
            values.analysisInstruction.summaryGuidelines
          ),
          strengthsGuidelines: textToArray(
            values.analysisInstruction.strengthsGuidelines
          ),
          weaknessesGuidelines: textToArray(
            values.analysisInstruction.weaknessesGuidelines
          ),
          generalRules: textToArray(values.analysisInstruction.generalRules),
        },
      };

      if (defaultSetting?.id) {
        // Update existing default
        await CvPromptSettingsService.update(defaultSetting.id, payload);
        messageApi.success(translations.messages.updateSuccess.vi);
      } else {
        // Create new default
        await CvPromptSettingsService.create({ ...payload, isDefault: true });
        messageApi.success(translations.messages.createSuccess.vi);
      }

      fetchDefaultSettings();
    } catch (error: any) {
      messageApi.error(error.message || translations.messages.saveError.vi);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LayoutContent
        layoutType={1}
        content1={
          <div className="cv-prompt-settings__container">
            <Card
              className="cv-prompt-settings__card"
              title={
                <Space>
                  <StarOutlined style={{ color: "#faad14" }} />
                  <BilingualLabel
                    vi="Cấu hình AI mặc định"
                    en="Default AI Configuration"
                  />
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleSave}
                  icon={<EditOutlined />}
                >
                  {translations.saveButton.vi}
                </Button>
              }
            >
              <Form form={form} layout="vertical" className="cv-settings-form">
                <Tabs
                  defaultActiveKey="1"
                  animated={{ inkBar: true, tabPane: true }}
                >
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
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
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
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
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
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
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
                        label={translations.form.min.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "recommendationThresholds",
                          "stronglyRecommend",
                          "max",
                        ]}
                        label={translations.form.max.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "recommendationThresholds",
                          "stronglyRecommend",
                          "label",
                        ]}
                        label={translations.form.label.vi}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Divider>{translations.form.recommend.vi}</Divider>
                    <div className="threshold-fields">
                      <Form.Item
                        name={["recommendationThresholds", "recommend", "min"]}
                        label={translations.form.min.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={["recommendationThresholds", "recommend", "max"]}
                        label={translations.form.max.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "recommendationThresholds",
                          "recommend",
                          "label",
                        ]}
                        label={translations.form.label.vi}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Divider>{translations.form.consider.vi}</Divider>
                    <div className="threshold-fields">
                      <Form.Item
                        name={["recommendationThresholds", "consider", "min"]}
                        label={translations.form.min.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={["recommendationThresholds", "consider", "max"]}
                        label={translations.form.max.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={["recommendationThresholds", "consider", "label"]}
                        label={translations.form.label.vi}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    <Divider>{translations.form.notGoodFit.vi}</Divider>
                    <div className="threshold-fields">
                      <Form.Item
                        name={["recommendationThresholds", "notGoodFit", "min"]}
                        label={translations.form.min.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={["recommendationThresholds", "notGoodFit", "max"]}
                        label={translations.form.max.vi}
                      >
                        <InputNumber min={0} max={100} />
                      </Form.Item>
                      <Form.Item
                        name={[
                          "recommendationThresholds",
                          "notGoodFit",
                          "label",
                        ]}
                        label={translations.form.label.vi}
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
                          vi={translations.tabs.analysisInstruction.vi}
                          en={translations.tabs.analysisInstruction.en}
                        />
                      </span>
                    }
                    key="4"
                  >
                    <Form.Item
                      name={["analysisInstruction", "summarySentencesCount"]}
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
                      name={["analysisInstruction", "maxStrengthsCount"]}
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
                      name={["analysisInstruction", "maxWeaknessesCount"]}
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
                      name={["analysisInstruction", "summaryGuidelines"]}
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
                      name={["analysisInstruction", "strengthsGuidelines"]}
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
                      name={["analysisInstruction", "weaknessesGuidelines"]}
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
                      name={["analysisInstruction", "generalRules"]}
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
            </Card>
          </div>
        }
      />
    </div>
  );
}

export default CvPromptSettingsPage;
