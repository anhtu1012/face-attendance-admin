"use client";

import { Button, Card, Modal, Space, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import { SecurityScanOutlined, SettingOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function ConsentSettings() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    analytics: false,
    marketing: false,
    functional: true, // Always required
  });

  useEffect(() => {
    // Load saved consent settings
    const saved = localStorage.getItem("consent_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("consent_settings", JSON.stringify(settings));
    localStorage.setItem("analytics_consent", settings.analytics.toString());

    // Reload page to apply changes
    window.location.reload();
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      analytics: true,
      marketing: true,
      functional: true,
    };
    setSettings(allAccepted);
    localStorage.setItem("consent_settings", JSON.stringify(allAccepted));
    localStorage.setItem("analytics_consent", "true");
    setIsVisible(false);

    // Reload to initialize tracking
    window.location.reload();
  };

  const handleRejectAll = () => {
    const allRejected = {
      analytics: false,
      marketing: false,
      functional: true, // Always required
    };
    setSettings(allRejected);
    localStorage.setItem("consent_settings", JSON.stringify(allRejected));
    localStorage.setItem("analytics_consent", "false");
    setIsVisible(false);
  };

  return (
    <>
      <Button
        icon={<SecurityScanOutlined />}
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        Privacy Settings
      </Button>

      <Modal
        title={
          <Space>
            <SettingOutlined />
            Cài đặt quyền riêng tư & Cookie
          </Space>
        }
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        width={600}
        footer={[
          <Button key="reject" onClick={handleRejectAll}>
            Từ chối tất cả
          </Button>,
          <Button key="accept" type="primary" onClick={handleAcceptAll}>
            Chấp nhận tất cả
          </Button>,
          <Button key="save" type="default" onClick={handleSaveSettings}>
            Lưu cài đặt
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Paragraph>
            Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện
            trải nghiệm của bạn, phân tích lưu lượng truy cập và cá nhân hóa nội
            dung.
          </Paragraph>

          <Card
            title="Cookie thiết yếu"
            size="small"
            style={{ marginBottom: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Chức năng cơ bản</Text>
                <br />
                <Text type="secondary">
                  Cần thiết để website hoạt động bình thường
                </Text>
              </div>
              <Switch checked={settings.functional} disabled />
            </div>
          </Card>

          <Card
            title="Analytics & Thống kê"
            size="small"
            style={{ marginBottom: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Google Analytics</Text>
                <br />
                <Text type="secondary">
                  Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện dịch
                  vụ
                </Text>
              </div>
              <Switch
                checked={settings.analytics}
                onChange={(checked) =>
                  setSettings({ ...settings, analytics: checked })
                }
              />
            </div>
          </Card>

          <Card
            title="Marketing & Quảng cáo"
            size="small"
            style={{ marginBottom: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Tracking quảng cáo</Text>
                <br />
                <Text type="secondary">
                  Để hiển thị quảng cáo phù hợp với sở thích của bạn
                </Text>
              </div>
              <Switch
                checked={settings.marketing}
                onChange={(checked) =>
                  setSettings({ ...settings, marketing: checked })
                }
              />
            </div>
          </Card>

          <Paragraph
            type="secondary"
            style={{ fontSize: "12px", marginTop: "16px" }}
          >
            Bạn có thể thay đổi cài đặt này bất cứ lúc nào. Để biết thêm thông
            tin, vui lòng xem <a href="/privacy-policy">Chính sách bảo mật</a>{" "}
            của chúng tôi.
          </Paragraph>
        </div>
      </Modal>
    </>
  );
}
