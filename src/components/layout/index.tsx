"use client";

import { initializeTheme } from "@/utils/theme-utils";
import { Layout } from "antd";
import React, { useEffect } from "react";
import FooterComponent from "./footer";
import HeaderComponent from "./header";
import "./index.scss";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Layout className="main-layout">
      <HeaderComponent />
      <Content className="main-content">{children}</Content>
      <FooterComponent />
    </Layout>
  );
};

export default MainLayout;
