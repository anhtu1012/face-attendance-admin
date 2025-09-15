/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { createCategoriesData } from "@/utils/client/createCategoriesData";
import { uppercase } from "@/utils/client/string";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX, useLayoutEffect, useRef, useState, useEffect } from "react";
import { FaArrowCircleUp, FaCheck, FaUsers, FaUserTie, FaClock, FaBuilding, FaChartLine, FaCog, FaBell, FaFileAlt, FaHome, FaIdCard } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./index.scss";
// Interface
interface ModuleData {
  title: string;
  icon: JSX.Element;
  link: string | null;
}
interface CategoryData {
  title: string;
  link: string;
}

interface SiderComponentsProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Category {
  title: string;
  link: string;
}

// Function to convert numbers to Roman numerals
const toRomanNumeral = (num: number): string => {
  const romanNumerals = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  let result = "";
  let remainder = num;

  for (const { value, numeral } of romanNumerals) {
    while (remainder >= value) {
      result += numeral;
      remainder -= value;
    }
  }

  return result;
};

// Function to get icon based on category title
const getCategoryIcon = (title: string): JSX.Element => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('đơn') || titleLower.includes('request')) {
    return <FaFileAlt />;
  } else if (titleLower.includes('chức vụ') || titleLower.includes('position')) {
    return <FaUserTie />;
  } else if (titleLower.includes('ca làm') || titleLower.includes('shift')) {
    return <FaClock />;
  } else if (titleLower.includes('chi nhánh') || titleLower.includes('branch')) {
    return <FaBuilding />;
  } else if (titleLower.includes('báo cáo') || titleLower.includes('report')) {
    return <FaChartLine />;
  } else if (titleLower.includes('cài đặt') || titleLower.includes('setting')) {
    return <FaCog />;
  } else if (titleLower.includes('thông báo') || titleLower.includes('notification')) {
    return <FaBell />;
  } else if (titleLower.includes('người dùng') || titleLower.includes('user')) {
    return <FaUsers />;
  } else if (titleLower.includes('trang chủ') || titleLower.includes('home')) {
    return <FaHome />;
  } else if (titleLower.includes('nhân viên') || titleLower.includes('employee')) {
    return <FaIdCard />;
  } else {
    return <FaFileAlt />; // Default icon
  }
};

// Function to get category description
const getCategoryDescription = (title: string): string => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('đơn')) {
    return 'Quản lý các đơn từ và yêu cầu';
  } else if (titleLower.includes('chức vụ')) {
    return 'Quản lý chức vụ và vị trí công việc';
  } else if (titleLower.includes('ca làm')) {
    return 'Quản lý ca làm việc và lịch trình';
  } else if (titleLower.includes('chi nhánh')) {
    return 'Quản lý chi nhánh và địa điểm';
  } else if (titleLower.includes('báo cáo')) {
    return 'Xem báo cáo và thống kê';
  } else if (titleLower.includes('cài đặt')) {
    return 'Cài đặt hệ thống và tùy chọn';
  } else if (titleLower.includes('thông báo')) {
    return 'Quản lý thông báo và tin nhắn';
  } else if (titleLower.includes('người dùng')) {
    return 'Quản lý tài khoản người dùng';
  } else if (titleLower.includes('trang chủ')) {
    return 'Trang chủ và tổng quan';
  } else if (titleLower.includes('nhân viên')) {
    return 'Quản lý thông tin nhân viên';
  } else {
    return 'Chức năng quản lý hệ thống';
  }
};

