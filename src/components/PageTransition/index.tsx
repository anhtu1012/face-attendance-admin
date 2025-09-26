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
    const interval: NodeJS.Timeout = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
          }, 300);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 20);

    setLoading(true);
    setProgress(0);

    return () => {
      clearInterval(interval);
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
