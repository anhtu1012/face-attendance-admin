/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useNguoiDungColumns } from "./_hooks/useNguoiDungColumns";
import { useNguoiDungData } from "./_hooks/useNguoiDungData";
import { useNguoiDungGrid } from "./_hooks/useNguoiDungGrid";
import { NguoiDungTable } from "./_components/TableUser/NguoiDungTable";
import {
  ChangePasswordModal,
  UpdateManagerModal,
  UpdateAccountStatusModal,
} from "./_modals";

function Page() {
  const gridRef = useRef<AgGridReact>({} as AgGridReact);

  // Modal states
  const [changePasswordModal, setChangePasswordModal] = useState<{
    open: boolean;
    userData: any;
  }>({ open: false, userData: null });

  const [updateManagerModal, setUpdateManagerModal] = useState<{
    open: boolean;
    userData: any;
  }>({ open: false, userData: null });

  const [updateStatusModal, setUpdateStatusModal] = useState<{
    open: boolean;
    userData: any;
  }>({ open: false, userData: null });

  // Modal handlers
  const handleChangePassword = (data: any) => {
    setChangePasswordModal({ open: true, userData: data });
  };

  const handleUpdateManager = (data: any) => {
    setUpdateManagerModal({ open: true, userData: data });
  };

  const handleUpdateAccountStatus = (data: any) => {
    setUpdateStatusModal({ open: true, userData: data });
  };

  // Custom hooks for modularity
  const { columnDefs, actionCellRenderer } = useNguoiDungColumns({
    onChangePassword: handleChangePassword,
    onUpdateManager: handleUpdateManager,
    onUpdateAccountStatus: handleUpdateAccountStatus,
  });

  const {
    currentPage,
    totalItems,
    pageSize,
    loading,
    rowData,
    quickSearchText,
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    setRowData,
    handleFetchUser,
    handlePageChange,
  } = useNguoiDungData();

  const { dataGrid, handleSave, handleDelete } = useNguoiDungGrid({
    gridRef,
    rowData,
    setRowData,
    columnDefs,
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    handleFetchUser,
    currentPage,
    pageSize,
    quickSearchText,
  });

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <>
      <LayoutContent
        layoutType={1}
        content1={
          <NguoiDungTable
            rowData={rowData}
            loading={loading}
            columnDefs={columnDefs}
            actionCellRenderer={actionCellRenderer}
            gridRef={gridRef}
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onCellValueChanged={dataGrid.onCellValueChanged}
            onChangePage={handlePageChange}
            onQuicksearch={dataGrid.handleQuicksearch}
            onSave={handleSave}
            onDelete={handleDelete}
            rowSelected={dataGrid.rowSelected}
            hasDuplicates={dataGrid.duplicateIDs.length > 0}
            hasErrors={dataGrid.hasValidationErrors}
            onModalOk={dataGrid.handleModalOk}
          />
        }
      />

      {/* Modals */}
      <ChangePasswordModal
        open={changePasswordModal.open}
        onCancel={() => setChangePasswordModal({ open: false, userData: null })}
        userData={changePasswordModal.userData}
        onSuccess={() =>
          handleFetchUser(currentPage, pageSize, quickSearchText)
        }
      />

      <UpdateManagerModal
        open={updateManagerModal.open}
        onCancel={() => setUpdateManagerModal({ open: false, userData: null })}
        userData={updateManagerModal.userData}
        onSuccess={() =>
          handleFetchUser(currentPage, pageSize, quickSearchText)
        }
      />

      <UpdateAccountStatusModal
        open={updateStatusModal.open}
        onCancel={() => setUpdateStatusModal({ open: false, userData: null })}
        userData={updateStatusModal.userData}
        onSuccess={() =>
          handleFetchUser(currentPage, pageSize, quickSearchText)
        }
      />
    </>
  );
}

export default Page;
