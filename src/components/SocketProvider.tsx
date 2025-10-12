"use client";

import { useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import { useSocketAuth } from "@/hooks/useSocketAuth";

/**
 * Socket Provider - Khởi tạo socket và quản lý rooms ở root level
 * Component này nên được đặt trong layout để socket luôn active
 */
export default function SocketProvider() {
  const socket = useSocket();
  const { isLoggedIn, joinedRooms } = useSocketAuth();

  useEffect(() => {
    if (socket && isLoggedIn) {
      console.log("🔌 [SocketProvider] Socket initialized for logged-in user");
      console.log("🏠 [SocketProvider] Current rooms:", joinedRooms);
    }
  }, [socket, isLoggedIn, joinedRooms]);

  // Component này không render gì cả, chỉ khởi tạo socket
  return null;
}
