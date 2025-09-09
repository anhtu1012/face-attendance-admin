"use client";

import MainLayout from "@/components/layout";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import LoadingTruck from "../loading";
// import "./index.scss";

// Use a stable component structure that matches between server and client
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // Simple state with consistent default values
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Set flag after component mounts on client
    setIsClientReady(true);
  }, []);

  // Only show loading on client side
  if (isClientReady && !isClientReady) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingTruck />
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;
