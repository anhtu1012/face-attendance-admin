/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { checkPermissionByRsname } from "@/lib/store/slices/permissions";
import { getCookie } from "@/utils/client/getCookie";
import { Button, Modal, Popconfirm } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { TbCloudDownload } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthLogin } from "../../lib/store/slices/loginSlice";
import "./index.scss";

// Export the type so it can be imported by other components
export type ActionButtonsProps = {
  onAdd?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  hideAdd?: boolean;
  hideSave?: boolean;
  hideDelete?: boolean;
  hideDivider?: boolean;
  rowSelected?: string | number | undefined;
  style?: React.CSSProperties;
  // New props for modal functionality
  showAddRowsModal?: boolean;
  modalTitle?: string;
  modalInputLabel?: string;
  modalInitialCount?: number;
  onModalOk?: (count: number) => void;
  onModalCancel?: () => void;
  // Updated type to accept both ReactNode and objects with return property
  buttonProps?: React.ReactNode | { return: React.ReactNode } | any;
  saveButtonContent?: React.ReactNode; // add this line
};

const ActionButtons: React.FC<ActionButtonsProps> = React.memo(
  ({
    onAdd,
    onSave,
    onDelete,
    rowSelected,
    hideAdd = false,
    hideSave = false,
    hideDelete = false,
    hideDivider = false,
    style,
    // New props with default values
    showAddRowsModal = false,
    modalInitialCount = 1,
    onModalOk,
    onModalCancel,
    buttonProps, // Add buttonProps to destructuring
    saveButtonContent, // add this line
  }) => {
    const t = useTranslations("ActionButtons");
    const dispatch = useDispatch();
    const url = getCookie("_url");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [newRowsCount, setNewRowsCount] = useState<number>(modalInitialCount);

    const urlMain = url?.toString().replace(/^\/+/, "");
    // Get selectedPermission from Redux store
    const { selectedPermission } = useSelector(selectAuthLogin);
    useEffect(() => {
      if (urlMain) {
        // Dispatch the action to find the permission by rsname
        dispatch(checkPermissionByRsname(urlMain));
      }
    }, [dispatch, urlMain]);
    const normalizedScopes = selectedPermission?.scopes.map((scope) =>
      scope.toLowerCase()
    );

    const canAdd = normalizedScopes?.includes("create");
    const canSave = normalizedScopes?.includes("update");
    const canDelete = normalizedScopes?.includes("delete");
    // Handle add button click
    const handleAddClick = () => {
      if (showAddRowsModal) {
        setIsModalVisible(true);
      } else if (onAdd) {
        onAdd();
      }
    };

    // Handle modal ok button
    const handleModalOk = () => {
      if (onModalOk && !isNaN(newRowsCount)) {
        onModalOk(newRowsCount);
        setIsModalVisible(false);
      }
    };

    // Handle modal cancel button
    const handleModalCancel = () => {
      if (onModalCancel) {
        onModalCancel();
      }
      setIsModalVisible(false);
    };

    // Function to safely render buttonProps
    const renderButtonProps = () => {
      if (!buttonProps) {
        return null;
      }

      // If buttonProps has a return property, render that
      if (typeof buttonProps === "object" && buttonProps.return) {
        return buttonProps.return;
      }

      // Otherwise render buttonProps directly
      return buttonProps;
    };

    return (
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          marginBottom: "12px ",
          ...style,
        }}
      >
        <>
          {/* Custom Button Props */}
          {renderButtonProps()}

          {/* Button Add */}
          <Button
            className="btn-add"
            type="primary"
            onClick={handleAddClick}
            disabled={!canAdd}
            style={{
              padding: "18px",
              border: "1px solid #265b8e",
              borderRadius: "4px",
              fontWeight: "bold",
              backgroundColor: "white",
              color: "#265b8e",
              opacity: !canAdd ? 0.3 : 1,
              // display: hideAdd ? "none" : !hiddenAdd ? "none" : "",
              display: hideAdd ? "none" : "",
            }}
          >
            <IoAddCircleOutline size={20} /> {t("add")}
          </Button>
          {/* Button Save */}
          <Button
            className="btn-save"
            type="primary"
            onClick={onSave}
            disabled={!canSave}
            style={{
              padding: "18px",
              border: "1px solid #106754",
              borderRadius: "4px",
              backgroundColor: "white",
              color: "#106754",
              fontWeight: "bold",
              opacity: !canSave ? 0.3 : 1,
              // display: hideSave ? "none" : !hiddenSave ? "none" : "",
              display: hideSave ? "none" : "",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {saveButtonContent ?? (
                <>
                  <TbCloudDownload size={20} /> {t("save")}
                </>
              )}
            </span>
          </Button>

          <div
            className="vertical-divider"
            style={{
              display: hideDivider ? "none" : "inline-block",
            }}
          ></div>

          {/* Button Delete */}
          <Popconfirm
            title={`${t("confirmDelete")} ${rowSelected} ${t("item")}`}
            onConfirm={onDelete}
            okText={t("Yes")}
            cancelText={t("No")}
            placement="bottom"
          >
            <Button
              className="btn-delete"
              danger
              disabled={!canDelete}
              style={{
                padding: "18px",
                border: "1px solid #b22222",
                backgroundColor: "white",
                borderRadius: "4px",
                color: "#b22222",
                fontWeight: "bold",
                opacity: !canDelete ? 0.3 : 1,
                // display: hideDelete ? "none" : !hiddenDelete ? "none" : "",
                display: hideDelete ? "none" : "",
              }}
            >
              <GoTrash size={19} /> {t("delete")}
            </Button>
          </Popconfirm>

          {/* Modal for adding rows */}
          <Modal
            title={t("rowadd")}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText={t("ok")}
            cancelText={t("cancel")}
          >
            <label htmlFor="newRowsCount">{t("rownumber")}</label>
            <input
              type="number"
              id="newRowsCount"
              min={1}
              max={1000}
              value={isNaN(newRowsCount) ? "" : newRowsCount}
              onChange={(e) => {
                const rawValue = e.target.value;
                const parsed = Number(rawValue);

                if (rawValue === "") {
                  setNewRowsCount(NaN);
                } else if (!isNaN(parsed) && parsed >= 1 && parsed <= 1000) {
                  setNewRowsCount(parsed);
                }
              }}
              onBlur={(e) => {
                const parsed = Number(e.target.value);
                if (parsed < 1 || parsed > 1000 || isNaN(parsed)) {
                  setNewRowsCount(1);
                }
              }}
              style={{
                marginLeft: "5px",
                border: "1px solid #ccc",
                padding: "4px",
                borderRadius: "4px",
              }}
            />
          </Modal>
        </>
      </div>
    );
  }
);

export default ActionButtons;
