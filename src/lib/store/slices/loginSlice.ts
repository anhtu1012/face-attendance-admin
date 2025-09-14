/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/authSlice.js
import { ResourcePermission, UserInfor } from "@/dtos/auth/auth.dto";
import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  userProfile: {} as UserInfor,
  permissions: [] as ResourcePermission[],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, userProfile, permissions } =
        action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userProfile = userProfile;
      state.permissions = permissions;
    },
    clearAuthData: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.userProfile = {} as UserInfor; // Reset to initial state
      state.permissions = [];
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const selectAuthLogin = (state: RootState) => state.auth;

export default authSlice.reducer;
