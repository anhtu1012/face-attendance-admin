"use client";

import React from "react";
import { CloseIcon, SparklesIcon } from "./IconComponents";

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const AiModal: React.FC<AiModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  prompt,
  setPrompt,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Generate Contract Terms with AI</h2>
        <button onClick={onClose} className="close-btn" aria-label="Close">
          <CloseIcon />
        </button>
        <div className="ai-modal-form">
          <label htmlFor="ai-prompt">
            Describe the contract you want to generate:
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A 3-month apprenticeship contract for a junior web developer, including clauses about working hours, stipend, and intellectual property."
            disabled={isLoading}
          />
        </div>
        <div className="ai-modal-actions">
          <button
            onClick={onClose}
            className="btn btn-slate"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            className="btn btn-primary"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <svg
                  style={{
                    animation: "spin 1s linear infinite",
                    marginLeft: "-0.25rem",
                    marginRight: "0.75rem",
                    height: "1.25rem",
                    width: "1.25rem",
                    color: "white",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
