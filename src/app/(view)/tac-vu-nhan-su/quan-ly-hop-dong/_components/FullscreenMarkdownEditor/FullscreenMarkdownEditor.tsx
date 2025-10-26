"use client";
import {
  CloseOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Button, FloatButton, Modal, Space, Tooltip, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import "./FullscreenMarkdownEditor.scss";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FullscreenMarkdownEditorProps {
  open: boolean;
  content: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

const FullscreenMarkdownEditor: React.FC<FullscreenMarkdownEditorProps> = ({
  open,
  content,
  onSave,
  onClose,
}) => {
  const [fullscreenContent, setFullscreenContent] = useState<string>("");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { Text, Title } = Typography;

  // Quill modules configuration
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    if (open) {
      setFullscreenContent(content || "");
      setUndoStack([content || ""]);
      setRedoStack([]);
      setHasUnsavedChanges(false);
    }
  }, [open, content]);

  // Save to undo stack
  const saveToUndoStack = (newContent: string) => {
    if (undoStack[undoStack.length - 1] !== newContent) {
      setUndoStack([...undoStack, newContent]);
      setRedoStack([]);
      setHasUnsavedChanges(newContent !== content);
    }
  };

  // Undo functionality
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const current = undoStack[undoStack.length - 1];
      const previous = undoStack[undoStack.length - 2];

      setRedoStack([...redoStack, current]);
      setUndoStack(undoStack.slice(0, -1));
      setFullscreenContent(previous);
      setHasUnsavedChanges(previous !== content);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];

      setUndoStack([...undoStack, next]);
      setRedoStack(redoStack.slice(0, -1));
      setFullscreenContent(next);
      setHasUnsavedChanges(next !== content);
    }
  };

  const handleSave = () => {
    onSave(fullscreenContent);
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: "🚨 Bạn có thay đổi chưa lưu!",
        content: "Bạn có muốn lưu thay đổi trước khi thoát không?",
        okText: "💾 Lưu và thoát",
        cancelText: "🗑️ Bỏ qua thay đổi",
        onOk: () => {
          handleSave();
          onClose();
        },
        onCancel: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={handleClose}
      footer={null}
      width="100vw"
      style={{ top: 0, paddingBottom: 0 }}
      styles={{
        body: { padding: 0, height: "100vh" },
        content: { height: "100vh" },
      }}
      className="fullscreen-modal fullscreen-markdown-modal"
      destroyOnClose
      maskClosable={false}
    >
      <div className="fullscreen-editor-container">
        {/* Enhanced Header */}
        <div className="fullscreen-header">
          <div className="header-left">
            <div className="title-section">
              <Title level={4} style={{ margin: 0, color: "#fff" }}>
                Chỉnh sửa nội dung hợp đồng
              </Title>
              <div className="stats-section">
                <Text
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
                >
                  {fullscreenContent?.length || 0} ký tự
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "12px",
                    marginLeft: 8,
                  }}
                >
                  {fullscreenContent?.split("\n").length || 0} dòng
                </Text>
                {hasUnsavedChanges && (
                  <Text
                    style={{
                      color: "#fff3cd",
                      fontSize: "12px",
                      marginLeft: 8,
                    }}
                  >
                    ● Chưa lưu
                  </Text>
                )}
              </div>
            </div>
          </div>

          <div className="header-right">
            <Space>
              <Tooltip title="Hoàn tác (Ctrl+Z)">
                <Button
                  icon={<UndoOutlined />}
                  disabled={undoStack.length <= 1}
                  onClick={handleUndo}
                  className="header-btn"
                />
              </Tooltip>
              <Tooltip title="Làm lại (Ctrl+Y)">
                <Button
                  icon={<RedoOutlined />}
                  disabled={redoStack.length === 0}
                  onClick={handleRedo}
                  className="header-btn"
                />
              </Tooltip>
              <Tooltip title="Lưu thay đổi (Ctrl+S)">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  className={`header-btn save-btn ${
                    hasUnsavedChanges ? "has-changes" : ""
                  }`}
                >
                  Lưu thay đổi
                </Button>
              </Tooltip>
              <Tooltip title="Thoát fullscreen">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleClose}
                  className="header-btn close-btn"
                  danger
                />
              </Tooltip>
            </Space>
          </div>
        </div>

        {/* Enhanced Rich Text Editor */}
        <div className="fullscreen-editor-content">
          <ReactQuill
            theme="snow"
            value={fullscreenContent}
            onChange={(value) => {
              setFullscreenContent(value || "");
              saveToUndoStack(value || "");
            }}
            modules={quillModules}
            formats={quillFormats}
            placeholder="✨ Bắt đầu viết nội dung hợp đồng của bạn..."
            style={{ height: "calc(100vh - 160px)" }}
          />
        </div>

        {/* Floating Action Buttons */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24, bottom: 24 }}
          icon={<SaveOutlined />}
          className="fab-group"
        >
          <FloatButton
            icon={<SaveOutlined />}
            tooltip="Lưu thay đổi (Ctrl+S)"
            onClick={handleSave}
            className={hasUnsavedChanges ? "fab-urgent" : ""}
          />
          <FloatButton
            icon={<UndoOutlined />}
            tooltip="Hoàn tác (Ctrl+Z)"
            onClick={handleUndo}
          />
          <FloatButton
            icon={<RedoOutlined />}
            tooltip="Làm lại (Ctrl+Y)"
            onClick={handleRedo}
          />
        </FloatButton.Group>

        {/* Progress indicator */}
        <div className="progress-indicator">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(
                ((fullscreenContent?.length || 0) / 1000) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FullscreenMarkdownEditor;
