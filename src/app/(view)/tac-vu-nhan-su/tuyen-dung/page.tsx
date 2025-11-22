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
import { Segmented, Tooltip } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { DiGoogleAnalytics } from "react-icons/di";
import { FaPlusCircle } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { GoReport } from "react-icons/go";
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
  const [quantityStatus, setQuantityStatus] = useState<Record<
    string,
    number
  > | null>(null);
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

  const segmentedOptions = useMemo(() => {
    // Helper to show count if available
    const withCount = (label: string, key?: string) => {
      const count =
        key && quantityStatus && quantityStatus[key] !== undefined
          ? ` (${quantityStatus[key]})`
          : "";
      console.log("count", count);
      return `${label}`;
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
            "TO_INTERVIEW_R1",
            "TO_INTERVIEW_R2",
            "TO_INTERVIEW_R3",
            "TO_INTERVIEW_R4",
            "TO_INTERVIEW_R5",
            "INTERVIEW_RESCHEDULED",
            "INTERVIEW_FAILED",
            "NOT_COMING_INTERVIEW",
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
        width: 170,
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
            REJECTED: "#C62828", // dark red
            NOT_SUITABLE: "#9E9E9E", // grey
            HOAN_THANH: "#2E7D32", // dark green
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
                mode: "multiRow",
                enableClickSelection: true,
                checkboxes: true,
                isRowSelectable: handleCheckRowActions,
              }}
              showSelectionInfoBar={true}
              selectionActionButtons={getSelectionActionButtons({
                selectedStatus,
                gridRef,
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
                hideAdd: selectedStatus !== "LIEN_HE" ? true : false,
                hideDelete: selectedStatus !== "LIEN_HE" ? true : false,
                hideDivider: selectedStatus !== "LIEN_HE" ? true : false,
                hideSave: selectedStatus !== "LIEN_HE" ? true : false,
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
        candidateData={
          selectedCandidate && !Array.isArray(selectedCandidate)
            ? {
                id: selectedCandidate.id || "",
                fullName: selectedCandidate.fullName || "",
                email: selectedCandidate.email || "",
                phone: selectedCandidate.phone || "",
              }
            : undefined
        }
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
          messageApi.info("Chi tiết báo cáo: " + report.id);
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
