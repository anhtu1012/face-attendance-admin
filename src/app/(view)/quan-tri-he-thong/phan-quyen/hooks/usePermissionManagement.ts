/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { showError, showSuccess, showWarning } from "@/hooks/useNotification";
import PhanQuyenServices from "@/services/admin/quan-tri-he-thong/phan-quyen.service";
import {
  convertToTreeData,
  flattenTreeData,
  toggleNodeExpansion,
  TreeNode,
  updateNodeCheckbox,
} from "@/utils/tree-data.utils";

export const usePermissionManagement = () => {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("PhanQuyen");

  // States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [editedRows, setEditedRows] = useState<{ [key: string]: TreeNode }>({});
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [displayData, setDisplayData] = useState<TreeNode[]>([]);
  const [selectedRoleCode, setSelectedRoleCode] = useState<string>("");
  const [shouldFetchUserAccount, setShouldFetchUserAccount] =
    useState<boolean>(false);
  const [allPermissionsSelected, setAllPermissionsSelected] =
    useState<boolean>(false);

  // Utility function to get all child nodes recursively
  const getAllChildNodes = useCallback((nodes: TreeNode[]): TreeNode[] => {
    const allChildren: TreeNode[] = [];

    nodes.forEach((node) => {
      if (!node.isParent) {
        allChildren.push(node);
      }

      if (node.children && node.children.length > 0) {
        allChildren.push(...getAllChildNodes(node.children));
      }
    });

    return allChildren;
  }, []);

  // Check if all permissions are selected
  const checkAllPermissionsSelected = useCallback(() => {
    if (!treeData || treeData.length === 0) {
      return false;
    }

    const allChildren = getAllChildNodes(treeData);
    if (allChildren.length === 0) {
      return false;
    }

    return allChildren.every(
      (node) => node.view && node.create && node.update && node.delete
    );
  }, [treeData, getAllChildNodes]);

  // Update allPermissionsSelected state when treeData changes
  useEffect(() => {
    const isAllSelected = checkAllPermissionsSelected();
    setAllPermissionsSelected(isAllSelected);
  }, [treeData, checkAllPermissionsSelected]);

  // Fetch permissions
  const handleFetchPermission = useCallback(
    async (
      page = currentPage,
      limit = pageSize,
      roleCode: string,
      quickSearch?: string
    ) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: any = { roleCode };

        if (quickSearch && quickSearch.trim() !== "") {
          params.quickSearch = quickSearch;
        }

        const response = await PhanQuyenServices.getPhanQuyen(
          searchFilter,
          params
        );

        const treeConfig = {
          parentField: "parentName",
          idField: "id",
          scopesField: "menuScopes",
        };
        const convertedTreeData = convertToTreeData(response, treeConfig);
        setTreeData(convertedTreeData);

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

  // Handle role change
  const handleRoleChange = useCallback(
    (roleCode: string) => {
      setSelectedRoleCode(roleCode);
      setCurrentPage(1);
      setShouldFetchUserAccount(true);

      if (roleCode === "") {
        setDisplayData([]);
        return;
      }

      handleFetchPermission(1, pageSize, roleCode);
      setTimeout(() => setShouldFetchUserAccount(false), 100);
    },
    [handleFetchPermission, pageSize]
  );

  // Handle node toggle (expand/collapse)
  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const updatedTreeData = toggleNodeExpansion(treeData, nodeId);
      setTreeData(updatedTreeData);

      const flattenedData = flattenTreeData(updatedTreeData);
      setDisplayData(flattenedData);
    },
    [treeData]
  );

  // Handle checkbox change
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
        setEditedRows((prev) => ({
          ...prev,
          [nodeId]: {
            ...updatedNode,
            view: updatedNode.view,
            create: updatedNode.create,
            update: updatedNode.update,
            delete: updatedNode.delete,
            all: updatedNode.all,
          },
        }));
      }

      // Update children if parent is clicked
      if (updatedNode?.isParent && updatedNode.children) {
        updatedNode.children.forEach((child) => {
          const childInDisplay = flattenedData.find(
            (node) => node.id === child.id
          );

          if (childInDisplay) {
            setEditedRows((prev) => ({
              ...prev,
              [child.id]: {
                ...childInDisplay,
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

  // Handle all permissions toggle
  const handleAllPermission = useCallback(() => {
    if (!treeData || treeData.length === 0) {
      showWarning(t("noDataToTogglePermissions"));
      return;
    }

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
  }, [treeData, allPermissionsSelected, t]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);
      handleFetchPermission(page, size, selectedRoleCode);
    },
    [handleFetchPermission, selectedRoleCode]
  );

  // Handle cell value change
  const onCellValueChanged = useCallback((params: any) => {
    const rowData = params.data as TreeNode;
    const field = params.colDef.field;
    const newValue = params.newValue;
    const oldValue = params.oldValue;

    if (newValue !== oldValue) {
      setEditedRows((prev) => ({
        ...prev,
        [rowData.id]: {
          ...(prev[rowData.id] || rowData),
          [field]: newValue,
        },
      }));
    }
  }, []);

  // Handle save
  const onSave = useCallback(async () => {
    if (!editedRows || Object.keys(editedRows).length === 0) {
      showWarning(t("noChangesToSave"));
      return;
    }
    setLoading(true);

    try {
      const editedRowsArray = Object.values(editedRows);
      const permissions = editedRowsArray
        .filter((row) => !row.isParent)
        .map((row) => {
          const scopes: string[] = [];
          if (row.view) scopes.push("view");
          if (row.create) scopes.push("create");
          if (row.update) scopes.push("update");
          if (row.delete) scopes.push("delete");

          return {
            resourceCode: row.resourceCode || "",
            resourceName: row.resourceName || "",
            parentName: row.parentName || "",
            scopes: scopes,
          };
        });

      if (permissions.length === 0) {
        showWarning(t("noValidDataToSave"));
        return;
      }

      const finalPayload = {
        groupCode: selectedRoleCode ? [selectedRoleCode] : [],
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
        await handleFetchPermission(currentPage, pageSize, selectedRoleCode);
      }
    } catch (error: any) {
      showError(error.response?.data?.message || mes("saveError"));
    } finally {
      setLoading(false);
    }
  }, [
    editedRows,
    t,
    selectedRoleCode,
    mes,
    handleFetchPermission,
    currentPage,
    pageSize,
  ]);

  return {
    // States
    currentPage,
    totalItems,
    pageSize,
    loading,
    editedRows,
    treeData,
    displayData,
    selectedRoleCode,
    shouldFetchUserAccount,
    allPermissionsSelected,

    // Functions
    handleFetchPermission,
    handleRoleChange,
    handleNodeToggle,
    handleCheckboxChange,
    handleAllPermission,
    handlePageChange,
    onCellValueChanged,
    onSave,
  };
};
