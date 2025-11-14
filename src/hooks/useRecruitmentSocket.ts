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
}

/**
 * Custom hook để xử lý tất cả socket events liên quan đến tuyển dụng
 * Sử dụng trong màn hình tuyển dụng
 */
export const useRecruitmentSocket = ({
  jobId,
  selectedStatus,
  onNewCandidate,
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
      console.log("[NEW_CANDIDATE] Received:", socketData);

      const { jobId: newJobId, inFo } = socketData?.data || {};
      if (!newJobId || !inFo) {
        console.warn("[NEW_CANDIDATE] Invalid data received:", socketData);
        console.warn("[NEW_CANDIDATE] Expected: { data: { jobId, inFo } }");
        return;
      }
      onNewCandidate?.(String(newJobId), inFo);
    };

    // Thử TẤT CẢ các variant của NEW_CANDIDATE event
    socket.on("NEW_CANDIDATE", handleNewCandidate);

    // Cleanup khi component unmount
    return () => {
      // Cleanup tất cả variants của NEW_CANDIDATE
      socket.off("NEW_CANDIDATE", handleNewCandidate);
    };
  }, [socket, socket.connected, jobId, selectedStatus, onNewCandidate]);

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
