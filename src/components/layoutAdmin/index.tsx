"use client";

import { initializeTheme } from "@/utils/theme-utils";
import { Breadcrumb, Layout } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClientOnly from "../ClientOnly";
import HeaderComponent from "./header";
import "./index.scss";
import SiderMain from "./sider";

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  breadcrumbItems?: { title: string; href?: string }[];
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Generate default breadcrumb items based on the current path if not provided
  const generateDefaultBreadcrumbs = () => {
    if (breadcrumbItems) return breadcrumbItems;

    const paths = pathname?.split("/").filter(Boolean) || [];
    return [
      ...paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const pathTitle =
          path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
        return {
          title: pathTitle.replace(/(quan-li|quản-lý)/i, "Quản lý"),
          href,
        };
      }),
    ];
  };

  const items = generateDefaultBreadcrumbs();

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    initializeTheme();

    // Check if window width is small enough to collapse sidebar by default
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    // Run once and then listen for changes
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Render the layout with a stable structure for both server and client
  return (
    <Layout
      style={{ height: "100vh" }}
      className={collapsed ? "layout-collapsed" : ""}
    >
      <ClientOnly>
        <HeaderComponent collapsed={collapsed} setCollapsed={setCollapsed} />
        <SiderMain
          openMenu={collapsed}
          setOpenMenu={(open: boolean) => setCollapsed(!open)}
        />
      </ClientOnly>

      <Layout
        style={{
          height: "90vh",
          marginTop: 54,
          transition: "margin 0.2s",
        }}
      >
        <Content className="admin-content-wrapper">
          {/* Breadcrumb navigation */}
          <div className="">
            <Breadcrumb
              className=""
              items={items.map((item) => ({
                title: item.href ? (
                  <Link href={item.href}>{item.title}</Link>
                ) : (
                  item.title
                ),
              }))}
            />
          </div>
          {children}
          {/* <div className="content-container"></div> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
