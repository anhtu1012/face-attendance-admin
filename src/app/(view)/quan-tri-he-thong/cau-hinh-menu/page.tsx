/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ActionButtons from "@/components/action-button";
import AutoCompleteWithLabel from "@/components/basicUI/cAutoCompleteSelection";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { showError, showWarning } from "@/hook/useNotification";
import CauHinhMenuServices from "@/services/admin/quan-tri-he-thong/cau-hinh-menu.service";
import SelectServices from "@/services/select/select.service";
import {
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
  const notiMessage = useTranslations("message");
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
        showError(error.response?.data?.message || notiMessage("fetchError"));
        setLoading(false);
      }
    },
    [currentPage, pageSize, notiMessage]
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

      if (!node.isParent || !node.children || node.children.length === 0) {
        return null;
      }

      return (
        <div
          style={{
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => handleNodeToggle(node.id)}
        >
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
          <span style={{ fontWeight: "bold" }}>{node.parentName}</span>
        </div>
      );
    },
    [handleNodeToggle]
  );
  //#endregion

  // #region CELL RENDER
  // Custom cell renderer cho resource tùy theo column
  const ResourceRenderer = useCallback((params: any) => {
    const node = params.data as TreeNode;
    if (node.isParent) return null;

    const field = params.colDef.field as keyof TreeNode;
    const value = node[field] as string;

    return (
      <span style={{ marginLeft: `${((node.level || 0) + 1) * 10}px` }}>
        {value}
      </span>
    );
  }, []);
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
    },
    [treeData]
  );

  // Custom checkbox cho các cột permission
  const CheckboxRenderer = useCallback(
    (params: any) => {
      const node = params.data as TreeNode;
      const field = params.colDef.field as keyof TreeNode;
      const checked = node[field] as boolean;

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
    [handleCheckboxChange]
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
        width: 250,
        cellRenderer: ExpandCellRenderer,
        cellStyle: { paddingLeft: 0 },
      },
      {
        field: "resourceCode",
        headerName: t("resourceCode"),
        editable: true,
        width: 230,
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
      } catch (error: any) {
        showError(error.response?.data?.message || notiMessage("deleteError"));
      }
    } else {
      showWarning(notiMessage("noRowsSelected"));
    }
  }, [notiMessage]);

  // Hàm xử lý khi lưu
  const addRow = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  // const onSave = useCallback(async () => {
  //   if (editedRows.length === 0) {
  //     showWarning(t("noChangesToSave"));
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const newRows = editedRows.filter(
  //       (row) => !row.id && row.unitKey && row.type === "child"
  //     );
  //     const updatedRows = editedRows.filter(
  //       (row) => row.id && row.type === "child"
  //     );

  //     const updatedParents = editedRows.filter(
  //       (row) => row.id && row.type === "parent"
  //     );

  //     const allRowsValidate = [...newRows, ...updatedRows, ...updatedParents];
  //     const invalidRows = allRowsValidate.filter(
  //       (row) => !validateRowData(row)
  //     );

  //     if (invalidRows.length > 0) {
  //       setGridData((prevData) =>
  //         prevData.map((row) =>
  //           invalidRows.some(
  //             (invalidRow) =>
  //               (invalidRow.id || invalidRow.unitKey) ===
  //               (row.id || row.unitKey)
  //           )
  //             ? { ...row, isError: true }
  //             : { ...row, isError: false }
  //         )
  //       );
  //       showError(mes("errorUpdate"));
  //       setLoading(false);
  //       return;
  //     }

  //     // New child rows
  //     if (newRows.length > 0) {
  //       const newPayload = newRows.map((row) => ({
  //         name: row.screenName,
  //         displayName: row.function,
  //         attributes: {
  //           parent: [row.parent || "Default Parent"],
  //         },
  //         scopes: [
  //           ...(row.view ? [{ name: "view" }] : []),
  //           ...(row.create ? [{ name: "create" }] : []),
  //           ...(row.update ? [{ name: "update" }] : []),
  //           ...(row.delete ? [{ name: "delete" }] : []),
  //         ],
  //       }));
  //       await addMenu(newPayload);
  //       showSuccess(mes("success.rowsAdded", { count: newRows.length }));
  //     }

  //     // Updated child rows
  //     if (updatedRows.length > 0) {
  //       const updatePayload = updatedRows.map((row) => {
  //         const changedData =
  //           changedValues.find((cv) => cv.id === row.id)?.data || {};
  //         return {
  //           resourceId: row.id!,
  //           name: changedData.screenName ?? row.screenName,
  //           displayName: changedData.function ?? row.function,
  //           attributes: {
  //             parent: [row.parent || "Default Parent"],
  //           },
  //           scopes: [
  //             ...(changedData.view ?? row.view
  //               ? [{ id: scopeMappings.view, name: "view" }]
  //               : []),
  //             ...(changedData.create ?? row.create
  //               ? [{ id: scopeMappings.create, name: "create" }]
  //               : []),
  //             ...(changedData.update ?? row.update
  //               ? [{ id: scopeMappings.update, name: "update" }]
  //               : []),
  //             ...(changedData.delete ?? row.delete
  //               ? [{ id: scopeMappings.delete, name: "delete" }]
  //               : []),
  //           ],
  //         };
  //       });
  //       await updateMenu(updatePayload);
  //       showSuccess(t("successUpdate"));
  //     }

  //     // Updated parent rows
  //     if (updatedParents.length > 0) {
  //       const parentPayload = updatedParents.map((row) => ({
  //         resourceId: row.id!,
  //         name:
  //           changedValues.find((cv) => cv.id === row.id)?.data.menu || row.menu,
  //         displayName: row.menu,
  //         attributes: {
  //           parent: [],
  //         },
  //         scopes: [
  //           ...(row.view ? [{ id: scopeMappings.view, name: "view" }] : []),
  //           ...(row.create
  //             ? [{ id: scopeMappings.create, name: "create" }]
  //             : []),
  //           ...(row.update
  //             ? [{ id: scopeMappings.update, name: "update" }]
  //             : []),
  //           ...(row.delete
  //             ? [{ id: scopeMappings.delete, name: "delete" }]
  //             : []),
  //         ],
  //       }));

  //       await updateMenu(parentPayload);
  //       // showSuccess(t("parentsUpdated", { count: updatedParents.length }));
  //     }

  //     setEditedRows([]);
  //     setChangedValues([]);
  //     await fetchData();
  //   } catch (error: any) {
  //     showError(t("updateFailed"));
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [editedRows, changedValues, t, fetchData, mes, scopeMappings]);

  // const handleModalOk = useCallback(() => {
  //   if (newRowsCount <= 0) {
  //     showError(notiMessage("errorUpdate"));
  //     setLoading(false);
  //     return;
  //   }

  //   const timestamp = Date.now();
  //   const newRows = Array.from({ length: newRowsCount }, (_, i) => ({
  //     unitKey: `${timestamp}_${i}`,
  //     menu: "",
  //     screenName: "",
  //     function: "",
  //     all: true,
  //     view: true,
  //     create: true,
  //     update: true,
  //     delete: true,
  //     type: "child",
  //     isExpanded: false,
  //     parent: selectedResourceName,
  //   }));
  //   setEditedRows((prev) => [...newRows, ...prev]);

  //   setGridData((prev) => {
  //     const filteredPrev = prev.filter(
  //       (item) => item.type !== "child" || item.parent !== selectedResourceName
  //     );
  //     const updatedData = [...filteredPrev];
  //     const parentIndex = updatedData.findIndex(
  //       (item) => item.menu === selectedResourceName && item.type === "parent"
  //     );

  //     if (parentIndex === -1) {
  //       updatedData.push({
  //         type: "parent",
  //         menu: selectedResourceName,
  //         screenName: "",
  //         function: "",
  //         all: false,
  //         view: false,
  //         create: false,
  //         update: false,
  //         delete: false,
  //         isExpanded: true,
  //         children: newRows,
  //       });
  //     } else {
  //       const parent = updatedData[parentIndex];
  //       updatedData[parentIndex] = {
  //         ...parent,
  //         children: [...(parent.children || []), ...newRows],
  //         isExpanded: true,
  //       };
  //     }

  //     const result: typeof updatedData = [];
  //     const existingChildKeys = new Set(
  //       updatedData
  //         .filter((item) => item.type === "child")
  //         .map((child) => child.unitKey)
  //     );
  //     for (const item of updatedData) {
  //       result.push(item);
  //       if (item.isExpanded && item.children?.length) {
  //         for (const child of item.children) {
  //           if (!existingChildKeys.has(child.unitKey)) {
  //             result.push({
  //               ...child,
  //               type: "child",
  //               isExpanded: child.isExpanded ?? false,
  //               resourceId: child.id,
  //             });
  //           }
  //         }
  //       }
  //     }

  //     return result;
  //   });

  //   setIsModalVisible(false);
  //   showSuccess(notiMessage("rowsAdded", { count: newRowsCount }));
  // }, [newRowsCount, selectedResourceName, notiMessage]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <>
      <Modal
        title={notiMessage("addNewRow")}
        visible={isModalVisible}
        // onOk={handleModalOk}
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
            <ActionButtons
              onAdd={addRow}
              onDelete={handleDeleteRow}
              // onSave={onSave}
              rowSelected={rowSelected}
            />
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
              maxRowsVisible={5}
              onChangePage={handlePageChange}
              onSelectionChanged={onSelectionChanged}
              columnFlex={0}
              showActionButtons={false}
            />
          </>
        }
      />
    </>
  );
}

export default Page;
