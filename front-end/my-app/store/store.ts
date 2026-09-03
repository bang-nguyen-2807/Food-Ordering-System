import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/authentication/login/LoginSlice";
import createAccountSlice from "../features/authentication/createAccount/createAccountSlice";
import adminDashboardSlice from "../features/admin/dashboard/dashboardSlice";
import adminUserSlice from "../features/admin/users/UserSlice"
import adminOrderSlice from "../features/admin/order/OrderSlice"
import adminSaleSlice from "../features/admin/sales/SalesSlice"
import adminAnalyticsSlice from "../features/admin/analytics/analyticsSlice"
import restaurantDashboardSlice from "../features/restaurant/dashboard/dashboardSlice"
import restaurantManagerOrderSlice from "../features/restaurant/managerOrder/managerOrderSlice"
import restaurantManagerMenuSlice from "../features/restaurant/managerMenu/managerMenuSlice"
export const store = configureStore({
  reducer: {
    login: loginSlice,
    createAccount: createAccountSlice,
    // admin
    adminDashboard: adminDashboardSlice,
    adminUserAndPartness : adminUserSlice,
    adminOrder : adminOrderSlice,
    adminSale : adminSaleSlice,
    adminAnalytics: adminAnalyticsSlice,
    // restaurant
    restaurantDashboard : restaurantDashboardSlice,
    restaurantManagerOrder : restaurantManagerOrderSlice,
    restaurantManagerMenu : restaurantManagerMenuSlice
  },
});

export type RootState = ReturnType<typeof store.getState>; // xác định kiểu dữ liệu của store
export type AppDispatch = typeof store.dispatch; // xác định kiểu dữ liệu của dispatch