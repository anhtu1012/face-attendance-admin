/* eslint-disable @typescript-eslint/no-explicit-any */
import AgGridComponent from "@/components/basicUI/cTableAG";
import { showError } from "@/hooks/useNotification";
import PhanQuyenServices from "@/services/admin/quan-tri-he-thong/phan-quyen.service";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UserAccountProps {
  roleId?: string;
  shouldFetch?: boolean;
}

function UserAccount({ roleId, shouldFetch = false }: UserAccountProps) {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("PhanQuyen");
  const gridRef = useRef<AgGridReact>({} as any);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleFetchUserAccount = useCallback(async () => {
    if (!roleId) {
      setRowData([]);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const searchFilter: any = [];
      const params: any = {
        roleId: roleId,
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
  }, [mes, roleId]);

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
      handleFetchUserAccount();
    }
  }, [handleFetchUserAccount, shouldFetch]);

  return (
    <AgGridComponent
      showSearch={true}
      inputSearchProps={{
        id: "filter-text-box",
        idSearch: "filter-text-box",
      }}
      loading={loading}
      rowData={rowData}
      columnDefs={columnDefs}
      gridRef={gridRef}
      total={totalItems}
      pagination={false}
      maxRowsVisible={10}
      columnFlex={1}
      showActionButtons={false}
    />
  );
}

export default UserAccount;
