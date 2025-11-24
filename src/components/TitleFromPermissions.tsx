"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { selectPermissionByRsname } from "@/lib/store/slices/loginSlice";
import { getCookie } from "@/utils/client/getCookie";

const TitleFromPermissions: React.FC = () => {
  // read the current url key from cookie (same approach used in action-button)
  const url = typeof document !== "undefined" ? getCookie("_url") : null;
  const urlMain = url?.toString().replace(/^\/+/, "") ?? "";

  const selectedPermission = useSelector((state: RootState) =>
    selectPermissionByRsname(state, urlMain)
  );

  useEffect(() => {
    const baseTitle = "IT_HUMAN_RESOURCES";
    const permissionTitle = selectedPermission?.resourceName;
    const newTitle = permissionTitle ? `${permissionTitle}` : baseTitle;
    if (typeof document !== "undefined") {
      document.title = newTitle;
    }
  }, [selectedPermission?.resourceName]);

  return null;
};

export default TitleFromPermissions;
