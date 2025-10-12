import { TuyenDungItem } from "@/dtos/tac-vu-nhan-su/tuyen-dung/tuyen-dung.dto";
import { useEffect } from "react";
import useSocket from "./useSocket";

interface RecruitmentSocketData {
  data: {
    jobId: string;
    inFo: TuyenDungItem;
  };
}

interface UseRecruitmentSocketProps {
  jobId: string;
  selectedStatus: string;
  onNewCandidate?: (jobId: string, candidateInfo: TuyenDungItem) => void;
  onCandidateStatusChanged?: (
    jobId: string,
    candidateId: string,
    newStatus: string
  ) => void;
  onInterviewScheduled?: (jobId: string, candidateId: string) => void;
  onJobOfferSent?: (jobId: string, candidateId: string) => void;
}

/**
 * Custom hook để xử lý tất cả socket events liên quan đến tuyển dụng
 * Sử dụng trong màn hình tuyển dụng
 */
export const useRecruitmentSocket = ({
  jobId,
  selectedStatus,
  onNewCandidate,
  onCandidateStatusChanged,
  onInterviewScheduled,
  onJobOfferSent,
}: UseRecruitmentSocketProps) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ [RecruitmentSocket] Socket chưa sẵn sàng");
      return;
    }

    //  QUAN TRỌNG: Nếu socket chưa connect, đợi event 'connect'
    if (!socket.connected) {
      console.warn(
        "[RecruitmentSocket] Socket chưa connect, đợi connect event..."
      );

      const handleConnect = () => {
        console.log(
          " [RecruitmentSocket] Socket vừa connect, trigger re-setup"
        );
        // Force re-run effect khi socket connect
      };

      socket.once("connect", handleConnect);

      return () => {
        socket.off("connect", handleConnect);
      };
    }

    // Handler cho event ứng viên mới
    const handleNewCandidate = (socketData: RecruitmentSocketData) => {
      console.log("✅✅✅ [NEW_CANDIDATE] Received:", socketData);

      const { jobId: newJobId, inFo } = socketData?.data || {};
      if (!newJobId || !inFo) {
        console.warn("[NEW_CANDIDATE] Invalid data received:", socketData);
        console.warn("[NEW_CANDIDATE] Expected: { data: { jobId, inFo } }");
        return;
      }
      onNewCandidate?.(String(newJobId), inFo);
    };

    // Handler cho event thay đổi trạng thái ứng viên
    const handleCandidateStatusChanged = (socketData: {
      data?: { jobId?: string; candidateId?: string; newStatus?: string };
    }) => {
      console.log("[Socket] Candidate status changed:", socketData);

      const {
        jobId: affectedJobId,
        candidateId,
        newStatus,
      } = socketData?.data || {};
      if (!affectedJobId || !candidateId || !newStatus) {
        console.warn(" [Socket] Invalid status change data:", socketData);
        return;
      }

      onCandidateStatusChanged?.(
        String(affectedJobId),
        String(candidateId),
        newStatus
      );
    };

    // Handler cho event lịch phỏng vấn được tạo
    const handleInterviewScheduled = (socketData: {
      data?: { jobId?: string; candidateId?: string };
    }) => {
      console.log("[Socket] Interview scheduled:", socketData);

      const { jobId: affectedJobId, candidateId } = socketData?.data || {};
      if (!affectedJobId || !candidateId) {
        console.warn(" [Socket] Invalid interview schedule data:", socketData);
        return;
      }

      onInterviewScheduled?.(String(affectedJobId), String(candidateId));
    };

    // Handler cho event gửi job offer
    const handleJobOfferSent = (socketData: {
      data?: { jobId?: string; candidateId?: string };
    }) => {
      console.log("[Socket] Job offer sent:", socketData);

      const { jobId: affectedJobId, candidateId } = socketData?.data || {};
      if (!affectedJobId || !candidateId) {
        console.warn("[Socket] Invalid job offer data:", socketData);
        return;
      }

      onJobOfferSent?.(String(affectedJobId), String(candidateId));
    };
    // Lắng nghe các sự kiện từ room hr_16
    const handleHrNotification = (data: unknown) => {
      console.log("📩 [Socket] ✅ NHẬN ĐƯỢC HR NOTIFICATION từ hr_16:", data);
      // Xử lý thông báo từ HR department
    };

    const handleHrAttendance = (data: unknown) => {
      console.log("⏰ [Socket] ✅ NHẬN ĐƯỢC HR ATTENDANCE từ hr_16:", data);
      // Xử lý cập nhật điểm danh
    };

    socket.on("hr:notification", handleHrNotification);
    socket.on("hr:attendance", handleHrAttendance);

    // Thử TẤT CẢ các variant của NEW_CANDIDATE event
    socket.on("NEW_CANDIDATE", handleNewCandidate);

    socket.on("candidate:status:changed", handleCandidateStatusChanged);
    socket.on("interview:scheduled", handleInterviewScheduled);
    socket.on("job-offer:sent", handleJobOfferSent);

    // Cleanup khi component unmount
    return () => {
      // Cleanup tất cả variants của NEW_CANDIDATE
      socket.off("NEW_CANDIDATE", handleNewCandidate);

      socket.off("candidate:status:changed", handleCandidateStatusChanged);
      socket.off("interview:scheduled", handleInterviewScheduled);
      socket.off("job-offer:sent", handleJobOfferSent);
    };
  }, [
    socket,
    socket?.connected, // ⚠️ CRITICAL: Re-run khi socket connect/disconnect
    jobId,
    selectedStatus,
    onNewCandidate,
    onCandidateStatusChanged,
    onInterviewScheduled,
    onJobOfferSent,
  ]);

  // Return socket instance để có thể emit events nếu cần
  return { socket };
};

/**
 * Helper function để test socket - emit fake event
 */
export const testSocketEvent = (
  socket: ReturnType<typeof useSocket>,
  eventName: string,
  data: Record<string, unknown>
) => {
  if (!socket) {
    console.error("Socket not available");
    return;
  }

  console.log(`[Test] Emitting event: ${eventName}`, data);

  // Simulate receiving socket event by directly calling the handler
  // In production, server will emit this
  socket.emit(eventName, data);

  // For testing purpose, also trigger the event locally
  setTimeout(() => {
    const callbacks = (
      socket as unknown as {
        _callbacks?: Record<string, Array<(data: unknown) => void>>;
      }
    )._callbacks;
    callbacks?.[`$${eventName}`]?.forEach((callback) => {
      callback(data);
    });
  }, 100);
};
