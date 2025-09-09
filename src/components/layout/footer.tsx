/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Button,
  Dropdown,
} from "antd";
import Link from "next/link";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GlobalOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { Footer } = Layout;
const { Title, Text } = Typography;

const FooterComponent: React.FC = () => {
  const languageItems = [
    { key: "vi", label: "Tiếng Việt" },
    { key: "en", label: "English" },
    { key: "fr", label: "Français" },
    { key: "es", label: "Español" },
    { key: "de", label: "Deutsch" },
  ];

  return (
    <Footer className="site-footer">
      <div className="footer-container">
        <Row gutter={[32, 24]} className="footer-links">
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Sản Phẩm</Title>
            <ul className="footer-list">
              <li>
                <Link href="/attendance">Chấm Công</Link>
              </li>
              <li>
                <Link href="/time-attendance">Phần Mềm Chấm Công</Link>
              </li>
              <li>
                <Link href="/timesheet">Bảng Chấm Công</Link>
              </li>
              <li>
                <Link href="/time-clock">Phần Mềm Đồng Hồ Thời Gian</Link>
              </li>
              <li>
                <Link href="/project-time">Theo Dõi Thời Gian Dự Án</Link>
              </li>
              <li>
                <Link href="/integrations">Tích Hợp</Link>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Ngành Nghề</Title>
            <ul className="footer-list">
              <li>
                <Link href="/enterprise">Doanh Nghiệp</Link>
              </li>
              <li>
                <Link href="/freelancer">Freelancer</Link>
              </li>
              <li>
                <Link href="/construction">Xây Dựng</Link>
              </li>
              <li>
                <Link href="/accountants">Kế Toán</Link>
              </li>
              <li>
                <Link href="/consultants">Tư Vấn</Link>
              </li>
              <li>
                <Link href="/healthcare">Y Tế</Link>
              </li>
              <li>
                <Link href="/education">Giáo Dục</Link>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Tài Nguyên</Title>
            <ul className="footer-list">
              <li>
                <Link href="/calculator">Máy Tính Bảng Chấm Công</Link>
              </li>
              <li>
                <Link href="/templates">Mẫu Bảng Chấm Công</Link>
              </li>
              <li>
                <Link href="/resources">Tài Nguyên Theo Dõi Thời Gian</Link>
              </li>
              <li>
                <Link href="/articles">Bài Viết</Link>
              </li>
              <li>
                <Link href="/tutorials">Hướng Dẫn</Link>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Hỗ Trợ</Title>
            <ul className="footer-list">
              <li>
                <Link href="/feedback">Phản Hồi</Link>
              </li>
              <li>
                <Link href="/help">Trung Tâm Trợ Giúp</Link>
              </li>
              <li>
                <Link href="/faq">Câu Hỏi Thường Gặp</Link>
              </li>
              <li>
                <Link href="/attendance-faq">
                  Câu Hỏi Thường Gặp Về Chấm Công
                </Link>
              </li>
              <li>
                <Link href="/demo">Đặt Lịch Demo</Link>
              </li>
              <li>
                <Link href="/partner">Trở Thành Đối Tác</Link>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Text className="maximize-text">
            Tối đa hóa hiệu suất của đội ngũ của bạn ngay hôm nay
          </Text>

          <Space className="social-links">
            <Link href="https://facebook.com" className="social-link">
              <FacebookOutlined />
            </Link>
            <Link href="https://twitter.com" className="social-link">
              <TwitterOutlined />
            </Link>
            <Link href="https://linkedin.com" className="social-link">
              <LinkedinOutlined />
            </Link>
            <Link href="https://instagram.com" className="social-link">
              <InstagramOutlined />
            </Link>
          </Space>

          <Divider className="footer-bottom-divider" />

          <Row className="copyright-row" justify="space-between" align="middle">
            <Col>
              <Text className="copyright-text">
                Bản quyền © {new Date().getFullYear()} Hệ Thống Chấm Công.
              </Text>
            </Col>

            <Col>
              <Space size={16}>
                <Dropdown menu={{ items: languageItems }} placement="topRight">
                  <Button type="text" className="language-button">
                    <GlobalOutlined /> Tiếng Việt <DownOutlined />
                  </Button>
                </Dropdown>

                <Link href="/terms" className="legal-link">
                  Điều Khoản & Điều Kiện
                </Link>

                <Link href="/privacy" className="legal-link">
                  Chính Sách Bảo Mật
                </Link>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </Footer>
   
  );
};

export default FooterComponent;
