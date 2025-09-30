/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import ReactQuill to avoid SSR issues
const ReactQuillNoSSR = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="quill-loading">Loading editor...</div>,
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  style?: React.CSSProperties;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  modules,
  formats,
  style,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default modules configuration
  const defaultModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  // Default formats configuration (without "bullet")
  const defaultFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "link",
  ];

  if (!isMounted) {
    return <div className="quill-loading">Loading editor...</div>;
  }

  return (
    <ReactQuillNoSSR
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules || defaultModules}
      formats={formats || defaultFormats}
      style={style}
    />
  );
};

export default QuillEditor;
