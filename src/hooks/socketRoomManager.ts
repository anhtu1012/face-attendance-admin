import { Socket } from "socket.io-client";
import { store } from "@/lib/store";

/**
 * Socket Room Manager - Quản lý việc join/leave rooms tập trung
 * Tự động join rooms dựa trên thông tin user khi login
 */
class SocketRoomManager {
  private socket: Socket | null = null;
  private joinedRooms: Set<string> = new Set();

  /**
   * Khởi tạo socket manager với socket instance
   */
  initialize(socket: Socket) {
    this.socket = socket;
    this.setupListeners();
  }

  /**
   * Setup các listeners cho socket events
   */
  private setupListeners() {
    if (!this.socket) return;

    // Lắng nghe khi socket connect
    this.socket.on("connect", () => {
      setTimeout(() => {
        this.autoJoinRooms();
      }, 100);
    });

    // Lắng nghe khi socket reconnect
    this.socket.on("reconnect", () => {
      setTimeout(() => {
        this.autoJoinRooms();
      }, 100);
    });

    // Lắng nghe confirmation từ backend
    this.socket.on(
      "room-joined",
      (data: { success?: boolean; room?: string; message?: string }) => {
        if (data.success) {
          const roomName = data.room || this.parseRoomFromMessage(data.message);
          if (roomName) {
            this.joinedRooms.add(roomName);
          }
        }
      }
    );

    this.socket.on(
      "room-left",
      (data: { success?: boolean; room?: string; message?: string }) => {
        if (data.success) {
          const roomName = data.room || this.parseRoomFromMessage(data.message);
          if (roomName) {
            this.joinedRooms.delete(roomName);
          }
        }
      }
    );
  }

  /**
   * Parse room name từ message string
   */
  private parseRoomFromMessage(message?: string): string | null {
    if (!message) return null;
    // Match pattern "room: xxx" hoặc "room xxx"
    const match = message.match(/room[:\s]+(\w+)/i);
    return match ? match[1] : null;
  }

  /**
   * Tự động join vào các rooms dựa trên thông tin user
   */
  autoJoinRooms() {
    if (!this.socket) {
      console.warn("[SocketManager] Socket instance not available");
      return;
    }

    if (!this.socket.connected) {
      console.warn("[SocketManager] Socket not connected yet, waiting...");
      return;
    }

    const state = store.getState();
    const userProfile = state.auth?.userProfile;
    const userId = userProfile?.id;
    const roleId = userProfile?.roleId;

    console.log("👤 [SocketManager] User info:", { userId, roleId });

    if (!userId || !roleId) {
      return;
    }

    // Join các rooms cần thiết
    const roomsToJoin = this.getRoomsToJoin(userId, roleId);

    roomsToJoin.forEach((roomConfig) => {
      this.joinRoom(roomConfig.room, roomConfig.userId);
    });
  }

  /**
   * Xác định các rooms cần join dựa trên user info
   * Logic phù hợp với backend NestJS Socket Gateway
   */
  private getRoomsToJoin(
    userId?: string | bigint,
    roleId?: string
  ): Array<{ room: string; userId?: string }> {
    const rooms: Array<{ room: string; userId?: string }> = [];

    // Convert userId sang string nếu cần
    const userIdStr = userId ? String(userId) : undefined;

    // 1. Join room chung 'general' (backend tự động join khi connect)
    // Không cần join thủ công vì backend đã join trong handleConnection

    // 2. Join personal room 'user_{userId}' (backend cũng đã join tự động)
    // Không cần join thủ công

    // 3. Join room dựa trên roleId - theo logic backend
    if (roleId && userIdStr) {
      const roleIdNum = Number(roleId);

      switch (roleIdNum) {
        case 2: // DEPARTMENT
          rooms.push({ room: `department_${userIdStr}`, userId: userIdStr });
          break;

        case 4: // MANAGER
          rooms.push({ room: `manager_${userIdStr}`, userId: userIdStr });
          break;

        case 6: // HR
          rooms.push({ room: `hr_${userIdStr}`, userId: userIdStr });
          break;

        default:
          // Các role khác không có room riêng
          console.log(` [SocketManager] Role ${roleId} không có room đặc biệt`);
          break;
      }
    }

    // 4. Có thể join thêm các room custom khác nếu cần
    // Ví dụ: room cho notifications, chat, etc.

    return rooms;
  }

  /**
   * Join vào một room cụ thể
   */
  joinRoom(room: string, userId?: string) {
    if (!this.socket?.connected) {
      console.warn(
        `[SocketManager] Cannot join room ${room}: Socket not connected`
      );
      return;
    }

    // Kiểm tra đã join chưa
    if (this.joinedRooms.has(room)) {
      console.log(`[SocketManager] Already in room: ${room}`);
      return;
    }

    // Emit với format đúng như backend yêu cầu
    const payload = {
      room: room,
      userId: userId,
    };

    this.socket.emit("join-room", payload);
  }

  /**
   * Leave khỏi một room cụ thể
   */
  leaveRoom(room: string) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit("leave-room", { room });
    this.joinedRooms.delete(room);
  }

  /**
   * Leave tất cả các rooms
   */
  leaveAllRooms() {
    console.log("🚪 [SocketManager] Leaving all rooms...");

    this.joinedRooms.forEach((room) => {
      this.leaveRoom(room);
    });

    this.joinedRooms.clear();
  }

  /**
   * Lấy danh sách các rooms đã join
   */
  getJoinedRooms(): string[] {
    return Array.from(this.joinedRooms);
  }

  /**
   * Kiểm tra đã join vào room chưa
   */
  isInRoom(room: string): boolean {
    return this.joinedRooms.has(room);
  }

  /**
   * Cleanup khi logout hoặc disconnect
   */
  cleanup() {
    console.log("🧹 [SocketManager] Cleaning up...");
    this.leaveAllRooms();
    this.socket = null;
  }
}

// Export singleton instance
export const socketRoomManager = new SocketRoomManager();

/**
 * Helper function để join custom room từ component
 */
export const joinCustomRoom = (room: string, userId?: string) => {
  socketRoomManager.joinRoom(room, userId);
};

/**
 * Helper function để leave custom room từ component
 */
export const leaveCustomRoom = (room: string) => {
  socketRoomManager.leaveRoom(room);
};

/**
 * Helper function để lấy danh sách rooms đã join
 */
export const getJoinedRooms = () => {
  return socketRoomManager.getJoinedRooms();
};

/**
 * Helper function để check đã join room chưa
 */
export const isInRoom = (room: string) => {
  return socketRoomManager.isInRoom(room);
};
