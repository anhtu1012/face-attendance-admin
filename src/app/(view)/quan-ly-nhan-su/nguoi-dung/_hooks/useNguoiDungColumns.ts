/* eslint-disable @typescript-eslint/no-explicit-any */
import { CellStyle, ColDef } from "@ag-grid-community/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { useSelectData } from "@/hooks/useSelectData";
import { ActionCellRenderer } from "../_components/ActionCellRenderer/ActionCellRenderer";
import { ManagerNameCell } from "../_components/ManagerNameCell";

interface UseNguoiDungColumnsParams {
  onChangePassword?: (data: any) => void;
  onUpdateManager?: (data: any) => void;
  onUpdateAccountStatus?: (data: any) => void;
}

export function useNguoiDungColumns({
  onChangePassword,
  onUpdateManager,
  onUpdateAccountStatus,
}: UseNguoiDungColumnsParams = {}) {
  const t = useTranslations("NguoiDung");
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const { selectRole, selectDepartment, selectGender } = useSelectData({
    fetchRole: true,
    fetchDepartment: true,
  });

  const centerStyle: CellStyle = useMemo(
    () => ({ paddingLeft: 0, display: "flex", justifyContent: "center" }),
    []
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "roleId",
        headerName: t("roleCode"),
        editable: true,
        width: 180,
        context: {
          typeColumn: "Select",
          selectOptions: selectRole,
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "roleId", params);
        },
      },
      {
        field: "userName",
        headerName: t("userName"),
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "userName", params);
        },
      },
      {
        field: "fullName",
        headerName: t("fullName"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "fullName", params);
        },
      },
      {
        field: "managerName",
        headerName: t("manageByUserName"),
        editable: false,
        width: 200,
        cellRenderer: (params: any) => {
          return React.createElement(ManagerNameCell, {
            value: params.value,
            data: params.data,
            onUpdateManager,
          });
        },
      },
      {
        field: "email",
        headerName: "Email",
        editable: true,
        width: 250,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "email", params);
        },
      },
      {
        field: "gender",
        headerName: t("gender"),
        editable: true,
        width: 150,
        context: {
          typeColumn: "Select",
          selectOptions: selectGender,
        },
      },
      {
        field: "phone",
        headerName: t("phone"),
        editable: true,
        width: 170,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "phone", params);
        },
      },
      {
        field: "departmentId",
        headerName: t("Department"),
        editable: true,
        width: 180,
        context: {
          typeColumn: "Select",
          selectOptions: selectDepartment,
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "roleId", params);
        },
      },
      {
        field: "positionName",
        headerName: t("fullName"),
        editable: false,
        width: 150,
      },
      {
        field: "isActive",
        headerName: t("isActive"),
        editable: true,
        width: 150,
        cellStyle: centerStyle,
      },
    ],
    [
      t,
      selectRole,
      selectGender,
      selectDepartment,
      centerStyle,
      itemErrorCellStyle,
    ]
  );

  // Create a renderer factory that includes the callbacks in closure
  const actionCellRenderer = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (params: any) => {
      return React.createElement(ActionCellRenderer, {
        data: params.data,
        context: {
          onChangePassword,
          onUpdateManager,
          onUpdateAccountStatus,
        },
      });
    };
  }, [onChangePassword, onUpdateManager, onUpdateAccountStatus]);

  return {
    columnDefs,
    actionCellRenderer,
  };
}
