import { useEffect } from "react";
import { Socket } from "socket.io-client";

interface UseSocketRoomOptions {
  socket: Socket | null;
  roomName: string;
  onJoined?: (roomName: string) => void;
  onLeft?: (roomName: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  autoJoin?: boolean; // Tự động join khi hook được mount
}

/**
 * Custom hook để join/leave socket room và quản lý listeners
 *
 * @example
 * ```typescript
 * const socket = useSocket();
 * const { joinRoom, leaveRoom, isJoined } = useSocketRoom({
 *   socket,
 *   roomName: 'hr_16',
 *   autoJoin: true,
 * });
 *
 * // Lắng nghe sự kiện
 * useEffect(() => {
 *   socket?.on('notification', (data) => {
 *     console.log('Notification:', data);
 *   });
 *
 *   return () => {
 *     socket?.off('notification');
 *   };
 * }, [socket]);
 * ```
 */
const useSocketRoom = ({
  socket,
  roomName,
  onJoined,
  onLeft,
  onError,
  autoJoin = true,
}: UseSocketRoomOptions) => {
  useEffect(() => {
    if (!socket || !roomName) return;

    // Handler khi join room thành công
    const handleJoined = (room: string) => {
      if (room === roomName) {
        onJoined?.(room);
      }
    };

    // Handler khi leave room
    const handleLeft = (room: string) => {
      if (room === roomName) {
        onLeft?.(room);
      }
    };

    // Handler khi có lỗi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleError = (error: any) => {
      onError?.(error);
    };

    // Đăng ký listeners
    socket.on("joined-room", handleJoined);
    socket.on("left-room", handleLeft);
    socket.on("room-error", handleError);

    // Tự động join room nếu autoJoin = true
    if (autoJoin) {
      socket.emit("join-room", roomName);
    }

    // Cleanup: leave room và remove listeners khi unmount
    return () => {
      socket.emit("leave-room", roomName);
      socket.off("joined-room", handleJoined);
      socket.off("left-room", handleLeft);
      socket.off("room-error", handleError);
    };
  }, [socket, roomName, onJoined, onLeft, onError, autoJoin]);

  // Các function để manually join/leave room
  const joinRoom = () => {
    if (socket && roomName) {
      socket.emit("join-room", roomName);
    }
  };

  const leaveRoom = () => {
    if (socket && roomName) {
      socket.emit("leave-room", roomName);
    }
  };

  return {
    joinRoom,
    leaveRoom,
  };
};

export default useSocketRoom;
