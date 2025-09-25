/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { showError, showSuccess, showWarning } from "@/hooks/useNotification";
import PhanQuyenServices from "@/services/admin/quan-tri-he-thong/phan-quyen.service";
import {
  convertToTreeData,
  flattenTreeData,
  toggleNodeExpansion,
  TreeNode,
  updateNodeCheckbox,
} from "@/utils/tree-data.utils";
import { CellStyle, ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import FormSubmit from "./components/FormSubmit";
import UserAccount from "./components/UserAccount";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("PhanQuyen");
  const gridRef = useRef<AgGridReact>({} as any);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(1000);
  const [rowSelected, setRowSelected] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editedRows, setEditedRows] = useState<{ [key: string]: TreeNode }>({});
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [displayData, setDisplayData] = useState<TreeNode[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [shouldFetchUserAccount, setShouldFetchUserAccount] =
    useState<boolean>(false);
  const [allPermissionsSelected, setAllPermissionsSelected] =
    useState<boolean>(false);

  // Check toàn bộ permissions đã được chọn hay chưa
  const checkAllPermissionsSelected = useCallback(() => {
    if (!treeData || treeData.length === 0) {
      return false;
    }

    // Hàm đệ quy để lấy tất cả các node con
    const getAllChildNodes = (nodes: TreeNode[]): TreeNode[] => {
      const allChildren: TreeNode[] = [];

      nodes.forEach((node) => {
        if (!node.isParent) {
          // Nếu là child, thêm vào danh sách
          allChildren.push(node);
        }

        // Nếu node này có children, đệ quy lấy tất cả children của nó
        if (node.children && node.children.length > 0) {
          allChildren.push(...getAllChildNodes(node.children));
        }
      });

      return allChildren;
    };

    const allChildren = getAllChildNodes(treeData);
    if (allChildren.length === 0) {
      return false;
    }

    // Kiểm tra nếu tất cả các child node đều có đủ scope thì trả về true
    return allChildren.every(
      (node) => node.view && node.create && node.update && node.delete
    );
  }, [treeData]);

  useEffect(() => {
    const isAllSelected = checkAllPermissionsSelected();
    setAllPermissionsSelected(isAllSelected);
  }, [treeData, checkAllPermissionsSelected]);

  const handleFetchPermission = useCallback(
    async (
      page = currentPage,
      limit = pageSize,
      roleId: string,
      quickSearch?: string
    ) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: any = {
          roleId,
        };
        if (quickSearch && quickSearch.trim() !== "") {
          params.quickSearch = quickSearch;
        }
        const response = await PhanQuyenServices.getPhanQuyen(
          searchFilter,
          params
        );

        // Chuyển đổi thành tree data với config
        const treeConfig = {
          parentField: "parentName",
          idField: "id",
          scopesField: "menuScopes",
        };
        const convertedTreeData = convertToTreeData(response, treeConfig);
        setTreeData(convertedTreeData);

        // Flatten để hiển thị
        const flattenedData = flattenTreeData(convertedTreeData);
        setDisplayData(flattenedData);

        setTotalItems(response.length);
        setLoading(false);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
        setLoading(false);
      }
    },
    [currentPage, pageSize, mes]
  );

  const handleRoleChange = useCallback(
    (roleId: string) => {
      setSelectedRoleId(roleId);
      // Reset về trang đầu khi thay đổi role
      setCurrentPage(1);
      // Trigger fetch cho cả UserAccount và Permission
      setShouldFetchUserAccount(true);
      if (roleId === "") {
        setDisplayData([]);
        return;
      }
      handleFetchPermission(1, pageSize, roleId);

      // Reset shouldFetchUserAccount sau một khoảng thời gian ngắn
      setTimeout(() => setShouldFetchUserAccount(false), 100);
    },
    [handleFetchPermission, pageSize]
  );

  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const updatedTreeData = toggleNodeExpansion(treeData, nodeId);
      setTreeData(updatedTreeData);

      const flattenedData = flattenTreeData(updatedTreeData);
      setDisplayData(flattenedData);
    },
    [treeData]
  );

  const onSelectionChanged = useCallback(() => {
    // Cập nhật số lượng dòng được chọn
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    setRowSelected(selectedNodes ? selectedNodes.length : 0);
  }, []);

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
      const updatedNode = flattenedData.find((node) => node.id === nodeId);

      if (updatedNode) {
        setEditedRows((prev) => {
          const newEditedRows = {
            ...prev,
            [nodeId]: {
              // Lấy data từ node hiện tại, không phải từ editedRows cũ
              ...updatedNode,
              // Override với checkbox states mới
              view: updatedNode.view,
              create: updatedNode.create,
              update: updatedNode.update,
              delete: updatedNode.delete,
              all: updatedNode.all,
            },
          };
          return newEditedRows;
        });
      }

      // CHỈ cập nhật children nếu click vào parent
      if (updatedNode?.isParent && updatedNode.children) {
        updatedNode.children.forEach((child) => {
          const childInDisplay = flattenedData.find(
            (node) => node.id === child.id
          );

          if (childInDisplay) {
            setEditedRows((prev) => ({
              ...prev,
              [child.id]: {
                // Lấy data từ child hiện tại, không phải từ editedRows cũ
                ...childInDisplay,
                // Override với checkbox states mới
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

  const handleAllPermission = useCallback(() => {
    if (!treeData || treeData.length === 0) {
      showWarning(t("noDataToTogglePermissions"));
      return;
    }

    // Nếu tất cả đều được chọn, bỏ chọn tất cả (newState = false)
    // Nếu không phải tất cả đều được chọn, chọn tất cả (newState = true)
    const newState = !allPermissionsSelected;

    const updateAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        const updatedNode = {
          ...node,
          view: newState,
          create: newState,
          update: newState,
          delete: newState,
          all: newState,
        };

        if (node.children && node.children.length > 0) {
          updatedNode.children = updateAllNodes(node.children);
        }

        return updatedNode;
      });
    };

    const updatedTreeData = updateAllNodes(treeData);
    setTreeData(updatedTreeData);
    const flattenedData = flattenTreeData(updatedTreeData);
    setDisplayData(flattenedData);

    const newEditedRows: { [key: string]: TreeNode } = {};
    flattenedData.forEach((node) => {
      newEditedRows[node.id] = {
        ...node,
        view: newState,
        create: newState,
        update: newState,
        delete: newState,
        all: newState,
      };
    });

    setEditedRows(newEditedRows);

    if (newState) {
      showSuccess(t("allPermissionsSelected"));
    } else {
      showSuccess(t("allPermissionsDeselected"));
    }
  }, [treeData, allPermissionsSelected]);

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
    handleFetchPermission(page, size, selectedRoleId);
  };

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

  const onSave = useCallback(async () => {
    if (!editedRows || Object.keys(editedRows).length === 0) {
      showWarning(t("noChangesToSave"));
      return;
    }
    setLoading(true);

    try {
      const editedRowsArray = Object.values(editedRows);
      // Lọc permission
      const permissions = editedRowsArray
        .filter((row) => !row.isParent) // Chỉ lấy children, không lấy parent
        .map((row) => {
          // Build scopes array từ checkbox states
          const scopes: string[] = [];
          if (row.view) scopes.push("view");
          if (row.create) scopes.push("create");
          if (row.update) scopes.push("update");
          if (row.delete) scopes.push("delete");
          console.log("scopes", scopes);

          return {
            // unitKey: `unit_${Date.now()}_${Math.random()
            //   .toString(36)
            //   .substring(2, 9)}`,
            resourceCode: row.resourceCode || "",
            resourceName: row.resourceName || "",
            parentName: row.parentName || "",
            scopes: scopes,
          };
        });

      // Validate payload
      if (permissions.length === 0) {
        showWarning(t("noValidDataToSave"));
        return;
      }

      const finalPayload = {
        roleId: selectedRoleId ? [selectedRoleId] : [],
        permissions,
      };
      const response = await PhanQuyenServices.savePhanQuyen(finalPayload);

      if (response) {
        const message =
          Array.isArray(response) && response.length > 0
            ? response[0].message
            : response.message;
        showSuccess(message || mes("saveSuccess"));
        setEditedRows({});
        await handleFetchPermission(currentPage, pageSize, selectedRoleId);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || mes("saveError"));
    } finally {
      setLoading(false);
    }
  }, [
    editedRows,
    t,
    selectedRoleId,
    mes,
    handleFetchPermission,
    currentPage,
    pageSize,
  ]);

  return (
    <>
      <FormSubmit
        onRoleChange={handleRoleChange}
        onAllPermissionToggle={handleAllPermission}
        allPermissionsSelected={allPermissionsSelected}
      />
      <LayoutContent
        layoutType={5}
        content1={
          <UserAccount
            roleId={selectedRoleId}
            shouldFetch={shouldFetchUserAccount}
          />
        }
        content2={
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
            paginationPageSize={pageSize}
            paginationCurrentPage={currentPage}
            maxRowsVisible={12}
            onChangePage={handlePageChange}
            onSelectionChanged={onSelectionChanged}
            onCellValueChanged={onCellValueChanged}
            columnFlex={1}
            showActionButtons={true}
            actionButtonsProps={{
              hideAdd: true,
              hideDelete: true,
              rowSelected: rowSelected,
              onSave: onSave,
            }}
          />
        }
        option={{
          sizeAdjust: [3, 7],
        }}
      />
    </>
  );
}

export default Page;
