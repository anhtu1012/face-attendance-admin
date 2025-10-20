/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import { useRecruitmentSocket } from "@/hooks/useRecruitmentSocket";
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
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { GoReport } from "react-icons/go";
import { useSelector } from "react-redux";
import InterviewListModal from "./_components/InterviewListModal/InterviewListModal";
import InterviewScheduleModal from "./_components/InterviewScheduleModal/InterviewScheduleModal";
import JobCreationModal from "./_components/JobCreationModal/JobCreationModal";
import "./_components/JobCreationModal/JobCreationModal.scss";
import "./_components/JobDetailModal/JobDetailModal.scss";
import JobOfferModal from "./_components/JobOfferModal/JobOfferModal";
import LeaderReportModal from "./_components/LeaderReportModal/LeaderReportModal";
import "./_components/LeaderReportModal/LeaderReportModal.scss";
import ListJob from "./_components/ListJob/ListJob";
import SuccessModal from "./_components/SuccessModal/SuccessModal";
import "./_components/SuccessModal/SuccessModal.scss";
import "./index.scss";
dayjs.extend(relativeTime);
dayjs.locale("vi");

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
  const [quantityStatus, setQuantityStatus] = useState<Record<
    string,
    number
  > | null>(null);
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
  const [newJobIds, setNewJobIds] = useState<Set<string>>(new Set());
  // Track new count for each status tab
  const [newCounts, setNewCounts] = useState<Record<string, number>>({
    LIEN_HE: 0,
    PHONG_VAN: 0,
    NHAN_VIEC: 0,
    HOP_DONG: 0,
  });

  const segmentedOptions = useMemo(() => {
    // Helper to show count if available
    const withCount = (label: string, key?: string) => {
      const count =
        key && quantityStatus && quantityStatus[key] !== undefined
          ? ` (${quantityStatus[key]})`
          : "";
      return `${label}${count}`;
    };

    // Helper to create label with badge
    const withBadge = (
      label: string,
      statusKey: string,
      quantityKey?: string
    ) => {
      const baseLabel = withCount(label, quantityKey);
      const newCount = newCounts[statusKey] || 0;

      if (newCount > 0) {
        return (
          <span>
            {baseLabel}
            <span
              className="segmented-new-badge"
              style={{
                position: "absolute",
                top: "-3px",
                right: "-7px",
                background: "linear-gradient(135deg, #ff4081 0%, #ff6e40 100%)",
                color: "white",
                fontSize: "10px",
                fontWeight: "700",
                padding: "2px 6px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(255, 64, 129, 0.5)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              {newCount}
            </span>
          </span>
        );
      }

      return baseLabel;
    };

    return [
      {
        label: withBadge("Liên hệ", "LIEN_HE", "toContactQuantity"),
        value: "LIEN_HE",
      },
      {
        label: withBadge("Phỏng vấn", "PHONG_VAN", "toInterviewQuantity"),
        value: "PHONG_VAN",
      },
      {
        label: withBadge("Nhận việc", "NHAN_VIEC", "toJobOfferedQuantity"),
        value: "NHAN_VIEC",
      },
      {
        label: withBadge("Hợp đồng", "HOP_DONG", "toContractQuantity"),
        value: "HOP_DONG",
      },
      { label: withCount("Hủy hẹn"), value: "HUY_HEN" },
      { label: withCount("Chưa phù hợp"), value: "CHUA_PHU_HOP" },
      { label: withCount("Hoàn thành"), value: "HOAN_THANH" },
    ];
  }, [quantityStatus, newCounts]);

  // Sử dụng custom hook để xử lý socket events
  useRecruitmentSocket({
    jobId,
    selectedStatus,
    onNewCandidate: (newJobId, candidateInfo) => {
      console.log("aaa", newJobId);
      console.log("aabb", candidateInfo);

      // Mark this job as having new candidates
      setNewJobIds((prev) => new Set(prev).add(String(newJobId)));

      // If this is the currently selected job, update the quantity and add to grid
      if (String(jobId) === String(newJobId)) {
        // Update quantity status
        setQuantityStatus((prev) => {
          if (!prev) return { toContactQuantity: 1 };
          return {
            ...prev,
            toContactQuantity: Number(prev.toContactQuantity || 0) + 1,
          };
        });

        // Increment new count for LIEN_HE tab
        setNewCounts((prev) => ({
          ...prev,
          LIEN_HE: Number(prev.LIEN_HE || 0) + 1,
        }));

        // If we're on LIEN_HE tab and status is TO_CONTACT, add to grid
        if (
          selectedStatus === "LIEN_HE" &&
          candidateInfo.status === "TO_CONTACT"
        ) {
          setRowData((prev) => [candidateInfo, ...prev]);
          setTotalItems((prev) => prev + 1);
        }
      }
    },
    onCandidateStatusChanged: (affectedJobId, candidateId, newStatus) => {
      console.log(`Candidate ${candidateId} status changed to ${newStatus}`);
      // Có thể thêm logic cập nhật UI khi status thay đổi
    },
    onInterviewScheduled: (affectedJobId, candidateId) => {
      console.log(`Interview scheduled for candidate ${candidateId}`);
      // Có thể thêm notification hoặc refresh data
    },
    onJobOfferSent: (affectedJobId, candidateId) => {
      console.log(`Job offer sent to candidate ${candidateId}`);
      // Có thể thêm notification hoặc refresh data
    },
  });

  const itemErrorsFromRedux = useSelector(selectAllItemErrors);
  const hasItemFieldError = useHasItemFieldError(itemErrorsFromRedux);
  const itemErrorCellStyle = useItemErrorCellStyle(hasItemFieldError);
  const {
    selectGender,
    selectSkill,
    selectRole,
    selectExperience,
    selectCandidate,
    selectDepartment,
  } = useSelectData({
    fetchSkill: true,
    fetchRole: true,
    fetchDepartment: true,
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
        width: 150,
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
            INTERVIEW_SCHEDULED: "#0288D1", // light blue
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
        width: 220,
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
        field: "createdAt",
        headerName: t("createdAt"),
        editable: false,
        width: 180,
        // show relative time like "2 phút trước", with tooltip for exact time
        valueFormatter: (params) => {
          const v = params.value;
          if (!v) return "";
          try {
            return dayjs(v).fromNow();
          } catch {
            return String(v);
          }
        },
        tooltipValueGetter: (params) => {
          const v = params.value;
          if (!v) return "";
          try {
            return dayjs(v).format("DD/MM/YYYY HH:mm:ss");
          } catch {
            return String(v);
          }
        },
      },
      {
        field: "birthday",
        headerName: t("birthDay"),
        editable: true,
        width: 190,
        context: {
          typeColumn: "Date",
          dateFormat: "YYYY-MM-DD",
          timeFormat: "",
        },
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "birthday", params);
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
    [t, selectGender, selectCandidate, itemErrorCellStyle]
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

  const handleChangeStatusToInterview = async (
    _params: any,
    status: "TO_INTERVIEW" | "CANNOT_CONTACT" | "INTERVIEW_REJECTED"
  ) => {
    if (!_params || !_params.data) {
      messageApi.warning("Vui lòng chọn ứng viên!");
      return;
    }

    const candidate = _params.data;
    const id = candidate.id;
    if (!id) {
      messageApi.error("Không tìm thấy id ứng viên");
      return;
    }

    try {
      setLoading(true);
      await TuyenDungServices.updateStatusUngVien(id, status);

      // If moving from LIEN_HE -> PHONG_VAN (TO_INTERVIEW), update quantityStatus counts optimistically
      if (status === "TO_INTERVIEW") {
        setQuantityStatus((prev) => {
          if (!prev) return prev;
          const prevToContact = Number(prev.toContactQuantity || 0);
          const prevToInterview = Number(prev.toInterviewQuantity || 0);
          return {
            ...prev,
            toContactQuantity: Math.max(prevToContact - 1, 0),
            toInterviewQuantity: prevToInterview + 1,
          } as Record<string, number>;
        });

        // Also decrement newCounts for LIEN_HE and increment for PHONG_VAN (if applicable)
        setNewCounts((prev) => ({
          ...prev,
          LIEN_HE: Math.max(Number(prev.LIEN_HE || 0) - 1, 0),
          PHONG_VAN: Number(prev.PHONG_VAN || 0) + 1,
        }));
      }

      const successMsg =
        status === "CANNOT_CONTACT"
          ? "Đã đánh dấu không liên hệ được"
          : "Đã chuyển sang trạng thái phỏng vấn";
      messageApi.success(successMsg);

      // refresh current page
      handleFetchUser(currentPage, pageSize, quickSearchText);
    } catch (error: any) {
      showError(error.response?.data?.message || mes("fetchError"));
    } finally {
      setLoading(false);
    }
  };
  const hanldeViewSuccess = () => {
    // Update quantity status: decrement PHONG_VAN count
    setQuantityStatus((prev) => {
      if (!prev) return prev;
      const prevToInterview = Number(prev.toInterviewQuantity || 0);
      return {
        ...prev,
        toInterviewQuantity: Math.max(prevToInterview - 1, 0),
      } as Record<string, number>;
    });

    // Decrement newCounts for PHONG_VAN
    setNewCounts((prev) => ({
      ...prev,
      PHONG_VAN: Math.max(Number(prev.PHONG_VAN || 0) - 1, 0),
    }));

    // Refresh the grid
    handleFetchUser(currentPage, pageSize, quickSearchText);
  };

  const buttonProps = (_params: any) => {
    if (selectedStatus === "LIEN_HE") {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Tooltip title="Không liên hệ được">
            <AiOutlineCloseCircle
              className="tool-icon cannot-contact-icon"
              size={26}
              style={{ color: "#c62828" }}
              onClick={() =>
                handleChangeStatusToInterview(_params, "CANNOT_CONTACT")
              }
            />
          </Tooltip>
          <Tooltip title="Chuyển đến phỏng vấn">
            <BiSolidSkipNextCircle
              className="tool-icon interview-icon"
              size={30}
              onClick={() =>
                handleChangeStatusToInterview(_params, "TO_INTERVIEW")
              }
            />
          </Tooltip>
        </div>
      );
    } else if (
      selectedStatus === "PHONG_VAN" &&
      _params.data.status === "TO_INTERVIEW"
    ) {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Tooltip title="Từ chối phỏng vấn">
            <AiOutlineCloseCircle
              className="tool-icon cannot-contact-icon"
              size={26}
              style={{ color: "#c62828" }}
              onClick={() =>
                handleChangeStatusToInterview(_params, "INTERVIEW_REJECTED")
              }
            />
          </Tooltip>
          <Tooltip title="Tạo lịch hẹn">
            <FaPlusCircle
              className="tool-icon interview-icon"
              size={30}
              onClick={() => handleOpenInterviewModal(_params)}
            />
          </Tooltip>
        </div>
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
              style={{
                position: "absolute",
                top: 13,
                right: 10,
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {/* Create Job Button */}
              <FaPlusCircle
                size={30}
                style={{
                  color: "orange",
                  boxShadow:
                    "0 0 30px rgba(227, 141, 48, 0.8), 0 0 100px rgba(227, 141, 48, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  zIndex: 1000,
                  cursor: "pointer",
                }}
                title="Tạo công việc"
                onClick={handleOpenModal}
              />
            </div>
            <ListJob
              onJobCardClick={(
                clickedJobId?: number | null,
                qs?: Record<string, number> | null
              ) => {
                const jobIdStr = String(clickedJobId ?? "");
                const prevJobIdStr = String(jobId ?? "");
                const selectingDifferentJob = jobIdStr !== prevJobIdStr;

                setJobId(jobIdStr);

                // If the user deselected (clicked same card to clear), clear quantityStatus
                if (clickedJobId == null) {
                  setQuantityStatus(null);
                  return;
                }

                // If selecting a different job, replace quantityStatus with server-provided qs
                if (selectingDifferentJob) {
                  setQuantityStatus(qs ?? null);
                  return;
                }

                // If selecting the same job again (e.g. opening detail), preserve any optimistic local counts
                setQuantityStatus((prev) => prev ?? qs ?? null);
              }}
              newJobIds={newJobIds}
              onClearNewBadge={(jobId) => {
                setNewJobIds((prev) => {
                  const next = new Set(prev);
                  next.delete(jobId);
                  return next;
                });
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
                onChange={(value) => {
                  const newStatus = value as string;
                  setSelectedStatus(newStatus);

                  // Reset new count for this tab when user views it
                  setNewCounts((prev) => ({
                    ...prev,
                    [newStatus]: 0,
                  }));
                }}
              />
            </div>
            <AgGridComponentWrapper
              showSearch={true}
              rowData={dataGrid.rowData}
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
              onSelectionChanged={dataGrid.onSelectionChanged}
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
        selectOptions={{
          selectRole,
          selectSkill,
          selectExperience,
          selectDepartment,
        }}
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
        jobId={jobId}
        onSuccess={hanldeViewSuccess}
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
