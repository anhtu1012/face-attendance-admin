"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { SystemSettingItem } from "@/dtos/danhMuc/system-setting/system-setting.dto";

import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { useSelector } from "react-redux";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import DanhMucSystemSettingServices from "@/services/danh-muc/system-setting/systemSetting.service";

const defaultPageSize = 20;

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("DanhMucSystemSetting");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<SystemSettingItem[]>([]);
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);

  // Define columnDefs first before dataGrid hook
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "title",
        headerName: t("tieuDe"),
        headerClass: "required-header",
        editable: false,
        width: 200,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "title", params);
        },
      },
      {
        field: "description",
        headerClass: "required-header",
        headerName: t("moTa"),
        editable: false,
        width: 250,
      },
      {
        field: "value",
        headerClass: "required-header",
        headerName: t("giaTri"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "value", params);
        },
        context: {
          typeColumn: "Number",
        },
      },
      {
        field: "isActive",
        headerClass: "required-header",
        headerName: t("trangThai"),
        editable: true,
        width: 120,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: (params: { value: boolean }) => {
          return params.value ? "Hoạt động" : "Không hoạt động";
        },
      },
    ],
    [itemErrorCellStyle, t]
  );

  const fetchData = useCallback(
    async (
      currentPage: number,
      pageSize: number,
      quickSearchText: string | undefined
    ) => {
      setLoading(true);
      try {
        const searchFilter: FilterQueryStringTypeItem[] = [
          { key: "limit", type: FilterOperationType.Eq, value: pageSize },
          {
            key: "offset",
            type: FilterOperationType.Eq,
            value: (currentPage - 1) * pageSize,
          },
        ];
        const response =
          await DanhMucSystemSettingServices.getDanhMucSystemSetting(
            searchFilter,
            quickSearchText
          );
        setRowData(response.data);
        setTotalItems(response.count || 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setRowData, setTotalItems]
  );

  const dataGrid = useDataGridOperations<SystemSettingItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: "",
      description: "",
      value: "",
      isActive: true,
    }),
    duplicateCheckField: "title",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "title", label: t("tieuDe") },
      { field: "value", label: t("giaTri") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData,
    columnDefs,
  });
  useEffect(() => {
    fetchData(1, defaultPageSize, "");
  }, []);

  // Create save handler
  const handleSave = dataGrid.createSaveHandler(
    DanhMucSystemSettingServices.createDanhMucSystemSetting,
    DanhMucSystemSettingServices.updateDanhMucSystemSetting,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucSystemSettingServices.deleteDanhMucSystemSetting,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <LayoutContent
      layoutType={1}
      content1={
        <AgGridComponentWrapper
          showSearch={true}
          rowData={dataGrid.rowData}
          loading={loading}
          columnDefs={columnDefs}
          gridRef={gridRef}
          total={totalItem}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: true,
            checkboxes: false,
          }}
          onCellValueChanged={dataGrid.onCellValueChanged}
          onSelectionChanged={dataGrid.onSelectionChanged}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          onChangePage={(currentPage, pageSize) => {
            setCurrentPage(currentPage);
            setPageSize(pageSize);
            fetchData(currentPage, pageSize, quickSearchText);
          }}
          maxRowsVisible={13}
          columnFlex={1}
          onQuicksearch={dataGrid.handleQuicksearch}
          showActionButtons={true}
          actionButtonsProps={{
            hideAdd: true,
            hideDelete: true,
            onSave: handleSave,
            onDelete: handleDelete,
            rowSelected: dataGrid.rowSelected,
            showAddRowsModal: true,
            modalInitialCount: 1,
            onModalOk: dataGrid.handleModalOk,
            hasDuplicates: dataGrid.duplicateIDs.length > 0,
            hasErrors: dataGrid.hasValidationErrors,
          }}
        />
      }
    />
  );
}

export default Page;
