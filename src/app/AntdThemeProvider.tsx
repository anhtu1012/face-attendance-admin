"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";

export default function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize state variables with default values that match server-side rendering
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Update dark mode based on saved preference or system preference
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }

    const htmlElement = document.documentElement;

    // Function to update dark mode state
    const updateDarkMode = () => {
      setIsDarkMode(htmlElement.classList.contains("dark"));
    };

    // Set up observer for class changes
    const observer = new MutationObserver(() => {
      updateDarkMode();
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Clean up observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  // Use a consistent approach for both server and client rendering
  const themeConfig = {
    token: {
      // Base colors
      colorPrimary: "#1890ff", // Primary blue
      colorSuccess: "#52c41a",
      colorWarning: "#faad14",
      colorError: "#f5222d",
      colorInfo: "#1890ff",

      // Text colors
      colorText: isDarkMode ? "#ffffff" : "#262626",
      colorTextSecondary: isDarkMode ? "#a6a6a6" : "#595959",
      colorTextTertiary: isDarkMode ? "#8c8c8c" : "#8c8c8c",
      colorTextQuaternary: isDarkMode ? "#595959" : "#bfbfbf",

      // Border colors
      colorBorder: isDarkMode ? "#434343" : "#e8e8e8",
      colorBorderSecondary: isDarkMode ? "#303030" : "#f0f0f0",

      // Background colors
      colorBgContainer: isDarkMode ? "#141414" : "#ffffff",
      colorBgElevated: isDarkMode ? "#1f1f1f" : "#ffffff",
      colorBgLayout: isDarkMode ? "#000000" : "#f0f2f5",

      // Font settings
      fontFamily: "Roboto, sans-serif",
      borderRadius: 4,
    },
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
