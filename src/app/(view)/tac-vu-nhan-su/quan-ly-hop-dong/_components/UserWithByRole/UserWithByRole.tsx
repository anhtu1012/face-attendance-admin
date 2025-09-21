/* eslint-disable @typescript-eslint/no-explicit-any */
import AgGridComponent from "@/components/basicUI/cTableAG";
import { showError } from "@/hooks/useNotification";
import PhanQuyenServices from "@/services/admin/quan-tri-he-thong/phan-quyen.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserWithByRoleProps } from "../../_types/prop";
import Cselect from "@/components/Cselect";

function UserWithByRole({
  roleCode,
  shouldFetch = false,
}: UserWithByRoleProps) {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("UserWithByRole");
  const gridRef = useRef<AgGridReact>({} as any);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleFetchUserWithByRole = useCallback(async () => {
    if (!roleCode) {
      setRowData([]);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const searchFilter: any = [];
      const params: any = {
        roleCode: roleCode,
      };
      const response = await PhanQuyenServices.getTaiKhoanNhomVaiTro(
        searchFilter,
        params
      );
      setRowData(response.data);
      setTotalItems(response.count);
      setLoading(false);
    } catch (error: any) {
      showError(error.response?.data?.message || mes("fetchError"));
      setLoading(false);
    }
  }, [mes, roleCode]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("userName"),
        editable: false,
      },
      {
        field: "fullName",
        headerName: t("fullName"),
        editable: false,
      },
    ],
    [t]
  );

  useEffect(() => {
    if (shouldFetch) {
      handleFetchUserWithByRole();
    }
  }, [handleFetchUserWithByRole, shouldFetch]);

  const buttonProps = {
    return: (
      <div style={{ width: "200px", padding: "0 10px" }}>
        <Cselect
          style={{ width: "100%" }}
          label={"Role"}
          allowClear
          options={roleCode}
        />
      </div>
    ),
  };

  return (
    <AgGridComponent
      showSearch={true}
      inputSearchProps={{
        id: "filter-text-box",
        idSearch: "filter-text-box",
      }}
      rowSelection={{
        mode: "singleRow",
        enableClickSelection: true,
        checkboxes: false,
      }}
      loading={loading}
      rowData={rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
      total={totalItems}
      pagination={false}
      maxRowsVisible={10}
      columnFlex={1}
      showActionButtons={true}
      actionButtonsProps={{
        hideAdd: true,
        hideDelete: true,
        hideSave: true,
        hideDivider: true,
        buttonProps: buttonProps,
      }}
    />
  );
}

export default UserWithByRole;