const SiderComponents: React.FC<SiderComponentsProps> = ({ setOpenMenu }) => {
  const { permissions } = useSelector(selectAuthLogin);
  const [activeGroupKey, setActiveGroupKey] = useState<string>("");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(-1);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const pathname = usePathname();
  
  const { categoriesData, moduleData } = createCategoriesData({
    permission: permissions,
  }) as {
    categoriesData: { [key: string]: CategoryData[] };
    moduleData: { [key: string]: ModuleData };
  };
  console.log({ categoriesData, moduleData });

  // Function to get active group key and category index based on current URL
  const getActiveStateFromUrl = (): { groupKey: string; categoryIndex: number } => {
    // Use pathname directly instead of cookies for more reliable tracking
    const currentUrl = pathname || "";

    if (!currentUrl) return { groupKey: "", categoryIndex: -1 };

    // Find which group and category contains the current URL
    for (const groupKey of Object.keys(categoriesData)) {
      const categories = categoriesData[groupKey];
      const categoryIndex = categories.findIndex((category) => 
        category.link === currentUrl || currentUrl.startsWith(category.link + "/")
      );
      
      if (categoryIndex !== -1) {
        return { groupKey, categoryIndex };
      }
    }

    return { groupKey: "", categoryIndex: -1 };
  };

  // Set active group and category based on current URL or default to first group (only on initial load)
  useLayoutEffect(() => {
    if (Object.keys(moduleData).length > 0 && !isInitialized) {
      const { groupKey, categoryIndex } = getActiveStateFromUrl();
      if (groupKey) {
        setActiveGroupKey(groupKey);
        setActiveCategoryIndex(categoryIndex);
      } else {
        setActiveGroupKey(Object.keys(moduleData)[0]);
        setActiveCategoryIndex(-1);
      }
      setIsInitialized(true);
    }
  }, [moduleData, categoriesData, isInitialized]);

  // Update active states when pathname changes
  useEffect(() => {
    if (Object.keys(categoriesData).length > 0) {
      const { groupKey, categoryIndex } = getActiveStateFromUrl();
      if (groupKey) {
        setActiveGroupKey(groupKey);
        setActiveCategoryIndex(categoryIndex);
      }
    }
  }, [pathname, categoriesData]);

  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);

  const debounce = (
    func: (...args: any[]) => void,
    wait: number
  ): ((...args: any[]) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Effect để xử lý canvas animation
  useLayoutEffect(() => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = canvas.offsetWidth;
      let height = canvas.offsetHeight;
      const particles = 60;
      const minRadius = 2;
      const maxRadius = 5;
      const x = width / particles;

      const Bubbles = Array.from({ length: particles }, (_, i) => ({
        x: i * x,
        y: height * Math.random(),
        r: minRadius + Math.random() * (maxRadius - minRadius),
        speed: 10 * Math.random(),
        alpha: 0.5,
      }));

      let animationFrameId: number; // Lưu trữ ID của requestAnimationFrame

      const drawBubbles = () => {
        canvas.width = width;
        canvas.height = height;

        Bubbles.forEach((b) => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);

          b.alpha = 0.5 * (b.y / height);

          if (b.speed > 1) {
            b.speed = Math.random() * 1.5;
          }

          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.stroke();
          ctx.fillStyle = `hsla(203, 75%, 69%, ${b.alpha})`;
          ctx.fill();

          b.y -= b.speed;

          if (b.y < 0) {
            b.y = height;
            b.speed = Math.random() * 5;
          }
        });

        animationFrameId = requestAnimationFrame(drawBubbles);
      };

      const draw = () => {
        drawBubbles();
      };

      const resizeCanvas = debounce(() => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        draw();
      }, 200);

      // Khởi chạy animation
      draw();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId); // Hủy animation khi component bị unmount hoặc re-render
      };
    });
  }, []);

  // Xử lý khi click vào một mục
  const handleClick = (index: number, category: Category) => {
    // Xóa các trạng thái activeIndex cũ từ localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("activeIndex_")) {
        localStorage.removeItem(key);
      }
    });

    // Cập nhật trạng thái mới
    document.cookie = `_url=${category.link}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;
    // Gửi sự kiện cập nhật localStorage
    const storageEvent = new Event("localStorageUpdate");
    window.dispatchEvent(storageEvent);
  };

  return (
    <div className="sider-container">
      <canvas
        ref={(canvas) => {
          if (canvas) canvasRefs.current[0] = canvas;
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 16,
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "25%",
            paddingRight: 16,
            borderRight: "2px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(15px)",
            padding: "20px 16px 20px 8px",
          }}
          className="sider-menu"
        >
          <div className="custom-list">
            {Object.keys(moduleData).map((groupKey, groupIndex) => (
              <div
                key={`group-list-${groupKey}`}
                className={`list-item ${
                  activeGroupKey === groupKey ? "active" : ""
                }`}
                style={{ "--item-index": groupIndex } as React.CSSProperties}
                onClick={() => setActiveGroupKey(groupKey)}
              >
                {toRomanNumeral(groupIndex + 1)}.
                {uppercase(moduleData[groupKey].title)}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            width: "75%",
            height: "100%",
            position: "relative",
            transform: "translateY(-5%)",
            zIndex: 10,
          }}
        >
        <div className="container">
          <div className="content">
            {/* Display categories for active group */}
            {activeGroupKey && categoriesData[activeGroupKey] && (
              <div className="sider-content-container">
                <div className="sider_content">
                  {categoriesData[activeGroupKey].map(
                    (category, categoryIndex) => {
                      const isActive = activeCategoryIndex === categoryIndex;
                      const isCurrentPath = pathname === category.link || pathname?.startsWith(category.link + "/");
                      
                      return (
                        <div
                          className={`item__content ${isActive || isCurrentPath ? "active" : ""}`}
                          key={`category-${activeGroupKey}-${categoryIndex}`}
                          style={{ "--item-index": categoryIndex } as React.CSSProperties}
                          onClick={() => {
                            setOpenMenu(false);
                            handleClick(categoryIndex, category);
                            setActiveCategoryIndex(categoryIndex);
                          }}
                        >
                          <Link
                            href={category.link}
                            className="item__content-title"
                          >
                            <div className="category-content">
                              <div className="category-icon">
                                {getCategoryIcon(category.title)}
                              </div>
                              <div className="category-info">
                                <h3 className="category-title">
                                  {category.title}
                                </h3>
                                <p className="category-description">
                                  {getCategoryDescription(category.title)}
                                </p>
                              </div>
                              {(isActive || isCurrentPath) && (
                                <div className="active-indicator">
                                  <FaCheck size={14} />
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
          <div className="arrow__up">
            <FaArrowCircleUp
              size={40}
              color="#fff"
              onClick={() => setOpenMenu(false)}
              title="Close Menu"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiderComponents;
