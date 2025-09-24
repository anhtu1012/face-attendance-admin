"use client";

import React from "react";
import { SparklesIcon } from "./IconComponents";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerateWithAi: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onGenerateWithAi,
}) => {
  return (
    <div className="markdown-editor">
      <div className="editor-header">
        <label htmlFor="markdown-editor">Contract Terms (Markdown)</label>
        <button
          onClick={onGenerateWithAi}
          className="btn btn-secondary ai-generate-btn"
          title="Generate with AI"
        >
          <SparklesIcon />
          AI Generate
        </button>
      </div>
      <textarea
        id="markdown-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter contract terms here..."
      />
    </div>
  );
};
