import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthLogin } from "@/lib/store/slices/loginSlice";
import { socketRoomManager } from "./socketRoomManager";

/**
 * Hook để quản lý socket rooms dựa trên auth state
 * Tự động cleanup khi logout
 */
export const useSocketAuth = () => {
  const auth = useSelector(selectAuthLogin);
  const isLoggedIn = !!auth.accessToken;

  useEffect(() => {
    if (!isLoggedIn) {
      socketRoomManager.cleanup();
    }
  }, [isLoggedIn]);

  return {
    isLoggedIn,
    joinedRooms: socketRoomManager.getJoinedRooms(),
  };
};
