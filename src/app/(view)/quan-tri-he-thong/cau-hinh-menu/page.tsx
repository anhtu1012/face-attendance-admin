/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ActionButtons from "@/components/action-button";
import AutoCompleteWithLabel from "@/components/basicUI/cAutoCompleteSelection";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { showError, showSuccess, showWarning } from "@/hooks/useNotification";
import CauHinhMenuServices from "@/services/admin/quan-tri-he-thong/cau-hinh-menu.service";
import SelectServices from "@/services/select/select.service";
import {
  calculateParentCheckboxes,
  convertToTreeData,
  flattenTreeData,
  toggleNodeExpansion,
  TreeNode,
  updateNodeCheckbox,
} from "@/utils/tree-data.utils";
import { CellStyle, ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Modal } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("CauHinhMenu");
  const gridRef = useRef<AgGridReact>({} as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [displayData, setDisplayData] = useState<TreeNode[]>([]);
  const [editedRows, setEditedRows] = useState<{ [key: string]: TreeNode }>({});
  const [rowSelected, setRowSelected] = useState<number>(0);
  const [selectedResourceName, setSelectedResourceName] = useState("");
  const [newRowsCount, setNewRowsCount] = useState<number>(1);
  const [parentNameOptions, setparentNameOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const handleFetchMenu = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: any = {};
        if (quickSearch && quickSearch.trim() !== "") {
          params.quickSearch = quickSearch;
        }
        const response = await CauHinhMenuServices.getCauHinhMenu(
          searchFilter,
          params
        );
        const responseParentMenu = await SelectServices.getSelectParentMenu();
        const data = responseParentMenu.data;
        setparentNameOptions(data);

        // Chuyển đổi thành tree data với config
        const treeConfig = {
          parentField: "parentName",
          idField: "id",
          scopesField: "scopes",
        };
        const convertedTreeData = convertToTreeData(response.data, treeConfig);
        setTreeData(convertedTreeData);

        // Flatten để hiển thị
        const flattenedData = flattenTreeData(convertedTreeData);
        setDisplayData(flattenedData);

        setTotalItems(response.count);
        setLoading(false);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
        setLoading(false);
      }
    },
    [currentPage, pageSize, mes]
  );

  useEffect(() => {
    handleFetchMenu(currentPage, pageSize);
  }, [currentPage, handleFetchMenu, pageSize]);

  //#region EXPAND/COLLAPSE
  // Hàm toggle expand/collapse node
  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const updatedTreeData = toggleNodeExpansion(treeData, nodeId);
      setTreeData(updatedTreeData);
      const flattenedData = flattenTreeData(updatedTreeData);
      setDisplayData(flattenedData);
    },
    [treeData]
  );

  // Custom cell renderer cho expand/collapse
  const ExpandCellRenderer = useCallback(
    (params: any) => {
      const node = params.data as TreeNode;

      // Chỉ hiển thị cho parent nodes, không quan tâm số lượng children
      if (!node.isParent) {
        return null;
      }

      // Nếu có children thì hiển thị expand/collapse icon, nếu không thì chỉ hiển thị tên
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div
          style={{
            cursor: hasChildren ? "pointer" : "default",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
          }}
          onClick={hasChildren ? () => handleNodeToggle(node.id) : undefined}
        >
          {hasChildren && (
            <span style={{ marginRight: "10px" }}>
              {node.expanded ? (
                <IoChevronUp
                  style={{
                    marginTop: "12px",
                    marginLeft: "10px",
                    transition: "transform 0.2s",
                  }}
                  size={20}
                />
              ) : (
                <IoChevronDown
                  style={{
                    marginTop: "12px",
                    marginLeft: "10px",
                    transition: "transform 0.2s",
                  }}
                  size={20}
                />
              )}
            </span>
          )}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: hasChildren ? "0px" : "30px", // Indent nếu không có children
            }}
          >
            {node.parentName}
          </span>
        </div>
      );
    },
    [handleNodeToggle]
  );
  //#endregion

  //#region CELL EDITING
  // Hàm xử lý khi cell được edit
  const onCellValueChanged = useCallback((params: any) => {
    const rowData = params.data as TreeNode;
    const field = params.colDef.field;
    const newValue = params.newValue;
    const oldValue = params.oldValue;

    // Chỉ track khi có thay đổi thực sự
    if (newValue !== oldValue) {
      setEditedRows((prev) => ({
        ...prev,
        [rowData.id]: {
          // Giữ lại tất cả thay đổi trước đó
          ...(prev[rowData.id] || rowData),
          // Chỉ update field được edit
          [field]: newValue,
        },
      }));
    }
  }, []);
  //#endregion

  // #region CELL RENDER
  // Custom cell renderer cho resource tùy theo column
  const ResourceRenderer = useCallback(
    (params: any) => {
      const node = params.data as TreeNode;
      if (node.isParent) return null;

      const field = params.colDef.field as keyof TreeNode;

      // Ưu tiên giá trị từ editedRows nếu có, nếu không thì dùng từ node
      const editedNode = editedRows[node.id];
      const value = editedNode
        ? (editedNode[field] as string)
        : (node[field] as string);

      return (
        <span style={{ marginLeft: `${((node.level || 0) + 1) * 10}px` }}>
          {value}
        </span>
      );
    },
    [editedRows]
  );
  //#endregion

  //#region CHECKBOX
  // Hàm update checkbox state
  const handleCheckboxChange = useCallback(
    (
      nodeId: string,
      field: "view" | "create" | "update" | "delete" | "all",
      checked: boolean
    ) => {
      const updatedTreeData = updateNodeCheckbox(
        treeData,
        nodeId,
        field,
        checked
      );
      setTreeData(updatedTreeData);

      const flattenedData = flattenTreeData(updatedTreeData);
      setDisplayData(flattenedData);

      // Cập nhật tất cả nodes bị thay đổi
      const updatedNode = flattenedData.find((node) => node.id === nodeId);
      if (updatedNode) {
        setEditedRows((prev) => ({
          ...prev,
          [nodeId]: {
            // Giữ lại tất cả changes đã có trước đó
            ...(prev[nodeId] || updatedNode),
            // Chỉ override checkbox states
            view: updatedNode.view,
            create: updatedNode.create,
            update: updatedNode.update,
            delete: updatedNode.delete,
            all: updatedNode.all,
          },
        }));
      }

      // Nếu là parent node và được click, cần track tất cả children bị affected
      if (updatedNode?.isParent && updatedNode.children) {
        updatedNode.children.forEach((child) => {
          const childInDisplay = flattenedData.find(
            (node) => node.id === child.id
          );
          if (childInDisplay) {
            setEditedRows((prev) => ({
              ...prev,
              [child.id]: {
                // Giữ lại tất cả changes đã có trước đó
                ...(prev[child.id] || childInDisplay),
                // Chỉ override checkbox states
                view: childInDisplay.view,
                create: childInDisplay.create,
                update: childInDisplay.update,
                delete: childInDisplay.delete,
                all: childInDisplay.all,
              },
            }));
          }
        });
      }
    },
    [treeData]
  );

  // Custom checkbox cho các cột permission
  const CheckboxRenderer = useCallback(
    (params: any) => {
      const node = params.data as TreeNode;
      const field = params.colDef.field as keyof TreeNode;

      // Ưu tiên giá trị từ editedRows nếu có, nếu không thì dùng từ node
      const editedNode = editedRows[node.id];
      const checked = editedNode
        ? (editedNode[field] as boolean)
        : (node[field] as boolean);

      // Hiển thị checkbox cho cả parent và child
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <input
            type="checkbox"
            checked={checked || false}
            onChange={(e) => {
              handleCheckboxChange(
                node.id,
                field as "view" | "create" | "update" | "delete" | "all",
                e.target.checked
              );
            }}
            style={{
              transform: "scale(1.2)",
              cursor: "pointer",
            }}
          />
        </div>
      );
    },
    [handleCheckboxChange, editedRows]
  );
  //#endregion

  const centerStyle: CellStyle = useMemo(
    () => ({ paddingLeft: 0, display: "flex", justifyContent: "center" }),
    []
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "parentName",
        headerName: t("parentName"),
        editable: false,
        width: 240,
        cellRenderer: ExpandCellRenderer,
        cellStyle: { paddingLeft: 0 },
      },
      {
        field: "resourceCode",
        headerName: t("resourceCode"),
        editable: true,
        width: 250,
        cellRenderer: ResourceRenderer,
        cellStyle: { paddingLeft: 0 },
      },
      {
        field: "resourceName",
        headerName: t("resourceName"),
        editable: true,
        width: 200,
        cellRenderer: ResourceRenderer,
        cellStyle: { paddingLeft: 0 },
      },
      {
        field: "all",
        headerName: t("all"),
        editable: false,
        width: 150,
        cellRenderer: CheckboxRenderer,
        cellStyle: centerStyle,
      },
      {
        field: "view",
        headerName: t("view"),
        editable: false,
        width: 150,
        cellRenderer: CheckboxRenderer,
        cellStyle: centerStyle,
      },
      {
        field: "create",
        headerName: t("create"),
        editable: false,
        width: 150,
        cellRenderer: CheckboxRenderer,
        cellStyle: centerStyle,
      },
      {
        field: "update",
        headerName: t("update"),
        editable: false,
        width: 150,
        cellRenderer: CheckboxRenderer,
        cellStyle: centerStyle,
      },
      {
        field: "delete",
        headerName: t("delete"),
        editable: false,
        width: 150,
        cellRenderer: CheckboxRenderer,
        cellStyle: centerStyle,
      },
    ],
    [t, ExpandCellRenderer, ResourceRenderer, CheckboxRenderer, centerStyle]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchMenu(page, size);
  };

  const onSelectionChanged = useCallback(() => {
    // Cập nhật số lượng dòng được chọn
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    setRowSelected(selectedNodes ? selectedNodes.length : 0);
  }, []);

  //#region CRUD
  // Hàm xử lý khi xóa
  const handleDeleteRow = useCallback(async () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      const selectedData = selectedNodes.map((node) => node.data);
      try {
        for (const data of selectedData) {
          if (data.id) {
            await CauHinhMenuServices.deleteCauHinhMenu(data.id, {
              status: "DELETED",
            });
          }
        }
        handleFetchMenu(currentPage, pageSize);
        showSuccess(mes("deleteSuccess"));
      } catch (error: any) {
        showError(error.response?.data?.message || mes("deleteError"));
      }
    } else {
      showWarning(mes("noRowsSelected"));
    }
  }, [currentPage, handleFetchMenu, mes, pageSize]);

  // Hàm xử lý khi lưu
  const addRow = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const onSave = useCallback(async () => {
    if (!editedRows || Object.keys(editedRows).length === 0) {
      showWarning(t("noChangesToSave"));
      return;
    }
    setLoading(true);

    try {
      const editedRowsArray = Object.values(editedRows);
      // Tạo payload theo format - chỉ lấy children nodes, không lấy parent
      const payload = editedRowsArray
        .filter((row) => !row.isParent) // Chỉ lấy children, không lấy parent
        .map((row) => {
          // Build scopes array từ checkbox states
          const scopes: string[] = [];
          if (row.view) scopes.push("view");
          if (row.create) scopes.push("create");
          if (row.update) scopes.push("update");
          if (row.delete) scopes.push("delete");

          const basePayload = {
            unitKey: `unit_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            resourceCode: row.resourceCode || "",
            resourceName: row.resourceName || "",
            parentName: row.parentName || "",
            scopes: scopes,
          };

          if (
            row.id &&
            !row.id.toString().startsWith("new_") &&
            !row.id.toString().startsWith("parent_")
          ) {
            return {
              ...basePayload,
              resourceId: row.id, // Sử dụng id từ response
            };
          } else {
            // Create payload không cần id
            return basePayload;
          }
        });

      // Validate payload
      if (payload.length === 0) {
        showWarning(t("noValidDataToSave"));
        return;
      }

      // Tách payload thành create và update
      const createPayload = payload.filter((item) => !("resourceId" in item));
      const updatePayload = payload.filter((item) => "resourceId" in item);

      let response;

      // Handle create requests
      if (createPayload.length > 0) {
        response = await CauHinhMenuServices.createCauHinhMenu({
          payload: createPayload,
        });
      }

      // Handle update requests
      if (updatePayload.length > 0) {
        response = await CauHinhMenuServices.updateCauHinhMenu({
          payload: updatePayload,
        });
      }

      if (response) {
        // Extract message từ response
        const message =
          Array.isArray(response) && response.length > 0
            ? response[0].message
            : response.message;

        // Show success với message từ server hoặc fallback
        showSuccess(message || mes("saveSuccess"));

        // Clear edited rows
        setEditedRows({});

        // Refresh data
        await handleFetchMenu(currentPage, pageSize);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || mes("saveError"));
    } finally {
      setLoading(false);
    }
  }, [editedRows, t, mes, currentPage, pageSize, handleFetchMenu]);

  const handleModalOk = useCallback(() => {
    if (newRowsCount <= 0) {
      showError(mes("createError"));
      return;
    }

    if (!selectedResourceName || selectedResourceName.trim() === "") {
      showError(t("pleaseSelectResource"));
      return;
    }

    try {
      setLoading(true);
      const timestamp = Date.now();

      // Tạo children mới với default view
      const newChildren = Array.from({ length: newRowsCount }, (_, i) => ({
        id: `new_child_${timestamp}_${i}`,
        unitKey: `${timestamp}_${i}`,
        parentName: selectedResourceName,
        resourceCode: "",
        resourceName: "",
        scopes: ["view"],
        all: false,
        view: true,
        create: false,
        update: false,
        delete: false,
        isParent: false,
        level: 1,
        expanded: false,
      }));

      setTreeData((prevTreeData) => {
        // Tìm parent node đã tồn tại
        const existingParentIndex = prevTreeData.findIndex(
          (node) => node.isParent && node.parentName === selectedResourceName
        );

        let updatedTreeData: TreeNode[];

        if (existingParentIndex !== -1) {
          // Parent đã tồn tại - thêm children vào parent hiện tại
          updatedTreeData = [...prevTreeData];
          const existingParent = updatedTreeData[existingParentIndex];
          const currentChildren = existingParent.children || [];
          const allChildren = [...currentChildren, ...newChildren];

          // Recalculate parent checkboxes dựa trên tất cả children
          const parentCheckboxes = calculateParentCheckboxes(allChildren);

          updatedTreeData[existingParentIndex] = {
            ...existingParent,
            children: allChildren,
            expanded: true,
            ...parentCheckboxes,
          };
        } else {
          // Parent chưa tồn tại - tạo parent mới
          const parentCheckboxes = calculateParentCheckboxes(newChildren);
          const newParentNode: TreeNode = {
            id: `parent_${timestamp}`,
            unitKey: `parent_${timestamp}`,
            parentName: selectedResourceName,
            resourceCode: "",
            resourceName: "",
            scopes: [],
            all: parentCheckboxes.all,
            view: parentCheckboxes.view,
            create: parentCheckboxes.create,
            update: parentCheckboxes.update,
            delete: parentCheckboxes.delete,
            isParent: true,
            level: 0,
            expanded: true,
            children: newChildren,
          };

          updatedTreeData = [...prevTreeData, newParentNode];
        }

        // Cập nhật displayData ngay trong cùng lần setState
        const flattenedData = flattenTreeData(updatedTreeData);
        setDisplayData(flattenedData);

        return updatedTreeData;
      });

      // Reset modal state
      setIsModalVisible(false);
      setNewRowsCount(1);
      setSelectedResourceName("");
      showSuccess(mes("rowsAdded", { count: newRowsCount }));
    } catch (error: any) {
      showError(error.response?.data?.message || mes("addError"));
    } finally {
      setLoading(false);
    }
  }, [newRowsCount, selectedResourceName, mes, t]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const buttonProps = {
    return: (
      <>
        <ActionButtons
          onAdd={addRow}
          onDelete={handleDeleteRow}
          onSave={onSave}
          rowSelected={rowSelected}
        />
      </>
    ),
  };

  return (
    <>
      <Modal
        title={mes("addNewRow")}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label
              style={{ marginBottom: 4, fontWeight: 500 }}
              htmlFor="newRowsCountt"
            >
              {t("addRowsPrompt")}
            </label>
            <input
              type="number"
              id="newRowsCountt"
              value={newRowsCount}
              onChange={(e: any) => setNewRowsCount(Number(e.target.value))}
              onBlur={(e) => {
                const value = Number(e.target.value);
                setNewRowsCount(value <= 0 || isNaN(value) ? 1 : value);
              }}
              style={{
                width: "100%",
                height: 36,
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <label style={{ marginBottom: 4, fontWeight: 500 }}>
              {t("parentResourceName")}
            </label>
            <AutoCompleteWithLabel
              style={{ width: "100%" }}
              label={t("parentResourceName")}
              options={parentNameOptions}
              onChange={(value) => {
                setSelectedResourceName(value);
              }}
            />
          </div>
        </div>
      </Modal>

      <LayoutContent
        layoutType={1}
        content1={
          <>
            <AgGridComponent
              showSearch={true}
              inputSearchProps={{
                id: "filter-text-box",
                idSearch: "filter-text-box",
              }}
              loading={loading}
              rowData={displayData}
              columnDefs={columnDefs}
              gridRef={gridRef}
              total={totalItems}
              pagination={true}
              maxRowsVisible={12}
              onChangePage={handlePageChange}
              onSelectionChanged={onSelectionChanged}
              onCellValueChanged={onCellValueChanged}
              columnFlex={0}
              showActionButtons={true}
              actionButtonsProps={{
                hideAdd: true,
                hideDelete: true,
                hideSave: true,
                buttonProps: buttonProps,
              }}
            />
          </>
        }
      />
    </>
  );
}

export default Page;
