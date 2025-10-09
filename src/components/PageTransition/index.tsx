"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "./index.scss";

const PageTransition = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Bắt đầu loading khi route thay đổi
    setLoading(true);
    setProgress(0);

    let isPageReady = false;

    // Tăng progress nhanh hơn (10ms thay vì 20ms)
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        // Nếu trang đã ready, cho phép progress chạy đến 100%
        if (isPageReady) {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setLoading(false);
            }, 200);
            return 100;
          }
          return prevProgress + 5; // Tăng nhanh để kết thúc
        }

        // Nếu trang chưa ready, chỉ cho progress chạy đến 90%
        if (prevProgress >= 90) {
          return 90;
        }
        return prevProgress + 2;
      });
    }, 10);

    // Check xem trang đã ready chưa
    const checkPageReady = () => {
      // Sử dụng requestAnimationFrame để đảm bảo DOM đã render
      requestAnimationFrame(() => {
        // Check document.readyState
        if (document.readyState === "complete") {
          isPageReady = true;
          setProgress(95); // Set progress cao để hoàn thành nhanh
        }
      });
    };

    // Check ngay lập tức
    checkPageReady();

    // Listen event load nếu chưa complete
    if (document.readyState !== "complete") {
      window.addEventListener("load", () => {
        isPageReady = true;
        setProgress(95);
      });
    }

    // Fallback: Tắt loading sau tối đa 3 giây (nếu có lỗi gì đó)
    const maxTimeoutId = setTimeout(() => {
      isPageReady = true;
      setProgress(100);
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(maxTimeoutId);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="page-transition">
      <div className="page-transition-content">
        <div
          className="running-man-container"
          style={{ "--progress": progress } as React.CSSProperties}
        >
          <div className="running">
            <div className="outer">
              <div className="body">
                <div className="arm behind"></div>
                <div className="arm front"></div>
                <div className="leg behind"></div>
                <div className="leg front"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-transition-progress-container">
          <div
            className="page-transition-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="brand-text">HUMAN & MONEY</div>
      </div>
    </div>
  );
};

export default PageTransition;
