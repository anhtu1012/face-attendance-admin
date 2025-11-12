import { SelectionActionButton } from "@/components/basicUI/cTableAG/components/SelectionInfoBar/SelectionInfoBar";
import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { AgGridReact } from "@ag-grid-community/react";

interface GetSelectionActionButtonsParams {
  selectedStatus: string;
  gridRef: React.RefObject<AgGridReact>;
  handleBatchStatusChange: (
    selectedRows: TuyenDungItem[],
    status:
      | "TO_INTERVIEW"
      | "CANNOT_CONTACT"
      | "INTERVIEW_REJECTED"
      | "HOAN_THANH"
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

    case "NHAN_VIEC": {
      // Get currently selected rows once
      const selectedData = getSelectedData();

      // If any selected row has status 'JOB_SCHEDULED', we treat it specially
      const hasJobScheduled =
        selectedData &&
        selectedData.length > 0 &&
        selectedData.some((d: TuyenDungItem) => d.status === "JOB_SCHEDULED");

      const actions: SelectionActionButton[] = [];

      // When there is NO JOB_SCHEDULED among selected rows, show job-offer actions
      if (!hasJobScheduled) {
        actions.push(
          {
            title: "Hẹn nhận việc",
            label: "Hẹn nhận việc",
            onClick: async () => {
              const sd = getSelectedData();
              await handleBatchJobOffer(sd);
            },
          },
          {
            title: "Hủy nhận việc",
            label: "Hủy nhận việc",
            danger: true,
            confirmMessage:
              "Bạn có chắc muốn hủy nhận việc cho các ứng viên này?",
            onClick: async () => {
              const sd = getSelectedData();
              if (handleBatchCancelJobOffer) {
                await handleBatchCancelJobOffer(sd);
              }
            },
          }
        );
      }

      // When at least one selected row is JOB_SCHEDULED, show "Chuyển sang làm hợp đồng"
      if (hasJobScheduled) {
        actions.push({
          title: "Chuyển sang làm hợp đồng",
          label: "Chuyển sang  làm hợp đồng",
          confirmMessage:
            "Bạn có chắc muốn chuyển các ứng viên này sang  làm hợp đồng?",
          onClick: async () => {
            const sd = getSelectedData();
            const castedHandle = handleBatchStatusChange as unknown as (
              rows: TuyenDungItem[],
              status: string
            ) => Promise<void>;

            await castedHandle(sd, "CONTRACT_SIGNING");
          },
        });
      }

      return actions;
    }

    case "HOP_DONG":
      return [
        {
          title: "Hoàn tất hợp đồng",
          label: "Done",
          confirmMessage:
            "Bạn có chắc muốn đánh dấu các hợp đồng này là đã ký?",
          onClick: async () => {
            const selectedData = getSelectedData();
            // Set status to CONTRACT_SIGNING for selected candidates
            await handleBatchStatusChange(selectedData, "HOAN_THANH");
          },
        },
      ];

    default:
      return undefined;
  }
};
