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
import { Segmented, Tooltip } from "antd";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
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
import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import InterviewListModal from "./_components/InterviewListModal/InterviewListModal";
import { GoReport } from "react-icons/go";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { FcViewDetails } from "react-icons/fc";
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
  const [selectedStatus, setSelectedStatus] = useState<string>("LIEN_HE");
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [jobOfferModalOpen, setJobOfferModalOpen] = useState(false);
  const [leaderReportModalOpen, setLeaderReportModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<TuyenDungItem | null>(null);
  const messageApi = useAntdMessage();
  const [contractLink, setContractLink] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [listModalOpen, setListModalOpen] = useState(false);
  const segmentedOptions = useMemo(
    () => [
      { label: "Liên hệ", value: "LIEN_HE" },
      { label: "Phỏng vấn", value: "PHONG_VAN" },
      { label: "Nhận việc", value: "NHAN_VIEC" },
      { label: "Hợp đồng", value: "HOP_DONG" },
      { label: "Hủy hẹn", value: "HUY_HEN" },
      { label: "Chưa phù hợp", value: "CHUA_PHU_HOP" },
      { label: "Hoàn thành", value: "HOAN_THANH" },
    ],
    []
  );
  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const {
    selectGender,
    selectSkill,
    selectRole,
    selectExperience,
    selectExperienceYears,
    selectCandidate,
  } = useSelectData({
    fetchSkill: true,
    fetchRole: true,
  });
  const handleFetchUser = useCallback(
    async (page = currentPage, limit = pageSize, quickSearch?: string) => {
      setLoading(true);
      if (!jobId) {
        setRowData([]);
        setTotalItems(0);
        setLoading(false);
        return;
      }
      try {
        const searchFilter: any = [
          { key: "limit", type: "=", value: limit },
          { key: "offset", type: "=", value: (page - 1) * limit },
        ];
        const params: Record<string, string | number | boolean> = {
          jobId: jobId,
        };
        if (selectedStatus !== "All") {
          params.status = selectedStatus;
        }

        const response = await TuyenDungServices.getTuyenDung(
          searchFilter,
          quickSearch,
          params
        );
        setRowData(response.data);
        setTotalItems(response.data.length);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [currentPage, jobId, mes, pageSize, selectedStatus]
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
          selectOptions: selectCandidate,
        },
        cellRendererParams: {
          colorMap: {
            TO_CONTACT: "#1976D2", // blue
            CANNOT_CONTACT: "#9E9E9E", // grey
            TO_INTERVIEW: "#43A047", // green
            INTERVIEW_FAILED: "#E53935", // red
            INTERVIEW_RESCHEDULED: "#FB8C00", // orange
            JOB_OFFERED: "#00796B", // teal
            CONTRACT_SIGNING: "#6A1B9A", // purple
            INTERVIEW_REJECTED: "#FF7043", // light red/orange
            OFFER_REJECTED: "#C62828", // dark red
            NOT_SUITABLE: "#9E9E9E", // grey
            HOAN_THANH: "#2E7D32", // dark green
          },
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
        field: "email",
        headerName: "Email",
        context: { typeColumn: "Text", inputType: "email", maxLength: 100 },
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
        field: "skillIds",
        headerName: t("skills"),
        editable: true,
        width: 250,
        context: {
          typeColumn: "Select",
          selectOptions: selectSkill,
          multiple: true,
        },
      },
      {
        field: "experience",
        headerName: t("experience"),
        editable: true,
        width: 150,
        context: {
          typeColumn: "Select",
          selectOptions: selectExperienceYears,
        },
      },
      {
        field: "fileCV",
        headerName: "CV",
        editable: false,
        width: 150,
        context: {
          typeColumn: "File",
        },
      },
    ],
    [
      t,
      selectGender,
      selectSkill,
      selectExperienceYears,
      selectCandidate,
      itemErrorCellStyle,
    ]
  );

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    handleFetchUser(page, size, quickSearchText);
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

  // PHONG_VAN modal handlers
  const handleOpenInterviewModal = (_params: any) => {
    if (_params) {
      setSelectedCandidate(_params.data);
      setInterviewModalOpen(true);
    } else {
      messageApi.warning("Vui lòng chọn ứng viên để tạo lịch phỏng vấn!");
    }
  };

  const handleOpenInterviewListModal = (_params: any) => {
    if (_params) {
      // optionally set selected candidate for context
      setSelectedCandidate(_params.data);
      setListModalOpen(true);
    } else {
      messageApi.warning("Vui lòng chọn ứng viên để xem lịch phỏng vấn!");
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
      messageApi.warning("Vui lòng chọn ứng viên để tạo lịch hẹn nhận việc!");
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
      messageApi.warning("Vui lòng chọn nhân viên để xem báo cáo!");
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
      fullName: "",
      email: "",
      // default birthday: 18 years ago
      birthday: dayjs().subtract(18, "year").toISOString(),
      gender: "",
      phone: "",
      experience: "",
      status: "",
    }),
    duplicateCheckField: "email",
    mes,
    rowData,
    setRowData,
    requiredFields: [
      { field: "fullName", label: t("fullName") },
      { field: "email", label: "Email" },
      { field: "birthday", label: t("birthDay") },
      { field: "gender", label: t("gender") },
      { field: "phone", label: t("phone") },
      { field: "skillIds", label: t("skills") },
      { field: "experience", label: t("experience") },
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
  const handleChangeStatusToInterview = (_params: any) => {
    console.log(_params);
  };

  const buttonProps = (_params: any) => {
    if (selectedStatus === "LIEN_HE") {
      return (
        <Tooltip title="Chuyển đến phỏng vấn">
          <BiSolidSkipNextCircle
            className="tool-icon interview-icon"
            size={30}
            onClick={() => handleChangeStatusToInterview(_params)}
          />
        </Tooltip>
      );
    } else if (
      selectedStatus === "PHONG_VAN" &&
      _params.data.status === "TO_INTERVIEW"
    ) {
      return (
        <Tooltip title="Tạo lịch hẹn">
          <FaPlusCircle
            className="tool-icon interview-icon"
            size={30}
            onClick={() => handleOpenInterviewModal(_params)}
          />
        </Tooltip>
      );
    } else if (
      _params.data.status === "INTERVIEW_SCHEDULED" &&
      selectedStatus === "PHONG_VAN"
    ) {
      return (
        <Tooltip title="Chi tiết lịch phỏng vấn">
          <FcViewDetails
            className="tool-icon interview-icon"
            size={30}
            onClick={() => handleOpenInterviewListModal(_params)}
          />
        </Tooltip>
      );
    } else if (selectedStatus === "NHAN_VIEC") {
      return (
        <Tooltip title="Hẹn nhận việc">
          <FaPlusCircle
            className="tool-icon offer-icon"
            size={30}
            onClick={() => handleOpenJobOfferModal(_params)}
          />
        </Tooltip>
      );
    } else if (selectedStatus === "HOP_DONG") {
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
            <ListJob
              onJobCardClick={(jobId?: number | null) => {
                const jobIdStr = String(jobId ?? "");
                setJobId(jobIdStr);
              }}
            />
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
              rowData={rowData}
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
                hideAdd: selectedStatus !== "LIEN_HE" ? true : false,
                hideDelete: selectedStatus !== "LIEN_HE" ? true : false,
                hideDivider: selectedStatus !== "LIEN_HE" ? true : false,
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

      {/* Interview list modal for scheduled items */}
      {/* Lazy load component to avoid bundle bloat - import at top dynamically if needed */}
      {listModalOpen && (
        <React.Suspense>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <InterviewListModal
            open={listModalOpen}
            onClose={() => setListModalOpen(false)}
            candidateId={selectedCandidate?.id}
            candidateName={selectedCandidate?.fullName}
          />
        </React.Suspense>
      )}

      {/* Job Creation Modal */}
      <JobCreationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleContractSuccess}
        selectOptions={{ selectRole, selectSkill, selectExperience }}
      />

      {/* Success Modal */}
      <SuccessModal
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
        jobLink={contractLink}
      />

      {/* PHONG_VAN Schedule Modal */}
      <InterviewScheduleModal
        open={interviewModalOpen}
        onClose={handleCloseInterviewModal}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id || "",
                fullName: selectedCandidate.fullName || "",
                email: selectedCandidate.email || "",
                phone: selectedCandidate.phone || "",
              }
            : undefined
        }
      />

      {/* Job NHAN_VIEC Modal */}
      <JobOfferModal
        open={jobOfferModalOpen}
        onClose={handleCloseJobOfferModal}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id || "",
                fullName: selectedCandidate.fullName || "",
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
                fullName: selectedCandidate.fullName || "",
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
