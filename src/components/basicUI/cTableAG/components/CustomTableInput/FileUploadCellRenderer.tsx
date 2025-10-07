/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Upload, Button, message, Tooltip } from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import type { ICellRendererParams } from "@ag-grid-community/core";

const FileUploadCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const field = params?.colDef?.field as string;
  const initial = params.value as string | undefined;
  const [fileName, setFileName] = useState<string>(initial || "");

  useEffect(() => {
    setFileName(String(params.value ?? ""));
  }, [params.value]);

  const beforeUpload = (file: File) => {
    // For now we don't actually upload to server here. Quickly set the value to filename
    const name = file.name;
    setFileName(name);
    try {
      // Preferred API to update a single cell value
      if (
        params.node &&
        typeof (params.node as any).setDataValue === "function"
      ) {
        // @ts-ignore
        params.node.setDataValue(field, name);
      } else if (
        params.api &&
        typeof params.api.applyTransaction === "function"
      ) {
        // Fallback: update entire row data via transaction
        const newData = { ...(params.data || {}), [field]: name };
        params.api.applyTransaction({ update: [newData] });
      }
    } catch (err) {
      console.error("Error updating file cell value", err);
    }
    message.success("Chọn tệp: " + name);
    // Prevent automatic upload
    return false;
  };

  const getExt = (name: string) => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
  };

  const iconByExt = (ext: string) => {
    // Return icons styled with colors matching common file type branding
    switch (ext) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#E53935" }} />; // red
      case "doc":
      case "docx":
        return <FileWordOutlined style={{ color: "#2B7AE4" }} />; // blue
      case "xls":
      case "xlsx":
        return <FileExcelOutlined style={{ color: "#2E7D32" }} />; // green
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <FileImageOutlined style={{ color: "#009688" }} />; // teal
      case "txt":
      case "csv":
        return <FileTextOutlined style={{ color: "#616161" }} />; // grey
      default:
        return <PaperClipOutlined style={{ color: "#616161" }} />; // grey
    }
  };

  const hasValue = Boolean(fileName && fileName.trim());

  // If the stored value is a URL, use it as href; otherwise render plain text
  const isUrl = (val: string) => /^(https?:)?\/\//.test(val);

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8 }}
      // Stop propagation at the renderer level so clicks don't trigger row selection
      onClick={(e) => e.stopPropagation()}
    >
      {hasValue ? (
        <>
          {/* Icon to replace file (opens file picker) */}
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Button type="text" size="small" icon={iconByExt(getExt(fileName))} />
          </Upload>
          <Tooltip title={fileName}>
            {isUrl(fileName) ? (
              <a
                href={fileName}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: "#1890ff", marginLeft: 6 }}
                onClick={(e) => e.stopPropagation()}
              >
                {fileName}
              </a>
            ) : (
              <span style={{ fontSize: 12, color: "#333", marginLeft: 6 }}>
                {fileName}
              </span>
            )}
          </Tooltip>
        </>
      ) : (
        <>
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Button icon={<UploadOutlined style={{ color: "#1890ff" }} />} size="small">
              Tải lên
            </Button>
          </Upload>
          <div style={{ fontSize: 12, color: "#333", marginLeft: 6 }}>
            {fileName}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadCellRenderer;
