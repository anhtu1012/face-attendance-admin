"use client";

import React from "react";
import { Layout, theme } from "antd";
import "./index.scss";

const { Footer } = Layout;

const FooterComponent: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Footer
      className="site-footer"
      style={{
        textAlign: "center",
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div className="footer-links">
        <div className="footer-section">
          <div className="section-header">Giới thiệu</div>
          <a href="#" className="footer-link">
            Về chúng tôi
          </a>
          <a href="#" className="footer-link">
            Tuyển dụng
          </a>
          <a href="#" className="footer-link">
            Báo chí
          </a>
        </div>

        <div className="footer-section">
          <div className="section-header">Chính sách</div>
          <a href="#" className="footer-link">
            Điều khoản
          </a>
          <a href="#" className="footer-link">
            Bản quyền
          </a>
          <a href="#" className="footer-link">
            Quyền riêng tư
          </a>
        </div>

        <div className="footer-section">
          <div className="section-header">Trợ giúp</div>
          <a href="#" className="footer-link">
            Trung tâm hỗ trợ
          </a>
          <a href="#" className="footer-link">
            Liên hệ
          </a>
          <a href="#" className="footer-link">
            FAQ
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        © 2024 Social Network CV - Phát triển bởi ITC
      </div>
    </Footer>
  );
};

export default FooterComponent;
