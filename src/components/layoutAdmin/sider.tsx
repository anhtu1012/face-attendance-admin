"use client";
import React, { useRef, useState } from "react";
import "./index.scss";
import SiderComponents from "./siderComponents/sider";

interface SiderMainProps {
  openMenu?: boolean;
  setOpenMenu?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((open: boolean) => void);
}

export default function SiderMain({
  openMenu: openMenuProp,
  setOpenMenu: setOpenMenuProp,
}: SiderMainProps) {
  const [openMenuLocal, setOpenMenuLocal] = useState(false);

  // Use props if provided, otherwise use local state
  const openMenu = openMenuProp !== undefined ? openMenuProp : openMenuLocal;
  const menuContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={menuContainerRef}
      className={`menu-container`}
      style={{
        position: "relative",
        transition: "flex-basis 0.3s ease",
        flexBasis: "102px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* Menu trượt */}
      <div
        className={`menu-slide ${openMenu ? "open" : ""}`}
        style={{
          height: 500,
          zIndex: 0,
          width: "100vw",
          padding: "0 16px 0 0",
          position: "absolute",
          left: 0,
          top: openMenu ? "100%" : "-999px",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {/* Element */}
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: 12,
              opacity: openMenu ? 1 : 0,
            }}
          >
            <SiderComponents
              setOpenMenu={(
                value: boolean | ((prevState: boolean) => boolean)
              ) => {
                if (setOpenMenuProp) {
                  if (typeof value === "function") {
                    setOpenMenuProp(value(openMenu));
                  } else {
                    setOpenMenuProp(value);
                  }
                } else {
                  if (typeof value === "function") {
                    setOpenMenuLocal(value);
                  } else {
                    setOpenMenuLocal(value);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
