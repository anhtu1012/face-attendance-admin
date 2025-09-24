/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { Branch } from "@/dtos/danhMuc/chi-nhanh/chinhanh.dto";

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
import DanhMucChiNhanhServices from "@/services/danh-muc/chi-nhanh/chiNhanh.service";
import { GoongService } from "@/services/goong/goong.service";

const defaultPageSize = 20;

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("DanhMucChiNhanh");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItem, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<Branch[]>([]);
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const [addressOptions] = useState<any>([]);

  // API function for address autocomplete
  const handleAddressSearch = useCallback(async (searchText: string) => {
    if (searchText.trim() === "") {
      return [];
    }

    try {
      const result = await GoongService.getAutoComplete(searchText);
      console.log({ result });
      const panel = result.predictions.map((pre: any) => ({
        value: pre.place_id,
        label: pre.description,
        ...pre,
      }));
      return panel;
    } catch (err) {
      console.error("Error fetching address suggestions", err);
      return [];
    }
  }, []);
  // Custom cell value changed logic

  // Define columnDefs first before dataGrid hook
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "branchName",
        headerClass: "required",
        headerName: t("tenChiNhanh"),
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "branchName", params);
        },
      },
      {
        field: "placeId",
        headerClass: "required",
        headerName: t("placeId"),
        editable: true,
        width: 200,
        context: {
          typeColumn: "Select",
          selectOptions: addressOptions,
          onSearchAPI: handleAddressSearch,
          apiDebounceTime: 500,
          minSearchLength: 2,
          loadingInitialOptions: false,
        },
      },
      {
        field: "addressLine",
        headerName: t("diaChi"),
        editable: false,
        width: 500,
      },
      {
        field: "district",
        headerName: t("district"),
        editable: false,
        width: 150,
      },
      {
        field: "city",
        headerName: t("thanhPho"),
        editable: false,
        width: 150,
      },
      {
        field: "lat",
        headerName: t("viDo"),
        editable: false,
        width: 250,
      },
      {
        field: "long",
        headerName: t("kinhDo"),
        editable: false,
        width: 250,
      },
    ],
    [addressOptions, handleAddressSearch, itemErrorCellStyle, t]
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
        const response = await DanhMucChiNhanhServices.getDanhMucChiNhanh(
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
    []
  );

  const dataGrid = useDataGridOperations<Branch>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      branchName: "",
      addressLine: "",
      district: "",
      placeId: "",
      city: "",
      lat: 0,
      long: 0,
    }),
    duplicateCheckField: "branchName",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "branchName", label: t("tenChiNhanh") },
      {
        field: "placeId",
        label: t("placeId"),
      },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCellValueChanged = useCallback(
    async (event: any) => {
      const customLogic = async (event: any) => {
        const { newValue, data } = event;
        const fieldName = event.colDef.field;
        console.log({ newValue, data, fieldName });

        // Custom logic cho addressLine - khi chọn địa chỉ thì update place details
        if (fieldName === "placeId" && event.oldValue !== newValue) {
          console.log({ addressLine: newValue, data });
          try {
            const placeDetail: any = await GoongService.getPlaceDetail(
              newValue
            );
            console.log({ placeDetail });

            // Update the row data with place details
            const updatedRowData = {
              ...data,
              addressLine: placeDetail?.result?.formatted_address || "",
              district: placeDetail?.result?.compound.district || "",
              city: placeDetail?.result?.compound.province || "",
              lat: placeDetail?.result?.geometry?.location?.lat || 0,
              long: placeDetail?.result?.geometry?.location?.lng || 0,
            };

            // Update the rowData state
            setRowData((prevData) =>
              prevData.map((item) =>
                item.unitKey === data.unitKey ? updatedRowData : item
              )
            );

            // Update related fields in the hook
            dataGrid.updateRelatedFields(getItemId(data), {
              addressLine: updatedRowData.addressLine,
              district: updatedRowData.district,
              city: updatedRowData.city,
              lat: updatedRowData.lat,
              long: updatedRowData.long,
            });

            console.log("Updated row data:", updatedRowData);
          } catch (error) {
            console.error("Error fetching place details:", error);
          }
        }
      };
      // Call the default dataGrid onCellValueChanged
      dataGrid.onCellValueChanged(event);
      await customLogic(event);
    },
    [dataGrid]
  );
  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    DanhMucChiNhanhServices.createDanhMucChiNhanh,
    DanhMucChiNhanhServices.updateDanhMucChiNhanh,
    () => fetchData(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    DanhMucChiNhanhServices.deleteDanhMucChiNhanh,
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
          rownumber={true}
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
          onCellValueChanged={handleCellValueChanged}
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
          columnFlex={0}
          onQuicksearch={dataGrid.handleQuicksearch}
          showActionButtons={true}
          actionButtonsProps={{
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
