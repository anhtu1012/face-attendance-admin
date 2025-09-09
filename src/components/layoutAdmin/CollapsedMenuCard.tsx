"use client";

import {
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Card } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./CollapsedMenuCard.scss";

interface CollapsedMenuCardProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  color: string;
  children?: MenuItem[];
  isMainMenu?: boolean;
}

const CollapsedMenuCard: React.FC<CollapsedMenuCardProps> = ({ collapsed }) => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userSelectedMenu, setUserSelectedMenu] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      key: "home",
      title: "Trang chủ",
      icon: <HomeOutlined />,
      href: "/admin",
      color: "#1890ff",
      isMainMenu: true,
    },
    {
      key: "user-management",
      title: "Quản lý người dùng",
      icon: <UserOutlined />,
      color: "#722ed1",
      isMainMenu: true,
      children: [
        {
          key: "users-list",
          title: "Danh sách người dùng",
          icon: <UserOutlined />,
          href: "/admin/quan-li-nguoi-dung",
          color: "#722ed1",
        },
        {
          key: "user-roles",
          title: "Phân quyền",
          icon: <TeamOutlined />,
          href: "/admin/quan-li-nguoi-dung/phan-quyen",
          color: "#13c2c2",
        },
        {
          key: "user-groups",
          title: "Nhóm người dùng",
          icon: <TeamOutlined />,
          href: "/admin/quan-li-nguoi-dung/nhom-nguoi-dung",
          color: "#eb2f96",
        },
      ],
    },
    {
      key: "category-management",
      title: "Quản lý danh mục",
      icon: <TeamOutlined />,
      color: "#13c2c2",
      isMainMenu: true,
      children: [
        {
          key: "departments",
          title: "Phòng ban",
          icon: <TeamOutlined />,
          href: "/admin/quan-li-phong-ban",
          color: "#13c2c2",
        },
        {
          key: "shifts",
          title: "Ca làm việc",
          icon: <ClockCircleOutlined />,
          href: "/admin/quan-li-ca-lam",
          color: "#eb2f96",
        },
        {
          key: "positions",
          title: "Chức vụ",
          icon: <UserOutlined />,
          href: "/admin/quan-li-chuc-vu",
          color: "#fa8c16",
        },
      ],
    },
    {
      key: "attendance",
      title: "Quản lý chấm công",
      icon: <CalendarOutlined />,
      color: "#fa8c16",
      isMainMenu: true,
      children: [
        {
          key: "attendance-records",
          title: "Bản ghi chấm công",
          icon: <CalendarOutlined />,
          href: "/admin/quan-li-cham-cong",
          color: "#fa8c16",
        },
        {
          key: "attendance-reports",
          title: "Báo cáo chấm công",
          icon: <BarChartOutlined />,
          href: "/admin/quan-li-cham-cong/bao-cao",
          color: "#52c41a",
        },
        {
          key: "overtime",
          title: "Quản lý làm thêm",
          icon: <ClockCircleOutlined />,
          href: "/admin/quan-li-cham-cong/lam-them",
          color: "#eb2f96",
        },
      ],
    },
    {
      key: "notifications",
      title: "Thông báo",
      icon: <BellOutlined />,
      href: "/admin/thong-bao",
      badge: 3,
      color: "#faad14",
      isMainMenu: true,
    },
    {
      key: "reports",
      title: "Báo cáo & Thống kê",
      icon: <BarChartOutlined />,
      color: "#52c41a",
      isMainMenu: true,
      children: [
        {
          key: "general-reports",
          title: "Báo cáo tổng quan",
          icon: <BarChartOutlined />,
          href: "/admin/bao-cao",
          color: "#52c41a",
        },
        {
          key: "attendance-stats",
          title: "Thống kê chấm công",
          icon: <CalendarOutlined />,
          href: "/admin/bao-cao/thong-ke-cham-cong",
          color: "#fa8c16",
        },
        {
          key: "user-stats",
          title: "Thống kê người dùng",
          icon: <UserOutlined />,
          href: "/admin/bao-cao/thong-ke-nguoi-dung",
          color: "#722ed1",
        },
      ],
    },
    {
      key: "settings",
      title: "Cài đặt hệ thống",
      icon: <SettingOutlined />,
      color: "#1890ff",
      isMainMenu: true,
      children: [
        {
          key: "system-settings",
          title: "Cài đặt chung",
          icon: <SettingOutlined />,
          href: "/admin/cai-dat",
          color: "#1890ff",
        },
        {
          key: "security-settings",
          title: "Bảo mật",
          icon: <SettingOutlined />,
          href: "/admin/cai-dat/bao-mat",
          color: "#fa8c16",
        },
        {
          key: "backup-settings",
          title: "Sao lưu & Khôi phục",
          icon: <SettingOutlined />,
          href: "/admin/cai-dat/sao-luu",
          color: "#52c41a",
        },
      ],
    },
  ];

  // Tự động mở menu tương ứng với page đang ở (chỉ khi component mount lần đầu)
  useEffect(() => {
    const currentMenu = menuItems.find((item) => {
      // Kiểm tra nếu item có href trực tiếp
      if (item.href && isActive(item.href)) {
        return true;
      }
      // Kiểm tra nếu item có children và một trong số đó active
      if (item.children) {
        return item.children.some(
          (child) => child.href && isActive(child.href)
        );
      }
      return false;
    });

    // Chỉ tự động mở menu khi chưa có menu nào được chọn và người dùng chưa chọn menu
    if (currentMenu && expandedMenus.length === 0 && !userSelectedMenu) {
      setExpandedMenus([currentMenu.key]);
    }
  }, []); // Chỉ chạy một lần khi component mount

  // Tự động mở menu khi pathname thay đổi (nếu chưa có menu nào được chọn và người dùng chưa chọn menu)
  useEffect(() => {
    const currentMenu = menuItems.find((item) => {
      // Kiểm tra nếu item có href trực tiếp
      if (item.href && isActive(item.href)) {
        return true;
      }
      // Kiểm tra nếu item có children và một trong số đó active
      if (item.children) {
        return item.children.some(
          (child) => child.href && isActive(child.href)
        );
      }
      return false;
    });

    // Chỉ tự động mở menu khi chưa có menu nào được chọn và người dùng chưa chọn menu
    if (currentMenu && expandedMenus.length === 0 && !userSelectedMenu) {
      setExpandedMenus([currentMenu.key]);
    }
  }, [pathname, expandedMenus.length, userSelectedMenu]); // Phụ thuộc vào pathname, số lượng menu đang mở và trạng thái người dùng đã chọn

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleMenu = (menuKey: string) => {
    // Đánh dấu rằng người dùng đã chọn menu
    setUserSelectedMenu(true);

    setExpandedMenus(
      (prev) =>
        prev.includes(menuKey)
          ? [] // Nếu đã mở thì đóng lại
          : [menuKey] // Nếu chưa mở thì chỉ mở mục này (đóng các mục khác)
    );
  };

  if (!collapsed) return null;

  return (
    <div className="collapsed-menu-card">
      <div className="menu-layout">
        {/* Main Menu - Left Side (3/10) */}
        <div className="main-menu-section">
          <div className="main-menu-list">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className={`main-menu-item ${
                  expandedMenus.includes(item.key) ? "expanded" : ""
                } ${hoveredItem === item.key ? "hovered" : ""}`}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() =>
                  item.children ? toggleMenu(item.key) : undefined
                }
              >
                <div className="main-menu-icon" style={{ color: item.color }}>
                  {item.badge ? (
                    <Badge count={item.badge} size="small">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </div>
                <div className="main-menu-content">
                  <span className="main-menu-title">{item.title}</span>
                  {item.children && (
                    <div
                      className={`expand-arrow ${
                        expandedMenus.includes(item.key) ? "expanded" : ""
                      }`}
                    >
                      ▼
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submenu Section - Right Side (7/10) */}
        <div className="submenu-section">
          {expandedMenus.length > 0 ? (
            <div className="submenu-content">
              {expandedMenus.map((menuKey) => {
                const menuItem = menuItems.find((item) => item.key === menuKey);
                if (!menuItem || !menuItem.children) return null;

                return (
                  <div key={menuKey} className="submenu-group">
                    <div className="submenu-grid">
                      {menuItem.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href || "#"}
                          className="submenu-card-link"
                        >
                          <Card
                            className={`submenu-card ${
                              isActive(child.href || "") ? "active" : ""
                            }`}
                            size="small"
                            bodyStyle={{
                              padding: "16px",
                              textAlign: "center",
                              position: "relative",
                            }}
                          >
                            <div
                              className="submenu-card-icon"
                              style={{ color: child.color }}
                            >
                              {child.icon}
                            </div>
                            <div className="submenu-card-title">
                              {child.title}
                            </div>
                            {isActive(child.href || "") && (
                              <div
                                className="submenu-active-indicator"
                                style={{ backgroundColor: child.color }}
                              />
                            )}
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-submenu">
              <div className="empty-icon">📋</div>
              <p className="empty-text">
                Chọn một mục menu để xem các tùy chọn
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollapsedMenuCard;
