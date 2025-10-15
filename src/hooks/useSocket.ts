import { getCookie } from "@/utils/client/getCookie";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { socketRoomManager } from "./socketRoomManager";

let socketInstance: Socket | null = null;
let isInitialized = false;

const createSocketInstance = (): Socket => {
  if (socketInstance) {
    return socketInstance;
  }

  const token = getCookie("token");
  console.log("token", token);

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

// Reconnect socket với token mới (sau khi login)
export const reconnectSocketWithNewToken = () => {
  if (socketInstance) {
    console.log("[useSocket] Reconnecting socket with new token...");

    // Disconnect socket hiện tại
    socketRoomManager.cleanup();
    socketInstance.disconnect();
    socketInstance = null;
    isInitialized = false;

    // Tạo lại socket instance với token mới
    const newSocket = createSocketInstance();

    console.log("[useSocket] Socket reconnected with new token");
    return newSocket;
  } else {
    console.log("[useSocket] Creating new socket instance with token...");
    return createSocketInstance();
  }
};

// Cleanup function để gọi khi logout
export const disconnectSocket = () => {
  if (socketInstance) {
    console.log("[useSocket] Disconnecting socket...");
    socketRoomManager.cleanup();
    socketInstance.disconnect();
    socketInstance = null;
    isInitialized = false;
    console.log("[useSocket] Socket disconnected and cleaned up");
  }
};
