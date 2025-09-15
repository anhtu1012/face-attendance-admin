/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/authSlice.js
import { ResourcePermission, UserInfor } from "@/dtos/auth/auth.dto";
import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  userProfile: {} as UserInfor,
  permissions: [] as ResourcePermission[],
  selectedPermission: undefined as ResourcePermission | undefined,
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
      state.selectedPermission = undefined;
    },
    checkPermissionByRsname: (state, action: PayloadAction<string>) => {
      // Tìm kiếm permission có rsname khớp
      const foundPermission = state.permissions.find(
        (item) => item.resourceCode === action.payload
      );
      // Gán kết quả tìm được vào selectedPermission
      state.selectedPermission = foundPermission ?? undefined;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const selectAuthLogin = (state: RootState) => state.auth;
export const selectPermissionByRsname = (
  state: RootState,
  resourceCode: string
) => state.auth.permissions.find((item) => item.resourceCode === resourceCode);

export default authSlice.reducer;
