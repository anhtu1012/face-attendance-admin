import React from "react";
import { Popconfirm } from "antd";
import styles from "./SelectionInfoBar.module.scss";

export interface SelectionActionButton {
  title: string; // Tooltip title
  label: string; // Button text
  onClick: () => void | Promise<void>;
  danger?: boolean; // If true, button has danger style
  confirmMessage?: string; // If provided, show Popconfirm with this message
}

interface SelectionInfoBarProps {
  selectedCount: number;
  loading?: boolean;
  isSelectingAll?: boolean;
  onClearSelection: () => void;
  // Flexible action buttons (max 2 buttons recommended)
  actionButtons?: SelectionActionButton[];
}

/**
 * Component to display selection information and actions
 */
export const SelectionInfoBar: React.FC<SelectionInfoBarProps> = ({
  selectedCount,
  loading,
  isSelectingAll,
  actionButtons,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.left}>
        <div className={styles.icon} aria-hidden>
          ✓
        </div>
        <div className={styles.text}>
          <div className={styles.title}>Đã chọn:</div>
          <strong>{selectedCount}</strong>
          <span className={styles.suffix}> dòng</span>
        </div>
      </div>

      <div className={styles.buttons}>
        {actionButtons?.map((button, index) => {
          // If the button requires confirmation, don't attach the onClick to the
          // inner element; Popconfirm's onConfirm should call the handler. This
          // prevents the handler from running immediately when the button is
          // clicked and ensures it runs only after confirming.
          const requiresConfirm = !!button.confirmMessage;
          const onClickHandler = requiresConfirm ? undefined : button.onClick;

          const buttonElement = (
            <button
              key={index}
              type="button"
              className={`${styles.btn} ${button.danger ? styles.danger : ""}`}
              onClick={onClickHandler}
              disabled={!!(loading || isSelectingAll)}
              aria-disabled={!!(loading || isSelectingAll)}
              title={button.title}
            >
              {button.label}
            </button>
          );

          // If confirmMessage is provided, wrap with Popconfirm
          if (button.confirmMessage) {
            return (
              <Popconfirm
                key={index}
                title={button.confirmMessage}
                onConfirm={button.onClick}
                okText="Xác nhận"
                cancelText="Hủy"
                disabled={!!(loading || isSelectingAll)}
              >
                {buttonElement}
              </Popconfirm>
            );
          }

          return buttonElement;
        })}

        <button
          style={{ display: "none" }}
          className={`${styles.btn} ${styles.ghost}`}
          onClick={onClearSelection}
          disabled={!!(loading || isSelectingAll)}
          aria-disabled={!!(loading || isSelectingAll)}
        >
          ✕ Bỏ chọn tất cả
        </button>
      </div>
    </div>
  );
};
