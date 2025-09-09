"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { MenuOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./index.scss";
import LocaleSwitcher from "../changeLanguage";

const { Header } = Layout;

interface HeaderProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDarkModeToggle = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { key: "home", label: "Trang chủ", path: "/" },
    { key: "about", label: "Giới thiệu", path: "/about" },
    { key: "solutions", label: "Giải pháp", path: "/solutions" },
    { key: "pricing", label: "Báo giá", path: "/pricing" },
    { key: "blog", label: "Blog", path: "/blog" },
    { key: "contact", label: "Liên hệ", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <Header className={`site-header ${isScrolled ? "sticky" : ""}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link href="/" className="logo">
            <span className="logo-text">ATTS</span>
          </Link>
        </div>

        <div className="desktop-menu">
          {navItems.map((item) => (
            <Link href={item.path} className="nav-link" key={item.key}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="header-actions">
          <LocaleSwitcher />

          <Button
            type="text"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            <MenuOutlined />
          </Button>
        </div>

        <Button
          type="text"
          className="theme-toggle-button"
          onClick={handleDarkModeToggle}
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        />
      </div>

      {mobileMenuVisible && (
        <div className="mobile-menu">
          <Menu mode="vertical">
            {navItems.map((item) => (
              <Menu.Item key={item.key}>
                <Link href={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      )}
    </Header>
  );
};

export default HeaderComponent;
