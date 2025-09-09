import { getCookie } from "@/utils/client/getCookie";
import { useMemo } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (): Socket => {
  const token = getCookie("token");

  const socket = useMemo(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      query: { provider: "face" },
      auth: {
        token: `Bearer ${token}`,
      },
    });
    console.log(process.env.NEXT_PUBLIC_SOCKET_URL);

    s.on("connect", () => {
      console.log("WebSocket connected:", s.id);
    });

    s.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    s.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });

    s.on("reconnect_attempt", (attempt) => {
      console.log(`WebSocket reconnect attempt ${attempt}`);
    });

    s.on("reconnect", () => {
      console.log("WebSocket reconnected successfully");
    });

    return s;
  }, [token]);

  return socket;
};

export default useSocket;
