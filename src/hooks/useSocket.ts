import { store } from "@/lib/store";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { socketRoomManager } from "./socketRoomManager";

let socketInstance: Socket | null = null;
let isInitialized = false;

const createSocketInstance = (): Socket => {
  if (socketInstance) {
    return socketInstance;
  }

  const token = store.getState().auth.accessToken;

  const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    query: { provider: "face" },
    auth: {
      token: `${token}`,
    },
  });

  // Khởi tạo Socket Room Manager CHỈ MỘT LẦN
  if (!isInitialized) {
    socketRoomManager.initialize(s);
    isInitialized = true;
  }

  s.on("connect_error", (error) => {
    console.error(" [useSocket] WebSocket connection error:", error.message);
  });

  s.on("disconnect", (reason) => {
    console.warn(" [useSocket] WebSocket disconnected:", reason);
  });

  s.on("reconnect_attempt", (attempt) => {
    console.log(` [useSocket] WebSocket reconnect attempt ${attempt}`);
  });

  s.on("reconnect", () => {
    console.log(" [useSocket] WebSocket reconnected successfully");
  });

  socketInstance = s;
  return s;
};

const useSocket = (): Socket => {
  const [socket] = useState<Socket>(() => createSocketInstance());

  useEffect(() => {
    // Cleanup on unmount (chỉ khi component cuối cùng unmount)
    return () => {
      // Không disconnect socket vì có thể components khác vẫn đang dùng
      // Socket sẽ được cleanup khi logout hoặc page unload
    };
  }, []);

  return socket;
};

export default useSocket;

// Cleanup function để gọi khi logout
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("🔌 [useSocket] Disconnecting socket...");
    socketRoomManager.cleanup();
    socketInstance.disconnect();
    socketInstance = null;
    isInitialized = false;
    console.log("✅ [useSocket] Socket disconnected and cleaned up");
  }
};
