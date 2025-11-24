"use client";

import { RootState } from "@/lib/store";
import { selectPermissionByRsname } from "@/lib/store/slices/loginSlice";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const TitleFromPermissions: React.FC = () => {
  // Use the current pathname (preferred) instead of cookie
  const pathname = usePathname() ?? "";
  // normalize: remove leading/trailing slashes and query strings
  const urlMain = pathname
    .replace(/\?.*$/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const selectedPermission = useSelector((state: RootState) =>
    selectPermissionByRsname(state, urlMain)
  );

  useEffect(() => {
    const baseTitle = "IT HUMAN RESOURCES";
    const permissionTitle = selectedPermission?.resourceName;
    const newTitle = permissionTitle ? `${permissionTitle}` : baseTitle;
    if (typeof document !== "undefined") {
      document.title = newTitle;
    }
  }, [selectedPermission?.resourceName]);

  return null;
};

export default TitleFromPermissions;
