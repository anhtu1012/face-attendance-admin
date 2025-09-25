"use client";

import { useEffect, useState } from "react";
import "../components/PageTransition/index.scss";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <html>
      <body>
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
            <h2 className="page-transition-text error-text">
              Something went wrong!
            </h2>
            <button onClick={() => reset()} className="retry-button">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
