/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AIAnalysisResultModal from "@/components/AIAnalysisResultModal/AIAnalysisResultModal";
import Cbutton from "@/components/basicUI/Cbutton";
import AgGridComponentWrapper from "@/components/basicUI/cTableAG";
import IsExistedCellRenderer from "@/components/basicUI/cTableAG/components/IsExistedCellRenderer";
import LayoutContent from "@/components/LayoutContentForder/layoutContent";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { useAntdMessage } from "@/hooks/AntdMessageProvider";
import { useDataGridOperations } from "@/hooks/useDataGridOperations";
import { showError } from "@/hooks/useNotification";
import { useRecruitmentSocket } from "@/hooks/useRecruitmentSocket";
import { useSelectData } from "@/hooks/useSelectData";
import { selectAllItemErrors } from "@/lib/store/slices/validationErrorsSlice";
import QuanLyPhongVanServices from "@/services/tac-vu-nhan-su/quan-ly-phong-van/quan-ly-phong-van.service";
import JobServices from "@/services/tac-vu-nhan-su/tuyen-dung/job/job.service";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";
import {
  getItemId,
  useHasItemFieldError,
  useItemErrorCellStyle,
} from "@/utils/client/validationHelpers";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Dropdown, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { DiGoogleAnalytics } from "react-icons/di";
import { FaPlusCircle } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { GoReport } from "react-icons/go";
import {
  MdAccessTime,
  MdCancel,
  MdCheckCircle,
  MdExpandMore,
  MdListAlt,
  MdRefresh,
  MdSchedule,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { ReportListModal } from "../_shared/AppointmentDetailTabs/components";
import InterviewListModal from "./_components/InterviewListModal/InterviewListModal";
import InterviewScheduleModal from "./_components/InterviewScheduleModal/InterviewScheduleModal";
import JobCreationModal from "./_components/JobCreationModal/JobCreationModal";
import "./_components/JobCreationModal/JobCreationModal.scss";
import "./_components/JobDetailModal/JobDetailModal.scss";
import JobOfferModal from "./_components/JobOfferModal/JobOfferModal";
import "./_components/LeaderReportModal/LeaderReportModal.scss";
import ListJob from "./_components/ListJob/ListJob";
import SuccessModal from "./_components/SuccessModal/SuccessModal";
import "./_components/SuccessModal/SuccessModal.scss";
import {
  handleBatchStatusChange as batchStatusChange,
  handleBatchSchedule,
} from "./_helpers/batchHandlers";
import { getSelectionActionButtons } from "./_helpers/selectionActionButtons";
import "./index.scss";
dayjs.extend(relativeTime);
dayjs.locale("vi");

import { GrPowerReset } from "react-icons/gr";
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
  const [interviewSubFilter, setInterviewSubFilter] = useState<string>("ALL");
  const [quantityStatus, setQuantityStatus] = useState<Record<
    string,
    number
  > | null>(null);
  const [isProcessCollapsed, setIsProcessCollapsed] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [jobOfferModalOpen, setJobOfferModalOpen] = useState(false);
  const [leaderReportModalOpen, setLeaderReportModalOpen] = useState(false);
  const [aiAnalysisModalOpen, setAiAnalysisModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<
    TuyenDungItem | TuyenDungItem[] | null
  >(null);
  const messageApi = useAntdMessage();
  const [contractLink, setContractLink] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [listModalOpen, setListModalOpen] = useState(false);
  const [newJobIds, setNewJobIds] = useState<Set<string>>(new Set());
  const [reportListCandidate, setReportListCandidate] =
    useState<TuyenDungItem | null>(null);
  const [reportList, setReportList] = useState<any[]>([]);

  // Track new count for each status tab
  const [newCounts, setNewCounts] = useState<Record<string, number>>({
    LIEN_HE: 0,
    PHONG_VAN: 0,
    NHAN_VIEC: 0,
    HOP_DONG: 0,
  });

  // Sử dụng custom hook để xử lý socket events
  useRecruitmentSocket({
    jobId,
    selectedStatus,
    onNewCandidate: (newJobId, candidateInfo) => {
      setNewJobIds((prev) => new Set(prev).add(String(newJobId)));

      // Increment new count for the appropriate tab depending on candidate status
      setNewCounts((prev) => {
        const next = { ...(prev || {}) } as Record<string, number>;
        // map single statuses to tab keys
        const statusMap: Record<string, string> = {
          TO_CONTACT: "LIEN_HE",
          CONTRACT_SIGNING: "HOP_DONG",
          JOB_OFFERED: "NHAN_VIEC",
        };

        // interview-related statuses map to PHONG_VAN
        const interviewStatuses = [
          "TO_INTERVIEW",
          "TO_INTERVIEW_R1",
          "TO_INTERVIEW_R2",
          "TO_INTERVIEW_R3",
          "TO_INTERVIEW_R4",
          "TO_INTERVIEW_R5",
          "INTERVIEW_RESCHEDULED",
          "INTERVIEW_FAILED",
          "NOT_COMING_INTERVIEW",
          "INTERVIEW_SCHEDULED",
          "INTERVIEW_SCHEDULED_R1",
          "INTERVIEW_SCHEDULED_R2",
          "INTERVIEW_SCHEDULED_R3",
          "INTERVIEW_SCHEDULED_R4",
          "INTERVIEW_SCHEDULED_R5",
        ];

        let key = statusMap[candidateInfo.status];
        if (!key && interviewStatuses.includes(candidateInfo.status)) {
          key = "PHONG_VAN";
        }

        if (!key) return next; // nothing to increment for other statuses

        next[key] = Number(next[key] || 0) + 1;
        return next;
      });

      // Update quantityStatus based on candidate status
      setQuantityStatus((prev) => {
        if (!prev) return prev;
        const next = { ...prev };

        // Determine which quantity to update based on status
        switch (candidateInfo.status) {
          case "TO_CONTACT":
            // New candidate in contact stage
            next.toContactQuantity = Number(next.toContactQuantity || 0) + 1;
            break;

          case "TO_INTERVIEW":
          case "TO_INTERVIEW_R1":
          case "TO_INTERVIEW_R2":
          case "TO_INTERVIEW_R3":
          case "TO_INTERVIEW_R4":
          case "TO_INTERVIEW_R5":
            // Candidate moved to interview stage (not scheduled yet)
            // These are candidates waiting to be scheduled for interview
            next.toInterviewQuantity =
              Number(next.toInterviewQuantity || 0) + 1;
            break;

          case "INTERVIEW_SCHEDULED":
          case "INTERVIEW_SCHEDULED_R1":
          case "INTERVIEW_SCHEDULED_R2":
          case "INTERVIEW_SCHEDULED_R3":
          case "INTERVIEW_SCHEDULED_R4":
          case "INTERVIEW_SCHEDULED_R5":
            // Interview scheduled - decrease toInterviewQuantity (moved from waiting to scheduled)
            next.toInterviewQuantity = Math.max(
              Number(next.toInterviewQuantity || 0) - 1,
              0
            );
            break;

          case "JOB_OFFERED":
          case "JOB_SCHEDULED":
            // Candidate passed all interviews and received job offer
            next.toJobOfferedQuantity =
              Number(next.toJobOfferedQuantity || 0) + 1;
            break;

          case "CONTRACT_SIGNING":
            // Candidate accepted job offer and moved to contract stage
            next.toContractQuantity = Number(next.toContractQuantity || 0) + 1;
            // Decrease job offered count as they moved to contract
            next.toJobOfferedQuantity = Math.max(
              Number(next.toJobOfferedQuantity || 0) - 1,
              0
            );
            break;

          case "INTERVIEW_FAILED":
          case "NOT_COMING_INTERVIEW":
          case "INTERVIEW_REJECTED":
          case "OFFER_REJECTED":
          case "NOT_COMING_OFFER":
          case "REJECTED":
          case "NOT_SUITABLE":
          case "CANNOT_CONTACT":
            // Failed/rejected statuses - these don't affect the main process counts
            // They are filtered out from the main process flow
            break;

          case "INTERVIEW_RESCHEDULED":
            // Rescheduled interview - back to waiting list
            next.toInterviewQuantity =
              Number(next.toInterviewQuantity || 0) + 1;
            break;

          default:
            // Unknown status, no change
            break;
        }

        return next;
      });

      if (String(jobId) === String(newJobId)) {
        // If we're on LIEN_HE tab and status is TO_CONTACT, add to grid
        if (
          selectedStatus === "LIEN_HE" &&
          candidateInfo.status === "TO_CONTACT"
        ) {
          setRowData((prev) => [candidateInfo, ...prev]);
          setTotalItems((prev) => prev + 1);
        }

        // If we're on HOP_DONG tab and status is CONTRACT_SIGNING, add to grid
        if (
          selectedStatus === "HOP_DONG" &&
          candidateInfo.status === "CONTRACT_SIGNING"
        ) {
          setRowData((prev) => [candidateInfo, ...prev]);
          setTotalItems((prev) => prev + 1);
        }

        // If we're on PHONG_VAN tab and status is interview-related, update existing row
        if (selectedStatus === "PHONG_VAN") {
          const interviewStatuses = [
            "TO_INTERVIEW",
            "TO_INTERVIEW_R1",
            "TO_INTERVIEW_R2",
            "TO_INTERVIEW_R3",
            "TO_INTERVIEW_R4",
            "TO_INTERVIEW_R5",
            "INTERVIEW_RESCHEDULED",
            "INTERVIEW_FAILED",
            "NOT_COMING_INTERVIEW",
            "INTERVIEW_SCHEDULED",
            "INTERVIEW_SCHEDULED_R1",
            "INTERVIEW_SCHEDULED_R2",
            "INTERVIEW_SCHEDULED_R3",
            "INTERVIEW_SCHEDULED_R4",
            "INTERVIEW_SCHEDULED_R5",
          ];

          if (interviewStatuses.includes(candidateInfo.status)) {
            setRowData((prev) =>
              prev.map((row) =>
                row.id === candidateInfo.id ? candidateInfo : row
              )
            );
          }
        }

        // If we're on NHAN_VIEC tab and status is JOB_OFFERED, add to grid
        if (
          selectedStatus === "NHAN_VIEC" &&
          candidateInfo.status === "JOB_OFFERED"
        ) {
          setRowData((prev) => [candidateInfo, ...prev]);
          setTotalItems((prev) => prev + 1);
        }
      }
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

        // Client-side filtering for interview sub-filter
        let filteredData = response.data;
        if (selectedStatus === "PHONG_VAN" && interviewSubFilter !== "ALL") {
          const subFilterMap: Record<string, string[]> = {
            CHO_PV: ["TO_INTERVIEW"],
            DA_HEN: [
              "INTERVIEW_SCHEDULED",
              "INTERVIEW_SCHEDULED_R1",
              "INTERVIEW_SCHEDULED_R2",
              "INTERVIEW_SCHEDULED_R3",
              "INTERVIEW_SCHEDULED_R4",
              "INTERVIEW_SCHEDULED_R5",
            ],
            DA_HEN_R1: ["INTERVIEW_SCHEDULED_R1"],
            DA_HEN_R2: ["INTERVIEW_SCHEDULED_R2"],
            DA_HEN_R3: ["INTERVIEW_SCHEDULED_R3"],
            DA_HEN_R4: ["INTERVIEW_SCHEDULED_R4"],
            DA_HEN_R5: ["INTERVIEW_SCHEDULED_R5"],
            DAU_VONG: [
              "TO_INTERVIEW_R1",
              "TO_INTERVIEW_R2",
              "TO_INTERVIEW_R3",
              "TO_INTERVIEW_R4",
              "TO_INTERVIEW_R5",
            ],
            DAU_VONG_R1: ["TO_INTERVIEW_R1"],
            DAU_VONG_R2: ["TO_INTERVIEW_R2"],
            DAU_VONG_R3: ["TO_INTERVIEW_R3"],
            DAU_VONG_R4: ["TO_INTERVIEW_R4"],
            DAU_VONG_R5: ["TO_INTERVIEW_R5"],
            THAT_BAI: [
              "INTERVIEW_FAILED",
              "NOT_COMING_INTERVIEW",
              "INTERVIEW_REJECTED",
            ],
            HEN_LAI: ["INTERVIEW_RESCHEDULED"],
          };

          const allowedStatuses = subFilterMap[interviewSubFilter] || [];
          filteredData = response.data.filter((item: TuyenDungItem) =>
            allowedStatuses.includes(item.status || "")
          );
        }

        // Sort by interview rounds for PHONG_VAN tab
        if (selectedStatus === "PHONG_VAN") {
          const getRoundPriority = (status: string) => {
            const priorityMap: Record<string, number> = {
              // Waiting - highest priority
              TO_INTERVIEW: 1,

              // Scheduled interviews - by round
              INTERVIEW_SCHEDULED: 10,
              INTERVIEW_SCHEDULED_R1: 11,
              INTERVIEW_SCHEDULED_R2: 12,
              INTERVIEW_SCHEDULED_R3: 13,
              INTERVIEW_SCHEDULED_R4: 14,
              INTERVIEW_SCHEDULED_R5: 15,

              // Passed interviews - by round
              TO_INTERVIEW_R1: 20,
              TO_INTERVIEW_R2: 21,
              TO_INTERVIEW_R3: 22,
              TO_INTERVIEW_R4: 23,
              TO_INTERVIEW_R5: 24,

              // Rescheduled
              INTERVIEW_RESCHEDULED: 30,

              // Failed interviews
              INTERVIEW_FAILED: 40,
              NOT_COMING_INTERVIEW: 41,
              INTERVIEW_REJECTED: 42,
            };
            return priorityMap[status] || 999;
          };

          filteredData.sort((a, b) => {
            const priorityA = getRoundPriority(a.status || "");
            const priorityB = getRoundPriority(b.status || "");

            // First sort by priority
            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            // Then by created date (newest first)
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          });
        }

        setRowData(filteredData);
        setTotalItems(filteredData.length);
      } catch (error: any) {
        showError(error.response?.data?.message || mes("fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [currentPage, jobId, mes, pageSize, selectedStatus, interviewSubFilter]
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "status",
        headerName: t("isActive"),
        editable: false,
        width: 200,
        filter: false,
        context: {
          typeColumn: "Tag",
          selectOptions: selectCandidate,
        },
        cellRendererParams: {
          colorMap: {
            // Liên hệ - Blue tones
            TO_CONTACT: "#1976D2",
            CANNOT_CONTACT: "#9E9E9E",

            // Phỏng vấn chờ xử lý - Purple tones
            TO_INTERVIEW: "#7B1FA2",

            // Đã hẹn phỏng vấn - Light Blue tones (theo vòng)
            INTERVIEW_SCHEDULED: "#0288D1",
            INTERVIEW_SCHEDULED_R1: "#29B6F6",
            INTERVIEW_SCHEDULED_R2: "#4FC3F7",
            INTERVIEW_SCHEDULED_R3: "#81D4FA",
            INTERVIEW_SCHEDULED_R4: "#B3E5FC",
            INTERVIEW_SCHEDULED_R5: "#E1F5FE",

            // Đậu phỏng vấn - Green tones (theo vòng, xanh đậm dần)
            TO_INTERVIEW_R1: "#66BB6A",
            TO_INTERVIEW_R2: "#4CAF50",
            TO_INTERVIEW_R3: "#43A047",
            TO_INTERVIEW_R4: "#388E3C",
            TO_INTERVIEW_R5: "#2E7D32",

            // Phỏng vấn thất bại - Red tones
            INTERVIEW_FAILED: "#E53935",
            NOT_COMING_INTERVIEW: "#D32F2F",
            INTERVIEW_REJECTED: "#FF5252",

            // Hẹn lại - Orange
            INTERVIEW_RESCHEDULED: "#FB8C00",

            // Nhận việc - Teal
            JOB_OFFERED: "#00796B",
            JOB_SCHEDULED: "#00897B",

            // Hợp đồng - Purple
            CONTRACT_SIGNING: "#6A1B9A",

            // Từ chối/Không phù hợp - Grey/Red
            OFFER_REJECTED: "#C62828",
            NOT_COMING_OFFER: "#B71C1C",
            REJECTED: "#C62828",
            NOT_SUITABLE: "#9E9E9E",

            // Hoàn thành - Dark Green
            HOAN_THANH: "#1B5E20",
          },
        },
      },
      {
        field: "analysisResult.matchScore",
        headerName: " Tỉ lệ (%)",
        editable: false,
        width: 100,
        filter: false,
        context: {
          typeColumn: "Tag",
        },
      },
      {
        field: "fullName",
        headerName: t("fullName"),
        editable: false,
        width: 170,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "fullName", params);
        },
      },
      {
        field: "email",
        headerName: "Email",
        context: { typeColumn: "Text", inputType: "email", maxLength: 100 },
        editable: false,
        width: 250,
        cellStyle: (params) => {
          const itemId = params.data ? getItemId(params.data) : "";
          return itemErrorCellStyle(itemId, "email", params);
        },
      },

      {
        field: "gender",
        headerName: t("gender"),
        editable: false,
        width: 150,
        context: {
          typeColumn: "Select",
          selectOptions: selectGender,
        },
      },
      {
        field: "phone",
        headerName: t("phone"),
        editable: false,
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
        editable: false,
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
      {
        field: "isExisted",
        headerName: "TT Ứng Viên",
        editable: false,
        width: 150,
        filter: false,
        cellRenderer: IsExistedCellRenderer,
        cellStyle: { display: "flex", justifyContent: "center" },
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

  const handleCloseJobOfferModal = () => {
    setJobOfferModalOpen(false);
    setSelectedCandidate(null);
  };
  const fetchReportList = async (
    candidateId?: string,
    candidate?: TuyenDungItem
  ) => {
    if (!candidateId) return;
    try {
      const response = await QuanLyPhongVanServices.getReportDetail(
        [],
        undefined,
        {
          intervieweeId: candidateId,
        }
      );
      setReportList(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      setReportListCandidate(candidate || null);
    } catch (error) {
      console.error("Error fetching report list:", error);
      messageApi.error("Không thể tải danh sách báo cáo");
    }
  };

  // Leader report modal handlers
  const handleOpenLeaderReportModal = (_params: any) => {
    const data: TuyenDungItem = _params?.data;
    if (data) {
      if (data && data.id) {
        fetchReportList(String(data.id), data);
        setSelectedCandidate(data);
        setLeaderReportModalOpen(true);
      } else {
        messageApi.warning("Vui lòng chọn nhân viên hợp lệ để xem báo cáo!");
      }
    } else {
      messageApi.warning("Vui lòng chọn nhân viên để xem báo cáo!");
    }
  };

  const handleCloseLeaderReportModal = () => {
    setLeaderReportModalOpen(false);
    setSelectedCandidate(null);
    setReportListCandidate(null);
    setReportList([]);
  };

  const dataGrid = useDataGridOperations<TuyenDungItem>({
    gridRef,
    createNewItem: (i) => ({
      unitKey: `${Date.now()}_${i}`,
      fullName: "",
      email: "",
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

  // Handle batch status change for selected candidates (wrapper)
  const handleBatchStatusChange = async (
    selectedRows: TuyenDungItem[],
    status:
      | "TO_INTERVIEW"
      | "CANNOT_CONTACT"
      | "INTERVIEW_REJECTED"
      | "HOAN_THANH"
  ) => {
    await batchStatusChange({
      selectedRows,
      status,
      setLoading,
      setQuantityStatus,
      setNewCounts,
      messageApi,
      handleFetchUser,
      currentPage,
      pageSize,
      quickSearchText,
    });
  };

  // Handle batch interview scheduling (wrapper)
  const handleBatchInterviewSchedule = async (
    selectedRows: TuyenDungItem[]
  ) => {
    await handleBatchSchedule({
      selectedRows,
      messageApi,
      setSelectedCandidate: (candidate) => setSelectedCandidate(candidate),
      setModalOpen: setInterviewModalOpen,
      modalType: "interview",
    });
  };

  // Handle batch job offer scheduling (wrapper)
  const handleBatchJobOffer = async (selectedRows: TuyenDungItem[]) => {
    await handleBatchSchedule({
      selectedRows,
      messageApi,
      setSelectedCandidate: (candidate) => setSelectedCandidate(candidate),
      setModalOpen: setJobOfferModalOpen,
      modalType: "jobOffer",
    });
  };

  // Handle batch cancel job offer
  const handleBatchCancelJobOffer = async (selectedRows: TuyenDungItem[]) => {
    if (selectedRows.length === 0) {
      messageApi.warning("Vui lòng chọn ít nhất một ứng viên!");
      return;
    }

    try {
      setLoading(true);

      // TODO: Implement API call to cancel job offer
      // await TuyenDungServices.cancelJobOffer(selectedRows.map(r => r.id));

      messageApi.success(
        `Đã hủy nhận việc cho ${selectedRows.length} ứng viên`
      );

      // Update quantity status
      setQuantityStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          toJobOfferedQuantity: Math.max(
            Number(prev.toJobOfferedQuantity || 0) - selectedRows.length,
            0
          ),
        } as Record<string, number>;
      });

      // Update new counts
      setNewCounts((prev) => ({
        ...prev,
        NHAN_VIEC: Math.max(
          Number(prev.NHAN_VIEC || 0) - selectedRows.length,
          0
        ),
      }));

      // Refresh grid
      await handleFetchUser(currentPage, pageSize, quickSearchText);
    } catch (error: any) {
      showError(
        error.response?.data?.message || "Có lỗi xảy ra khi hủy nhận việc"
      );
    } finally {
      setLoading(false);
    }
  };
  const hanldeViewSuccess = (type: "interview" | "jobOffer" = "interview") => {
    // Update counts depending on the success type
    if (type === "interview") {
      setQuantityStatus((prev) => {
        if (!prev) return prev;
        const prevToInterview = Number(prev.toInterviewQuantity || 0);
        return {
          ...prev,
          toInterviewQuantity: Math.max(prevToInterview - 1, 0),
        } as Record<string, number>;
      });
      setNewCounts((prev) => ({
        ...prev,
        PHONG_VAN: Math.max(Number(prev.PHONG_VAN || 0) - 1, 0),
      }));
    } else if (type === "jobOffer") {
      setQuantityStatus((prev) => {
        if (!prev) return prev;
        const prevToJobOffered = Number(prev.toJobOfferedQuantity || 0);
        return {
          ...prev,
          toJobOfferedQuantity: Math.max(prevToJobOffered - 1, 0),
        } as Record<string, number>;
      });
      setNewCounts((prev) => ({
        ...prev,
        NHAN_VIEC: Math.max(Number(prev.NHAN_VIEC || 0) - 1, 0),
      }));
    }
    handleFetchUser(currentPage, pageSize, quickSearchText);
  };

  const hanldeJobCardClick = async (
    jobId: number | null,
    jobCode: string | null
  ) => {
    if (jobId == null || jobCode == null) return;
    setJobId(String(jobId));
    try {
      const res = await JobServices.getJobQuanlity([], undefined, {
        jobCode: jobCode,
      });

      const convertedData = {
        toContactQuantity: Number(res.toContactQuantity) || 0,
        toInterviewQuantity: Number(res.toInterviewQuantity) || 0,
        toJobOfferedQuantity: Number(res.toJobOfferedQuantity) || 0,
        toContractQuantity: Number(res.toContractQuantity) || 0,
      };
      setQuantityStatus(convertedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckRowActions = (node: any) => {
    if (!node?.data || !node.data?.status) return false;
    const selectableStatusMap: Record<string, string | string[] | undefined> = {
      LIEN_HE: "TO_CONTACT",
      PHONG_VAN: [
        "TO_INTERVIEW",
        "TO_INTERVIEW_R1",
        "TO_INTERVIEW_R2",
        "TO_INTERVIEW_R3",
        "TO_INTERVIEW_R4",
        "TO_INTERVIEW_R5",
        "INTERVIEW_RESCHEDULED",
      ],
      NHAN_VIEC: ["JOB_OFFERED", "JOB_SCHEDULED"],
      HOP_DONG: "CONTRACT_SIGNING",
      HUY_HEN: undefined,
      CHUA_PHU_HOP: undefined,
      HOAN_THANH: undefined,
    };

    let allowed: string[] = [];

    const mapped = selectableStatusMap[selectedStatus];
    if (mapped) {
      allowed = Array.isArray(mapped) ? mapped : [mapped];
    } else if (
      typeof selectedStatus === "string" &&
      selectedStatus.length > 0
    ) {
      if (selectedStatus.includes("_")) {
        allowed = [selectedStatus];
      }
    }
    if (allowed.length === 0) return false;
    const selectedRows: any[] = gridRef.current?.api?.getSelectedRows?.() ?? [];
    if (selectedRows.length === 0) {
      return allowed.includes(node.data.status);
    }
    const firstSelectedStatus = selectedRows[0]?.status;
    return (
      allowed.includes(node.data.status) &&
      firstSelectedStatus === node.data.status
    );
  };

  const buttonProps = (_params: any) => {
    // Default view details button that appears in all cases
    const defaultViewButton = (
      <Tooltip title="Xem chi tiết">
        <DiGoogleAnalytics
          className="tool-icon view-details-icon"
          size={26}
          onClick={() => {
            setSelectedCandidate(_params.data);
            setAiAnalysisModalOpen(true);
          }}
        />
      </Tooltip>
    );

    // PHONG_VAN - INTERVIEW_SCHEDULED: Show interview details button
    if (
      (_params.data.status === "INTERVIEW_SCHEDULED" ||
        _params.data.status === "INTERVIEW_SCHEDULED_R1" ||
        _params.data.status === "INTERVIEW_SCHEDULED_R2" ||
        _params.data.status === "INTERVIEW_SCHEDULED_R3" ||
        _params.data.status === "INTERVIEW_SCHEDULED_R4" ||
        _params.data.status === "INTERVIEW_SCHEDULED_R5" ||
        _params.data.status === "TO_INTERVIEW_R1" ||
        _params.data.status === "TO_INTERVIEW_R2" ||
        _params.data.status === "TO_INTERVIEW_R3" ||
        _params.data.status === "TO_INTERVIEW_R4" ||
        _params.data.status === "TO_INTERVIEW_R5" ||
        _params.data.status === "INTERVIEW_FAILED" ||
        _params.data.status === "INTERVIEW_RESCHEDULED") &&
      selectedStatus === "PHONG_VAN"
    ) {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {defaultViewButton}
          <Tooltip title="Chi tiết lịch phỏng vấn">
            <FcViewDetails
              className="tool-icon interview-icon"
              size={30}
              onClick={() => handleOpenInterviewListModal(_params)}
            />
          </Tooltip>
        </div>
      );
    }

    // HOP_DONG: Show leader report button
    if (selectedStatus === "HOP_DONG") {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {defaultViewButton}
          <Tooltip title="Xem báo cáo từ Leader">
            <GoReport
              className="tool-icon report-icon"
              size={26}
              style={{ color: "#1976d2" }}
              onClick={() => handleOpenLeaderReportModal(_params)}
            />
          </Tooltip>
        </div>
      );
    }

    // Default: Only show view details button for all other cases
    return defaultViewButton;
  };
  const resetButton = {
    return: (
      <>
        <Cbutton
          onClick={() => {
            handleFetchUser(currentPage, pageSize, quickSearchText);
          }}
          icon={
            <>
              <GrPowerReset />
            </>
          }
        >
          Làm mới
        </Cbutton>
      </>
    ),
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
              onJobCardClick={hanldeJobCardClick}
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
              <div
                className={`recruitment-process-flow ${
                  isProcessCollapsed ? "collapsed" : ""
                }`}
              >
                <div
                  className="process-title"
                  onClick={() => setIsProcessCollapsed(!isProcessCollapsed)}
                >
                  <MdListAlt size={24} />
                  <span>Quy trình tuyển dụng</span>
                  <MdExpandMore
                    className={`expand-icon ${
                      isProcessCollapsed ? "collapsed" : ""
                    }`}
                    size={24}
                  />
                </div>

                <div className="process-steps">
                  {[
                    {
                      key: "LIEN_HE",
                      icon: <MdAccessTime />,
                      label: "Liên hệ",
                      quantityKey: "toContactQuantity",
                      color: "#1890ff",
                      step: 1,
                    },
                    {
                      key: "PHONG_VAN",
                      icon: <MdSchedule />,
                      label: "Phỏng vấn",
                      quantityKey: "toInterviewQuantity",
                      color: "#722ed1",
                      step: 2,
                    },
                    {
                      key: "NHAN_VIEC",
                      icon: <MdCheckCircle />,
                      label: "Nhận việc",
                      quantityKey: "toJobOfferedQuantity",
                      color: "#52c41a",
                      step: 3,
                    },
                    {
                      key: "HOP_DONG",
                      icon: <MdCheckCircle />,
                      label: "Hợp đồng",
                      quantityKey: "toContractQuantity",
                      color: "#13c2c2",
                      step: 4,
                    },
                  ].map((stage, index, array) => {
                    const count = quantityStatus?.[stage.quantityKey] || 0;
                    const newCount = newCounts[stage.key] || 0;
                    const isActive = selectedStatus === stage.key;
                    const isCompleted =
                      array.findIndex((s) => s.key === selectedStatus) > index;

                    const displayCountLabel = (() => {
                      if (stage.key === "PHONG_VAN") {
                        return `${count} ứng viên chưa hẹn PV`;
                      }
                      if (stage.key === "NHAN_VIEC") {
                        return `${count} ứng viên chưa hẹn NV`;
                      }
                      return `${count} ứng viên`;
                    })();

                    return (
                      <React.Fragment key={stage.key}>
                        <div
                          className={`process-step ${
                            isActive ? "active" : ""
                          } ${isCompleted ? "completed" : ""}`}
                          onClick={() => {
                            setSelectedStatus(stage.key);
                            setInterviewSubFilter("ALL");
                            setNewCounts((prev) => ({
                              ...prev,
                              [stage.key]: 0,
                            }));
                          }}
                        >
                          <div className="step-number">{stage.step}</div>
                          <div
                            className="step-icon"
                            style={{
                              color: isActive ? stage.color : undefined,
                            }}
                          >
                            {stage.icon}
                          </div>
                          <div className="step-content">
                            <div className="step-label">{stage.label}</div>
                            <div className="step-count">
                              {displayCountLabel}
                            </div>
                          </div>
                          {newCount > 0 && (
                            <div className="step-badge">{newCount}</div>
                          )}
                          {isActive && <div className="step-indicator" />}
                        </div>
                        {index < array.length - 1 && (
                          <div
                            className={`step-connector ${
                              isCompleted ? "completed" : ""
                            }`}
                          >
                            <div className="connector-line" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="process-others">
                  <div className="others-label">Trạng thái khác:</div>
                  {[
                    { key: "HUY_HEN", label: "Hủy hẹn", icon: <MdCancel /> },
                    {
                      key: "CHUA_PHU_HOP",
                      label: "Chưa phù hợp",
                      icon: <MdCancel />,
                    },
                    {
                      key: "HOAN_THANH",
                      label: "Hoàn thành",
                      icon: <MdCheckCircle />,
                    },
                  ].map((status) => (
                    <button
                      key={status.key}
                      className={`other-status-btn ${
                        selectedStatus === status.key ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus(status.key);
                        setInterviewSubFilter("ALL");
                        setNewCounts((prev) => ({
                          ...prev,
                          [status.key]: 0,
                        }));
                      }}
                    >
                      {status.icon}
                      <span>{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Sub-Filter - Only show when PHONG_VAN tab is active */}
            {selectedStatus === "PHONG_VAN" && (
              <div className="interview-filter-pills">
                <div className="filter-title">
                  <MdListAlt className="title-icon" />
                  <span>Lọc theo trạng thái:</span>
                </div>
                <div className="pills-wrapper">
                  <button
                    className={`filter-pill ${
                      interviewSubFilter === "ALL" ? "active" : ""
                    }`}
                    onClick={() => {
                      setInterviewSubFilter("ALL");
                      setCurrentPage(1);
                    }}
                  >
                    <MdListAlt className="pill-icon" />
                    <span className="pill-text">Tất cả</span>
                    <div className="pill-glow"></div>
                  </button>

                  <button
                    className={`filter-pill ${
                      interviewSubFilter === "CHO_PV" ? "active" : ""
                    }`}
                    onClick={() => {
                      setInterviewSubFilter("CHO_PV");
                      setCurrentPage(1);
                    }}
                  >
                    <MdAccessTime className="pill-icon" />
                    <span className="pill-text">Chờ hẹn phỏng vấn</span>
                    <div className="pill-glow"></div>
                  </button>

                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "DA_HEN",
                          label: "Tất cả đã hẹn",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN");
                            setCurrentPage(1);
                          },
                        },
                        { type: "divider" },
                        {
                          key: "DA_HEN_R1",
                          label: "Vòng 1",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN_R1");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DA_HEN_R2",
                          label: "Vòng 2",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN_R2");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DA_HEN_R3",
                          label: "Vòng 3",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN_R3");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DA_HEN_R4",
                          label: "Vòng 4",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN_R4");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DA_HEN_R5",
                          label: "Vòng 5",
                          onClick: () => {
                            setInterviewSubFilter("DA_HEN_R5");
                            setCurrentPage(1);
                          },
                        },
                      ],
                      selectable: true,
                      selectedKeys: [interviewSubFilter],
                    }}
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <button
                      className={`filter-pill ${
                        interviewSubFilter.startsWith("DA_HEN") ? "active" : ""
                      }`}
                    >
                      <MdSchedule className="pill-icon" />
                      <span className="pill-text">Đã hẹn lịch</span>
                      <MdExpandMore className="expand-icon" />
                      <div className="pill-glow"></div>
                    </button>
                  </Dropdown>

                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "DAU_VONG",
                          label: "Tất cả đậu vòng",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG");
                            setCurrentPage(1);
                          },
                        },
                        { type: "divider" },
                        {
                          key: "DAU_VONG_R1",
                          label: "Vòng 1",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG_R1");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DAU_VONG_R2",
                          label: "Vòng 2",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG_R2");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DAU_VONG_R3",
                          label: "Vòng 3",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG_R3");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DAU_VONG_R4",
                          label: "Vòng 4",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG_R4");
                            setCurrentPage(1);
                          },
                        },
                        {
                          key: "DAU_VONG_R5",
                          label: "Vòng 5",
                          onClick: () => {
                            setInterviewSubFilter("DAU_VONG_R5");
                            setCurrentPage(1);
                          },
                        },
                      ],
                      selectable: true,
                      selectedKeys: [interviewSubFilter],
                    }}
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <button
                      className={`filter-pill ${
                        interviewSubFilter.startsWith("DAU_VONG")
                          ? "active"
                          : ""
                      }`}
                    >
                      <MdCheckCircle className="pill-icon" />
                      <span className="pill-text">Đậu các vòng</span>
                      <MdExpandMore className="expand-icon" />
                      <div className="pill-glow"></div>
                    </button>
                  </Dropdown>

                  <button
                    className={`filter-pill ${
                      interviewSubFilter === "THAT_BAI" ? "active" : ""
                    }`}
                    onClick={() => {
                      setInterviewSubFilter("THAT_BAI");
                      setCurrentPage(1);
                    }}
                  >
                    <MdCancel className="pill-icon" />
                    <span className="pill-text">Thất bại</span>
                    <div className="pill-glow"></div>
                  </button>

                  <button
                    className={`filter-pill ${
                      interviewSubFilter === "HEN_LAI" ? "active" : ""
                    }`}
                    onClick={() => {
                      setInterviewSubFilter("HEN_LAI");
                      setCurrentPage(1);
                    }}
                  >
                    <MdRefresh className="pill-icon" />
                    <span className="pill-text">Hẹn lại</span>
                    <div className="pill-glow"></div>
                  </button>
                </div>
              </div>
            )}

            <AgGridComponentWrapper
              showSearch={true}
              rowData={dataGrid.rowData}
              loading={loading}
              columnDefs={columnDefs}
              gridRef={gridRef}
              total={totalItems}
              paginationPageSize={pageSize}
              rowSelection={{
                mode: "multiRow",
                enableClickSelection: true,
                checkboxes: true,
                isRowSelectable: handleCheckRowActions,
              }}
              showSelectionInfoBar={true}
              selectionActionButtons={getSelectionActionButtons({
                selectedStatus,
                gridRef,
                messageApi,
                handleBatchStatusChange,
                handleBatchInterviewSchedule,
                handleBatchJobOffer,
                handleBatchCancelJobOffer,
              })}
              onCellValueChanged={dataGrid.onCellValueChanged}
              onSelectionChanged={dataGrid.onSelectionChanged}
              paginationCurrentPage={currentPage}
              pagination={true}
              maxRowsVisible={15}
              onChangePage={handlePageChange}
              onQuicksearch={dataGrid.handleQuicksearch}
              columnFlex={0}
              showToolColumn={true}
              toolColumnRenderer={buttonProps}
              toolColumnWidth={100}
              showActionButtons={true}
              actionButtonsProps={{
                // hideAdd: selectedStatus !== "LIEN_HE" ? true : false,
                // hideDelete: selectedStatus !== "LIEN_HE" ? true : false,
                // hideDivider: selectedStatus !== "LIEN_HE" ? true : false,
                // hideSave: selectedStatus !== "LIEN_HE" ? true : false,
                hideAdd: true,
                hideDelete: true,
                hideDivider: true,
                hideSave: true,
                buttonProps: resetButton,
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
            intervieweeId={
              selectedCandidate && !Array.isArray(selectedCandidate)
                ? selectedCandidate.id
                : undefined
            }
            candidateName={
              selectedCandidate && !Array.isArray(selectedCandidate)
                ? selectedCandidate.fullName
                : undefined
            }
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
            ? Array.isArray(selectedCandidate)
              ? selectedCandidate.map((c) => ({
                  id: c.id || "",
                  fullName: c.fullName || "",
                  email: c.email || "",
                  phone: c.phone || "",
                }))
              : {
                  id: selectedCandidate.id || "",
                  fullName: selectedCandidate.fullName || "",
                  email: selectedCandidate.email || "",
                  phone: selectedCandidate.phone || "",
                }
            : undefined
        }
        jobId={jobId}
        onSuccess={() => hanldeViewSuccess("interview")}
      />

      {/* Job NHAN_VIEC Modal */}
      <JobOfferModal
        open={jobOfferModalOpen}
        onClose={handleCloseJobOfferModal}
        jobId={jobId}
        candidateData={selectedCandidate}
        onSuccess={() => {
          hanldeViewSuccess("jobOffer");
          handleCloseJobOfferModal();
        }}
      />

      {/* Report List Modal */}
      <ReportListModal
        open={leaderReportModalOpen}
        onClose={handleCloseLeaderReportModal}
        reports={reportList}
        candidateName={reportListCandidate?.fullName}
        onViewDetail={(report) => {
          console.log("View report detail:", report);
          // messageApi.info("Chi tiết báo cáo: " + report.id);
        }}
      />

      {/* AI Analysis Result Modal */}
      {aiAnalysisModalOpen && (
        <AIAnalysisResultModal
          isOpen={aiAnalysisModalOpen}
          onClose={() => {
            setAiAnalysisModalOpen(false);
            setSelectedCandidate(null);
          }}
          analysisResult={
            selectedCandidate && !Array.isArray(selectedCandidate)
              ? selectedCandidate.analysisResult ?? null
              : null
          }
        />
      )}
    </div>
  );
}

export default Page;
