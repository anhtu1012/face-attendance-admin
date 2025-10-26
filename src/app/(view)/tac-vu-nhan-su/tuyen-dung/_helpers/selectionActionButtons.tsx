import { SelectionActionButton } from "@/components/basicUI/cTableAG/components/SelectionInfoBar/SelectionInfoBar";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { AgGridReact } from "@ag-grid-community/react";

interface GetSelectionActionButtonsParams {
  selectedStatus: string;
  gridRef: React.RefObject<AgGridReact>;
  handleBatchStatusChange: (
    selectedRows: TuyenDungItem[],
    status: "TO_INTERVIEW" | "CANNOT_CONTACT" | "INTERVIEW_REJECTED"
  ) => Promise<void>;
  handleBatchInterviewSchedule: (
    selectedRows: TuyenDungItem[]
  ) => Promise<void>;
  handleBatchJobOffer: (selectedRows: TuyenDungItem[]) => Promise<void>;
  handleBatchCancelJobOffer?: (selectedRows: TuyenDungItem[]) => Promise<void>;
}

/**
 * Get selection action buttons based on current status
 */
export const getSelectionActionButtons = ({
  selectedStatus,
  gridRef,
  handleBatchStatusChange,
  handleBatchInterviewSchedule,
  handleBatchJobOffer,
  handleBatchCancelJobOffer,
}: GetSelectionActionButtonsParams): SelectionActionButton[] | undefined => {
  // Helper to get selected rows
  const getSelectedData = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    return selectedNodes?.map((node) => node.data) || [];
  };

  switch (selectedStatus) {
    case "LIEN_HE":
      return [
        {
          title: "Chuyển sang phỏng vấn",
          label: "Chuyển sang phỏng vấn",
          confirmMessage:
            "Bạn có chắc muốn chuyển các ứng viên này sang phỏng vấn?",
          onClick: async () => {
            const selectedData = getSelectedData();
            await handleBatchStatusChange(selectedData, "TO_INTERVIEW");
          },
        },
        {
          title: "Đánh dấu không liên hệ được",
          label: "Không liên hệ được",
          danger: true,
          confirmMessage:
            "Bạn có chắc muốn đánh dấu các ứng viên này là không liên hệ được?",
          onClick: async () => {
            const selectedData = getSelectedData();
            await handleBatchStatusChange(selectedData, "CANNOT_CONTACT");
          },
        },
      ];

    case "PHONG_VAN":
      return [
        {
          title: "Tạo lịch hẹn phỏng vấn",
          label: "Tạo lịch hẹn",
          onClick: async () => {
            const selectedData = getSelectedData();
            await handleBatchInterviewSchedule(selectedData);
          },
        },
        {
          title: "Từ chối phỏng vấn",
          label: "Từ chối phỏng vấn",
          danger: true,
          confirmMessage:
            "Bạn có chắc muốn từ chối phỏng vấn các ứng viên này?",
          onClick: async () => {
            const selectedData = getSelectedData();
            await handleBatchStatusChange(selectedData, "INTERVIEW_REJECTED");
          },
        },
      ];

    case "NHAN_VIEC":
      return [
        {
          title: "Hẹn nhận việc",
          label: "Hẹn nhận việc",
          onClick: async () => {
            const selectedData = getSelectedData();
            await handleBatchJobOffer(selectedData);
          },
        },
        {
          title: "Hủy nhận việc",
          label: "Hủy nhận việc",
          danger: true,
          confirmMessage:
            "Bạn có chắc muốn hủy nhận việc cho các ứng viên này?",
          onClick: async () => {
            const selectedData = getSelectedData();
            if (handleBatchCancelJobOffer) {
              await handleBatchCancelJobOffer(selectedData);
            }
          },
        },
      ];

    default:
      return undefined;
  }
};
