import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import TuyenDungServices from "@/services/tac-vu-nhan-su/tuyen-dung/tuyen-dung.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface BatchStatusChangeParams {
  selectedRows: TuyenDungItem[];
  status: "TO_INTERVIEW" | "CANNOT_CONTACT" | "INTERVIEW_REJECTED";
  setLoading: (loading: boolean) => void;
  setQuantityStatus: React.Dispatch<
    React.SetStateAction<Record<string, number> | null>
  >;
  setNewCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  messageApi: any;
  handleFetchUser: (
    page: number,
    limit: number,
    quickSearch?: string
  ) => Promise<void>;
  currentPage: number;
  pageSize: number;
  quickSearchText?: string;
}

interface BatchScheduleParams {
  selectedRows: TuyenDungItem[];
  messageApi: any;
  setSelectedCandidate: (
    candidate: TuyenDungItem | TuyenDungItem[] | null
  ) => void;
  setModalOpen: (open: boolean) => void;
  modalType: "interview" | "jobOffer";
}

/**
 * Handle batch status change for selected candidates
 */
export const handleBatchStatusChange = async ({
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
}: BatchStatusChangeParams): Promise<void> => {
  try {
    setLoading(true);
    let successCount = 0;

    for (const row of selectedRows) {
      if (row.id) {
        await TuyenDungServices.updateStatusUngVien(row.id, status);
        successCount++;
      }
    }

    // Update quantity status based on status change
    if (status === "TO_INTERVIEW") {
      setQuantityStatus((prev) => {
        if (!prev) return prev;
        const prevToContact = Number(prev.toContactQuantity || 0);
        const prevToInterview = Number(prev.toInterviewQuantity || 0);
        return {
          ...prev,
          toContactQuantity: Math.max(prevToContact - successCount, 0),
          toInterviewQuantity: prevToInterview + successCount,
        } as Record<string, number>;
      });

      setNewCounts((prev) => ({
        ...prev,
        LIEN_HE: Math.max(Number(prev.LIEN_HE || 0) - successCount, 0),
        PHONG_VAN: Number(prev.PHONG_VAN || 0) + successCount,
      }));
    }

    const statusMessage =
      status === "CANNOT_CONTACT"
        ? "không liên hệ được"
        : status === "INTERVIEW_REJECTED"
        ? "từ chối phỏng vấn"
        : "chuyển sang phỏng vấn";

    messageApi.success(`Đã ${statusMessage} ${successCount} ứng viên`);
    await handleFetchUser(currentPage, pageSize, quickSearchText);
  } catch (error: any) {
    messageApi.error(`Lỗi: ${error.response?.data?.message}`);
  } finally {
    setLoading(false);
  }
};

/**
 * Handle batch scheduling (interview or job offer)
 */
export const handleBatchSchedule = async ({
  selectedRows,
  messageApi,
  setSelectedCandidate,
  setModalOpen,
  modalType,
}: BatchScheduleParams): Promise<void> => {
  if (selectedRows.length === 0) {
    messageApi.warning("Vui lòng chọn ít nhất một ứng viên!");
    return;
  }

  const actionName =
    modalType === "interview" ? "lịch phỏng vấn" : "lịch nhận việc";

  // Support both single and multiple candidates
  if (selectedRows.length === 1) {
    setSelectedCandidate(selectedRows[0]);
  } else {
    setSelectedCandidate(selectedRows);
    messageApi.info(
      `Đã chọn ${selectedRows.length} ứng viên để tạo ${actionName}`
    );
  }

  setModalOpen(true);
};
