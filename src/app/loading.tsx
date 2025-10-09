"use client";

import { useEffect, useState } from "react";
import "../components/PageTransition/index.scss";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isPageReady = false;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Nếu trang đã ready, cho phép progress chạy đến 100%
        if (isPageReady) {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 5;
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
      requestAnimationFrame(() => {
        if (document.readyState === "complete") {
          isPageReady = true;
          setProgress(95);
        }
      });
    };

    checkPageReady();

    if (document.readyState !== "complete") {
      window.addEventListener("load", () => {
        isPageReady = true;
        setProgress(95);
      });
    }

    // Fallback: sau 3 giây force complete
    const maxTimeout = setTimeout(() => {
      isPageReady = true;
      setProgress(100);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimeout);
    };
  }, []);

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
}
