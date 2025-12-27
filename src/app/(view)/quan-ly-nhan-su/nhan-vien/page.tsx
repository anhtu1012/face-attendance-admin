/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "@ag-grid-community/react";
import { FiFilter, FiBarChart2 } from "react-icons/fi";
import { BiTransferAlt } from "react-icons/bi";
import { FloatButton } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { useSelectData } from "@/hooks/useSelectData";
import { useNguoiDungColumns } from "./_hooks/useNguoiDungColumns";
import { useNguoiDungData } from "./_hooks/useNguoiDungData";
import { useNguoiDungGrid } from "./_hooks/useNguoiDungGrid";
import { useReportStaff } from "./_hooks/useReportStaff";
import { NguoiDungTable } from "./_components/TableUser/NguoiDungTable";
import FilterPanel from "./_components/FilterPanel";
import EmployeeStats from "./_components/EmployeeStats";
import {
  ChangePasswordModal,
  UpdateManagerModal,
  UpdateAccountStatusModal,
  AddUserModal,
  UpdateUserModal,
} from "./_modals";
import "./page.scss";

function Page() {
  const router = useRouter();
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

  const [addUserModal, setAddUserModal] = useState<boolean>(false);

  const [updateUserModal, setUpdateUserModal] = useState<{
    open: boolean;
    userData: any;
  }>({ open: false, userData: null });

  // View toggle state (true: Filter, false: Stats)
  const [showFilter, setShowFilter] = useState<boolean>(true);

  // Modal handlers
  const handleViewDetail = (data: any) => {
    if (data?.id) {
      router.push(`/quan-ly-nhan-su/nhan-vien/${data.id}`);
    }
  };

  const handleChangePassword = (data: any) => {
    setChangePasswordModal({ open: true, userData: data });
  };

  const handleUpdateManager = (data: any) => {
    setUpdateManagerModal({ open: true, userData: data });
  };

  const handleUpdateAccountStatus = (data: any) => {
    setUpdateStatusModal({ open: true, userData: data });
  };

  const handleAddUser = () => {
    setAddUserModal(true);
  };

  const handleEditUser = (data: any) => {
    setUpdateUserModal({ open: true, userData: data });
  };

  // Custom hooks for modularity
  const { columnDefs, actionCellRenderer } = useNguoiDungColumns({
    onViewDetail: handleViewDetail,
    onChangePassword: handleChangePassword,
    onUpdateManager: handleUpdateManager,
    onUpdateAccountStatus: handleUpdateAccountStatus,
    onEdit: handleEditUser,
  });

  const {
    currentPage,
    totalItems,
    pageSize,
    loading,
    rowData,
    quickSearchText,
    filters,
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    setRowData,
    setFilters,
    handleFetchUser,
    handlePageChange,
  } = useNguoiDungData();

  const { selectDepartment } = useSelectData({
    fetchDepartment: true,
  });

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

  const {
    totalStaffInDepartment,
    totalStaffInPosition,
    loading: statsLoading,
  } = useReportStaff();

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    handleFetchUser(currentPage, pageSize, quickSearchText, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handleFilter = (filterValues: any) => {
    setFilters(filterValues);
    setCurrentPage(1);
    handleFetchUser(1, pageSize, quickSearchText, filterValues);
  };

  const handleResetFilter = () => {
    setFilters({});
    setCurrentPage(1);
    handleFetchUser(1, pageSize, quickSearchText, {});
  };

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <>
      <LayoutContent
        layoutType={5}
        option={{
          cardTitle: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span>Quản lý nhân viên</span>
              <div
                onClick={() => setShowFilter(!showFilter)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: "#f0f2f5",
                  transition: "all 0.3s",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#003c97",
                }}
                title={
                  showFilter ? "Chuyển sang thống kê" : "Chuyển sang bộ lọc"
                }
              >
                {showFilter ? (
                  <FiFilter size={16} />
                ) : (
                  <FiBarChart2 size={16} />
                )}
                <span>{showFilter ? "Bộ lọc" : "Thống kê"}</span>
                <BiTransferAlt size={18} style={{ marginLeft: "4px" }} />
              </div>
            </div>
          ),
          floatButton: true,
          sizeAdjust: [3, 7],
        }}
        content1={
          <>
            {showFilter ? (
              <FilterPanel
                onFilter={handleFilter}
                onReset={handleResetFilter}
                loading={loading}
                departmentOptions={selectDepartment}
              />
            ) : (
              <EmployeeStats
                totalEmployees={totalItems}
                departmentStats={totalStaffInDepartment}
                positionStats={totalStaffInPosition}
                loading={statsLoading}
              />
            )}
          </>
        }
        content2={
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

      <AddUserModal
        open={addUserModal}
        onCancel={() => setAddUserModal(false)}
        onSuccess={() =>
          handleFetchUser(currentPage, pageSize, quickSearchText)
        }
      />

      <UpdateUserModal
        open={updateUserModal.open}
        onCancel={() => setUpdateUserModal({ open: false, userData: null })}
        userData={updateUserModal.userData}
        onSuccess={() =>
          handleFetchUser(currentPage, pageSize, quickSearchText)
        }
      />
    </>
  );
}

export default Page;
