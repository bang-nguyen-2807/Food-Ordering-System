import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/authentication/login/LoginSlice";
import createAccountSlice from "../features/authentication/createAccount/createAccountSlice";
import adminDashboardSlice from "../features/admin/dashboard/dashboardSlice";
import adminUserSlice from "../features/admin/users/UserSlice"
export const store = configureStore({
  reducer: {
    login: loginSlice,
    createAccount: createAccountSlice,
    // admin
    adminDashboard: adminDashboardSlice,
    adminUserAndPartness : adminUserSlice
  },
});

export type RootState = ReturnType<typeof store.getState>; // xác định kiểu dữ liệu của store
export type AppDispatch = typeof store.dispatch; // xác định kiểu dữ liệu của dispatch