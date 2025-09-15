/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { ThueItem } from "@/dtos/danhMuc/thue/thue.dto";

import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import DanhMucThueServices from "@/services/danh-muc/thue/thue.service";
import { buildQuicksearchParams } from "@/utils/client/buildQuicksearchParams/buildQuicksearchParams";
import { validateField } from "@/utils/client/validateTable/validateField ";
import { getItemId } from "@/utils/client/validationHelpers";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { FilterOperationType } from "@chax-at/prisma-filter-common";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const defaultPageSize = 20;

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("TAX");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<ThueItem[]>([]);
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "taxCode",
        headerName: t("taxCode"),
        editable: true,
        width: 180,
      },
      {
        field: "taxName",
        headerName: t("taxName"),
        editable: true,
        width: 180,
      },
      {
        field: "taxPercent",
        headerName: t("taxPercent"),
        editable: true,
        width: 180,
      },
    ],
    [t]
  );
  const validateRowData = useCallback(
    (data: ThueItem): boolean => {
      let isValid = true;
      const itemId = getItemId(data);
      // const errorMessages: string[] = [];

      const requiredFields: Array<{
        field: keyof typeof data;
        label: string;
      }> = [
        { field: "taxCode", label: t("taxCode") },
        { field: "taxName", label: t("taxName") },
        { field: "taxPercent", label: t("taxPercent") },
        { field: "unitKey", label: "unitKey" },
      ];
      requiredFields.forEach(({ field, label }) => {
        if (
          !validateField(label, data[field], true, field, "string", itemId, mes)
        ) {
          isValid = false;
        }
      });
      return isValid;
    },
    [t, mes]
  );
  const fetchData = async (
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
      const response = await DanhMucThueServices.getDanhMucThue(
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
  };
  useEffect(() => {
    fetchData(1, defaultPageSize, "");
  }, []);

  const dataGrid = useDataGridOperations<ThueItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      taxCode: "",
      taxName: "",
      taxPercent: 0,
    }),
    duplicateCheckField: "taxCode",
    mes,
    rowData,
    setRowData,
  });

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    validateRowData,
    DanhMucThueServices.createDanhMucThue,
    DanhMucThueServices.updateDanhMucThue,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucThueServices.deleteDanhMucThue,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  const handleQuicksearch = useCallback(
    (
      searchText: string | "",
      selectedFilterColumns: any[],
      filterValues: string | "",
      paginationSize: number
    ) => {
      setCurrentPage(1);
      setPageSize(paginationSize);

      if (!searchText && !filterValues) {
        setQuickSearchText(undefined);
        fetchData(1, paginationSize, undefined);
        return;
      }
      const params = buildQuicksearchParams(
        searchText,
        selectedFilterColumns,
        filterValues,
        columnDefs
      );
      setQuickSearchText(params);
      fetchData(1, paginationSize, params);
    },
    [columnDefs]
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
          onCellValueChanged={dataGrid.onCellValueChanged}
          onSelectionChanged={dataGrid.onSelectionChanged}
          pagination={true}
          paginationPageSize={pageSize}
          paginationCurrentPage={currentPage}
          maxRowsVisible={5}
          columnFlex={1}
          onQuicksearch={handleQuicksearch}
          showActionButtons={true}
          actionButtonsProps={{
            onSave: handleSave,
            onDelete: handleDelete,
            rowSelected: dataGrid.rowSelected,
            showAddRowsModal: true,
            modalInitialCount: 1,
            onModalOk: dataGrid.handleModalOk,
          }}
        />
      }
    />
  );
}

export default Page;
