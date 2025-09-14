/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { createCategoriesData } from "@/utils/client/createCategoriesData";
import { uppercase } from "@/utils/client/string";
import Link from "next/link";
import React, { JSX, useLayoutEffect, useRef, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
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

const SiderComponents: React.FC<SiderComponentsProps> = ({ setOpenMenu }) => {
  const { permissions } = useSelector(selectAuthLogin);
  const [activeGroupKey, setActiveGroupKey] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { categoriesData, moduleData } = createCategoriesData({
    permission: permissions,
  }) as {
    categoriesData: { [key: string]: CategoryData[] };
    moduleData: { [key: string]: ModuleData };
  };
  console.log({ categoriesData, moduleData });

  // Function to get active group key based on current URL
  const getActiveGroupKeyFromUrl = (): string => {
    // Get current URL from cookie
    const cookies = document.cookie.split(";");
    const urlCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("_url=")
    );
    const currentUrl = urlCookie
      ? decodeURIComponent(urlCookie.split("=")[1])
      : "";

    if (!currentUrl) return "";

    // Find which group contains the current URL
    for (const groupKey of Object.keys(categoriesData)) {
      const categories = categoriesData[groupKey];
      if (categories.some((category) => category.link === currentUrl)) {
        return groupKey;
      }
    }

    return "";
  };

  // Set active group based on current URL or default to first group (only on initial load)
  useLayoutEffect(() => {
    if (Object.keys(moduleData).length > 0 && !isInitialized) {
      const urlBasedGroupKey = getActiveGroupKeyFromUrl();
      if (urlBasedGroupKey) {
        setActiveGroupKey(urlBasedGroupKey);
      } else {
        setActiveGroupKey(Object.keys(moduleData)[0]);
      }
      setIsInitialized(true);
    }
  }, [moduleData, categoriesData, isInitialized]);

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
                    (category, categoryIndex) => (
                      <div
                        className="item__content"
                        key={`category-${activeGroupKey}-${categoryIndex}`}
                        style={{ "--item-index": categoryIndex } as React.CSSProperties}
                        onClick={() => {
                          setOpenMenu(false);
                          handleClick(categoryIndex, category);
                        }}
                      >
                        <Link
                          href={category.link}
                          className="item__content-title"
                        >
                          <span className="category-title">
                            {category.title}
                          </span>
                        </Link>
                      </div>
                    )
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
