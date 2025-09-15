/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponent from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { showError } from "@/hook/useNotification";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

function Page() {
  const notiMessage = useTranslations("message");
  const t = useTranslations("PhanQuyen");
  const gridRef = useRef<AgGridReact>({} as any);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [displayData, setDisplayData] = useState<TreeNode[]>([]);

  const handleFetchPermission = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: any = {
          groupCodes: "ADMIN",
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
          scopesField: "scopes",
        };
        const convertedTreeData = convertToTreeData(response, treeConfig);
        setTreeData(convertedTreeData);
        console.log("convertedTreeData", convertedTreeData);

        // Flatten để hiển thị
        const flattenedData = flattenTreeData(convertedTreeData);
        setDisplayData(flattenedData);
        console.log("flattenedData", flattenedData);

        setTotalItems(response.length);
        setLoading(false);
      } catch (error: any) {
        showError(error.response?.data?.message || notiMessage("fetchError"));
        setLoading(false);
      }
    },
    [currentPage, pageSize, notiMessage]
  );

  useEffect(() => {
    handleFetchPermission(currentPage, pageSize);
  }, [currentPage, handleFetchPermission, pageSize]);

  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const updatedTreeData = toggleNodeExpansion(treeData, nodeId);
      setTreeData(updatedTreeData);

      const flattenedData = flattenTreeData(updatedTreeData);
      setDisplayData(flattenedData);
    },
    [treeData]
  );

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
    handleFetchPermission(page, size);
  };

  return (
    <div>
      <LayoutContent
        layoutType={5}
        content1={<>ASS</>}
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
            maxRowsVisible={5}
            onChangePage={handlePageChange}
            columnFlex={0}
            showActionButtons={true}
          />
        }
      />
    </div>
  );
}

export default Page;
