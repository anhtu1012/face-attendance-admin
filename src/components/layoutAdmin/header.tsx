/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBroadcastChannel } from "@/hook/useBroadcastChannel";
import { clearAllColumnPreferences } from "@/lib/store/slices/columnPreferencesSlice";
import { clearAuthData, selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { toggleDarkMode } from "@/utils/theme-utils";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Tooltip, theme } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LocaleSwitcher from "../changeLanguage";
import NotificationDropdown from "../notficationDropdown/NotificationDropdown";
import "./index.scss";
const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { token } = theme.useToken();
  const { userProfile } = useSelector(selectAuthLogin);
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dispatch = useDispatch();
  const { sendMessage } = useBroadcastChannel<{ action: string }>(
    "theme-channel"
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleLogOut = async () => {
    try {
      // const token = getCookie("token");
      // if (token) {
      //   await AuthServices.logout(token);
      // }

      dispatch(clearAuthData());
      dispatch(clearAllColumnPreferences());

      // Remove cookies
      document.cookie = "token=; Max-Age=0; path=/;";
      document.cookie = "refreshToken=; Max-Age=0; path=/;";

      window.location.href = "/login";
      toast.success("Đăng xuất thành công!!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng xuất thất bại");
    }
  };

  const items = [
    {
      key: "1",
      label: <Link href="/profile">Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: (
        <Button
          type="text"
          onClick={() => {
            toggleDarkMode();
            sendMessage({ action: "toggle-theme" });
          }}
          style={{
            padding: 0,
            height: "auto",
            width: "100%",
            textAlign: "left",
          }}
        >
          Chuyển chế độ tối/sáng
        </Button>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: "3",
      label: (
        <Button
          type="text"
          danger
          onClick={handleLogOut}
          style={{
            padding: 0,
            height: "auto",
            width: "100%",
            textAlign: "left",
          }}
        >
          Đăng xuất
        </Button>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  // Prevent SSR/Client mismatch by returning simplified header during server render
  if (!mounted) {
    return (
      <Header
        className="site-layout-header"
        style={{
          padding: 0,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          height: "10vh",
          maxHeight: "10vh",
        }}
      />
    );
  }

  return (
    <Header
      className="site-layout-header"
      style={{
        padding: 0,
        background: token.colorBgContainer,
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        height: "64px",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div className="header-left">
        <Tooltip
          title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          placement="right"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="toggle-btn"
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          />
        </Tooltip>
        <Link href="/" className="logo-container">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-icon"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="currentColor"
            />
            <path
              d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
              fill="currentColor"
            />
          </svg>
          <span className="logo-text">AttendEase</span>
        </Link>
      </div>

      <div className="header-center">
        <div className={`search-container ${searchFocused ? "focused" : ""}`}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Button
            type="primary"
            className="search-button"
            icon={<SearchOutlined />}
          />
        </div>
      </div>

      <div className="header-right">
        <Tooltip title="Trợ giúp">
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            className="icon-button"
          />
        </Tooltip>

        <Tooltip title="Thông báo">
          <NotificationDropdown placement="bottomRight" />
        </Tooltip>

        <div className="divider"></div>

        <LocaleSwitcher />

        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="user-dropdown"
        >
          <div className="user-profile-container">
            <Avatar
              className="user-avatar"
              icon={<UserOutlined />}
              style={{ backgroundColor: token.colorPrimary }}
            >
              {userProfile?.fullName?.charAt(0) || "U"}
            </Avatar>
            {!collapsed && (
              <span className="user-name">
                {userProfile?.fullName || "User"}
              </span>
            )}
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
