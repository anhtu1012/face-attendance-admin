/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  CloseOutlined,
  ColumnWidthOutlined,
  EditOutlined,
  EyeOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import {
  Button,
  FloatButton,
  Modal,
  Segmented,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import "./FullscreenMarkdownEditor.scss";

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
  const [previewMode, setPreviewMode] = useState<string>("edit");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { Text, Title } = Typography;

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

  // Quick formatting functions
  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector(
      ".fullscreen-markdown-modal .w-md-editor-text"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const newText =
        textarea.value.substring(0, start) +
        before +
        selectedText +
        after +
        textarea.value.substring(end);

      setFullscreenContent(newText);
      saveToUndoStack(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 10);
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
                    Chưa lưu
                  </Text>
                )}
              </div>
            </div>
          </div>

          <div className="header-center">
            <Segmented
              value={previewMode}
              onChange={setPreviewMode}
              options={[
                {
                  label: "Chỉnh sửa",
                  value: "edit",
                  icon: <EditOutlined />,
                },
                {
                  label: "Xem trước",
                  value: "preview",
                  icon: <EyeOutlined />,
                },
                {
                  label: "Chia đôi",
                  value: "live",
                  icon: <ColumnWidthOutlined />,
                },
              ]}
            />
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

        {/* Enhanced Markdown Editor */}
        <div className="fullscreen-editor-content">
          <MDEditor
            value={fullscreenContent}
            onChange={(value) => {
              setFullscreenContent(value || "");
              saveToUndoStack(value || "");
            }}
            data-color-mode="light"
            preview={previewMode as any}
            hideToolbar={false}
            visibleDragbar={false}
            height="calc(100vh - 160px)"
            textareaProps={{
              placeholder:
                "✨ Bắt đầu viết nội dung hợp đồng của bạn...\n\n💡 Sử dụng các nút định dạng nhanh ở trên hoặc:\n• # Tiêu đề chính\n• ## Tiêu đề phụ\n• **In đậm**\n• *In nghiêng*\n• - Danh sách\n• > Trích dẫn\n\n🚀 Nhấn Ctrl+S để lưu nhanh!",
              style: {
                fontSize: 16,
                lineHeight: 1.8,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              },
              onKeyDown: (e) => {
                // Keyboard shortcuts
                if (e.ctrlKey || e.metaKey) {
                  switch (e.key) {
                    case "s":
                      e.preventDefault();
                      handleSave();
                      break;
                    case "z":
                      e.preventDefault();
                      handleUndo();
                      break;
                    case "y":
                      e.preventDefault();
                      handleRedo();
                      break;
                    case "b":
                      e.preventDefault();
                      insertMarkdown("**", "**");
                      break;
                    case "i":
                      e.preventDefault();
                      insertMarkdown("*", "*");
                      break;
                  }
                }
              },
            }}
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
