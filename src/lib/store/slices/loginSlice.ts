/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/authSlice.js
import { UserInfor } from "@/dtos/auth/auth.dto";
import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  userProfile: {} as UserInfor,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, userProfile } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userProfile = userProfile;
    },
    clearAuthData: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.userProfile = {} as any; // Reset to initial state
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const selectAuthLogin = (state: RootState) => state.auth;

export default authSlice.reducer;
