/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import { useSelectData } from "@/hooks/useSelectData";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Segmented, message, Tooltip } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./index.scss";
import "./_components/JobCreationModal/JobCreationModal.scss";
import "./_components/SuccessModal/SuccessModal.scss";
import "./_components/JobDetailModal/JobDetailModal.scss";
import "./_components/LeaderReportModal/LeaderReportModal.scss";
import ListJob from "./_components/ListJob/ListJob";
import JobCreationModal from "./_components/JobCreationModal/JobCreationModal";
import SuccessModal from "./_components/SuccessModal/SuccessModal";
import InterviewScheduleModal from "./_components/InterviewScheduleModal/InterviewScheduleModal";
import JobOfferModal from "./_components/JobOfferModal/JobOfferModal";
import LeaderReportModal from "./_components/LeaderReportModal/LeaderReportModal";
import { FaPlusCircle } from "react-icons/fa";
import { GoReport } from "react-icons/go";

function Page() {
  const mes = useTranslations("HandleNotion");
  const t = useTranslations("NguoiDung");
  const gridRef = useRef<AgGridReact>({} as AgGridReact);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<TuyenDungItem[]>([]);
  const [quickSearchText, setQuickSearchText] = useState<string | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("Applied");
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [jobOfferModalOpen, setJobOfferModalOpen] = useState(false);
  const [leaderReportModalOpen, setLeaderReportModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<TuyenDungItem | null>(null);
  const [contractLink, setContractLink] = useState<string>("");
  const segmentedOptions = useMemo(
    () => [
      { label: "Liên hệ", value: "Applied" },
      { label: "Phỏng vấn", value: "Interview" },
      { label: "Nhận việc", value: "Offer" },
      { label: "Hợp đồng", value: "Hired" },
      { label: "Hủy hẹn", value: "Rejected" },
      { label: "Chưa phù hợp", value: "NotSuitable" },
      { label: "Hoàn thành", value: "Done" },
    ],
    []
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const { selectGender } = useSelectData({ fetchRole: true });
  const handleFetchUser = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        console.log(searchFilter);
        console.log(quickSearch);
        const dataFake: TuyenDungItem[] = [
          {
            id: "cand-001",
            firstName: "Văn A",
            lastName: "Nguyễn",
            email: "nguyenvana@example.com",
            phone: "0912345678",
            birthDay: "1993-05-20T00:00:00.000Z",
            address: "Ba Đình, Hà Nội",
            gender: "M",
            status: "Applied",
          },
          {
            id: "cand-002",
            firstName: "Thị C",
            lastName: "Lê",
            email: "lethic@example.com",
            phone: "0903111222",
            birthDay: "1997-11-03T00:00:00.000Z",
            address: "Quận 1, Hồ Chí Minh",
            gender: "F",
            status: "Interview",
          },
          {
            id: "cand-003",
            firstName: "Minh D",
            lastName: "Trần",
            email: "trandminh@example.com",
            phone: "0987654321",
            birthDay: "1990-02-15T00:00:00.000Z",
            address: "Đống Đa, Hà Nội",
            gender: "M",
            status: "Offer",
          },
          {
            id: "cand-004",
            firstName: "Lan E",
            lastName: "Phạm",
            email: "phamlan@example.com",
            phone: "0911223344",
            birthDay: "1995-08-10T00:00:00.000Z",
            address: "Thanh Khê, Đà Nẵng",
            gender: "F",
            status: "Hired",
          },
          {
            id: "cand-005",
            firstName: "Hùng F",
            lastName: "Hoàng",
            email: "hoanghung@example.com",
            phone: "0955667788",
            birthDay: "1988-12-25T00:00:00.000Z",
            address: "Ninh Kiều, Cần Thơ",
            gender: "M",
            status: "Rejected",
          },
        ];

        // const response = await TuyenDungServices.getTuyenDung(
        //   searchFilter,
        //   quickSearch
        // );
        setRowData(dataFake);
        setTotalItems(dataFake.length);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [currentPage, mes, pageSize]
  );

  useEffect(() => {
    handleFetchUser(currentPage, pageSize);
  }, [currentPage, handleFetchUser, pageSize]);

  const filteredData = useMemo(
    () =>
      selectedStatus === "All"
        ? rowData
        : rowData.filter((item) => item.status === selectedStatus),
    [rowData, selectedStatus]
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "status",
        headerName: t("isActive"),
        editable: false,
        width: 120,
        filter: false,
        context: {
          typeColumn: "Tag",
          selectOptions: segmentedOptions,
        },
        cellRendererParams: {
          colorMap: {
            Applied: "#ff9800",
            Interview: "#2196f3",
            Offer: "#4caf50",
            Hired: "#9c27b0",
            Rejected: "#f44336",
            "On Hold": "#607d8b",
            Withdrawn: "#795548",
            Shortlisted: "#00bcd4",
            Finalist: "#e91e63",
          },
        },
      },
      {
        field: "lastName",
        headerName: t("lastName"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "lastName", params);
        },
      },
      {
        field: "firstName",
        headerName: t("firstName"),
        editable: true,
        width: 150,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "firstName", params);
        },
      },
      {
        field: "email",
        headerName: "Email",
        editable: true,
        width: 180,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "email", params);
        },
      },
      {
        field: "birthday",
        headerName: t("birthDay"),
        editable: true,
        width: 190,
        context: {
          typeColumn: "Date",
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "birthday", params);
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
        field: "address",
        headerName: t("address"),
        editable: true,
        width: 150,
      },
      {
        field: "file",
        headerName: "CV",
        editable: true,
        width: 150,
      },
    ],
    [t, selectGender, itemErrorCellStyle, segmentedOptions]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size);
  };

  // Modal handlers
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleContractSuccess = (link: string) => {
    setContractLink(link);
    setModalOpen(false);
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    setContractLink("");
  };

  // Interview modal handlers
  const handleOpenInterviewModal = (_params: any) => {
    if (_params) {
      setSelectedCandidate(_params.data);
      setInterviewModalOpen(true);
    } else {
      message.warning("Vui lòng chọn ứng viên để tạo lịch phỏng vấn!");
    }
  };

  const handleCloseInterviewModal = () => {
    setInterviewModalOpen(false);
    setSelectedCandidate(null);
  };

  // Job offer modal handlers
  const handleOpenJobOfferModal = (_params: any) => {
    if (_params) {
      setSelectedCandidate(_params.data);
      setJobOfferModalOpen(true);
    } else {
      message.warning("Vui lòng chọn ứng viên để tạo lịch hẹn nhận việc!");
    }
  };

  const handleCloseJobOfferModal = () => {
    setJobOfferModalOpen(false);
    setSelectedCandidate(null);
  };

  // Leader report modal handlers
  const handleOpenLeaderReportModal = (_params: any) => {
    if (_params) {
      setSelectedCandidate(_params.data);
      setLeaderReportModalOpen(true);
    } else {
      message.warning("Vui lòng chọn nhân viên để xem báo cáo!");
    }
  };

  const handleCloseLeaderReportModal = () => {
    setLeaderReportModalOpen(false);
    setSelectedCandidate(null);
  };

  const dataGrid = useDataGridOperations<TuyenDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      firstName: "",
      lastName: "",
      email: "",
      birthDay: dayjs().toISOString(),
      gender: "",
      phone: "",
      address: "",
      status: "",
    }),
    duplicateCheckField: "email",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "firstName", label: t("firstName") },
      { field: "lastName", label: t("lastName") },
      { field: "email", label: "Email" },
      { field: "birthDay", label: t("birthDay") },
      { field: "gender", label: t("gender") },
      { field: "phone", label: t("phone") },
      { field: "address", label: t("address") },
      { field: "status", label: t("isActive") },
    ],
    t,
    // Quicksearch parameters
    setCurrentPage,
    setPageSize,
    setQuickSearchText,
    fetchData: handleFetchUser,
    columnDefs,
  });

  // Create save handler (chờ API service được implement)
  const handleSave = dataGrid.createSaveHandler(
    TuyenDungServices.createTuyenDung,
    TuyenDungServices.updateTuyenDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  // Create delete handler (chờ API service được implement)
  const handleDelete = dataGrid.createDeleteHandler(
    TuyenDungServices.deleteTuyenDung,
    () => handleFetchUser(currentPage, pageSize, quickSearchText)
  );

  const buttonProps = (_params: any) => {
    if (selectedStatus === "Interview") {
      return (
        <Tooltip title="Tạo lịch hẹn">
          <FaPlusCircle
            className="tool-icon interview-icon"
            size={30}
            onClick={() => handleOpenInterviewModal(_params)}
          />
        </Tooltip>
      );
    } else if (selectedStatus === "Offer") {
      return (
        <Tooltip title="Hẹn nhận việc">
          <FaPlusCircle
            className="tool-icon offer-icon"
            size={30}
            onClick={() => handleOpenJobOfferModal(_params)}
          />
        </Tooltip>
      );
    } else if (selectedStatus === "Hired") {
      return (
        <Tooltip title="Xem báo cáo từ Leader">
          <GoReport
            className="tool-icon report-icon"
            size={30}
            onClick={() => handleOpenLeaderReportModal(_params)}
          />
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  if (!dataGrid.isClient) {
    return null;
  }

  return (
    <div className="tuyen-dung-page">
      <LayoutContent
        layoutType={5}
        option={{
          cardTitle: "Danh sách công việc",
          floatButton: true,
          sizeAdjust: [3, 7],
        }}
        content1={
          <>
            <div
              className="header-add-button"
              style={{ position: "absolute", top: 13, right: 10 }}
            >
              <FaPlusCircle
                size={30}
                style={{
                  color: "orange",
                  boxShadow:
                    "0 0 30px rgba(227, 141, 48, 0.8), 0 0 100px rgba(227, 141, 48, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  zIndex: 1000,
                }}
                title="Tạo công việc"
                onClick={handleOpenModal}
              />
            </div>
            <ListJob />
          </>
        }
        content2={
          <>
            <div style={{ width: "100%" }}>
              <Segmented
                className="status-segmented"
                options={segmentedOptions}
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value as string)}
              />
            </div>
            <AgGridComponentWrapper
              showSearch={true}
              rowData={filteredData}
              loading={loading}
              columnDefs={columnDefs}
              gridRef={gridRef}
              total={totalItems}
              paginationPageSize={pageSize}
              rowSelection={{
                mode: "singleRow",
                enableClickSelection: true,
                checkboxes: false,
              }}
              onCellValueChanged={dataGrid.onCellValueChanged}
              paginationCurrentPage={currentPage}
              pagination={true}
              maxRowsVisible={10}
              onChangePage={handlePageChange}
              onQuicksearch={dataGrid.handleQuicksearch}
              columnFlex={0}
              showToolColumn={true}
              toolColumnRenderer={buttonProps}
              showActionButtons={true}
              actionButtonsProps={{
                hideAdd: selectedStatus !== "Applied" ? true : false,
                hideDelete: selectedStatus !== "Applied" ? true : false,
                hideDivider: selectedStatus !== "Applied" ? true : false,
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
          </>
        }
      />

      {/* Job Creation Modal */}
      <JobCreationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleContractSuccess}
      />

      {/* Success Modal */}
      <SuccessModal
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
        jobLink={contractLink}
      />

      {/* Interview Schedule Modal */}
      <InterviewScheduleModal
        open={interviewModalOpen}
        onClose={handleCloseInterviewModal}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id || "",
                firstName: selectedCandidate.firstName || "",
                lastName: selectedCandidate.lastName || "",
                email: selectedCandidate.email || "",
                phone: selectedCandidate.phone || "",
              }
            : undefined
        }
      />

      {/* Job Offer Modal */}
      <JobOfferModal
        open={jobOfferModalOpen}
        onClose={handleCloseJobOfferModal}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id || "",
                firstName: selectedCandidate.firstName || "",
                lastName: selectedCandidate.lastName || "",
                email: selectedCandidate.email || "",
                phone: selectedCandidate.phone || "",
              }
            : undefined
        }
      />

      {/* Leader Report Modal */}
      <LeaderReportModal
        open={leaderReportModalOpen}
        onClose={handleCloseLeaderReportModal}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id || "",
                firstName: selectedCandidate.firstName || "",
                lastName: selectedCandidate.lastName || "",
                email: selectedCandidate.email || "",
                phone: selectedCandidate.phone || "",
              }
            : undefined
        }
      />
    </div>
  );
}

export default Page;
