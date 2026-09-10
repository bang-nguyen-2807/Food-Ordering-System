import { getAccessToken } from "@/features/util/getAccessKey";
import { HeadUrl } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface infoDashboard {
  usersTotals: number;
  restaurantTotals: number;
  shipperTotals: number;
  orderTotal: number;
  revenue: number;
}
interface infoOrders {
  OrderId: number;
  CreatedAt: Date;
  CompletedAt: Date | null;
  FullName?: string;
  CustomerName?: string;
  NumberPhone?: string;
  CustomerPhone?: string;
  RestaurantName: string;
  ItemsSummary?: string;
  SubTotal: number;
  DiscountAmount: number;
  DeliveryFee: number;
  TotalPrice?: number;
  OrderTotal?: number;
  OrderStatus: string;
}
interface dashboardState {
  data: infoDashboard[];
  loading: boolean;
  dataCompleteOrders: infoOrders[];
  dataConfirmedOrders: infoOrders[];
  err: string | null;
}
const initialState: dashboardState = {
  data: [],
  loading: false,
  dataCompleteOrders: [],
  dataConfirmedOrders: [],
  err: null,
};
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_ , thunkAPI) => {
    try {
      // 1. Tự lấy token đã lưu từ localStorage ra
  const token = getAccessToken();
      const res = await fetch(
        `${HeadUrl}/admin/dashboard/total` , {
            method : "GET",
            headers : {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // <--- Gửi token đi
            }
      });
       // 2. Nếu Backend trả về lỗi (401, 403, 500) -> Chuyển sang rejected
       if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(errorData.message || "Không thể lấy dữ liệu!");
      }
      const data: infoDashboard[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
);
export const fetchOrderComplete = createAsyncThunk( // đơn hàng đã thành công
  "dashboard/fetchOrderComplete",
  async (_, thunkAPI) => {
    try {
      // 1. Tự lấy token đã lưu từ localStorage ra
  const token = getAccessToken();
      const res = await fetch(
        `${HeadUrl}/admin/dashboard/order/complete` , {
            method : "GET",
            headers : {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // <--- Gửi token đi
            }
      });
       // 2. Nếu Backend trả về lỗi (401, 403, 500) -> Chuyển sang rejected
       if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(errorData.message || "Không thể lấy dữ liệu!");
      }
      const data: infoOrders[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
);
export const fetchOrderConfirmed = createAsyncThunk( // chờ xác nhận
  "dashboard/fetchOrderConfirmed",
  async (_, thunkAPI) => {
    try {
      // 1. Tự lấy token đã lưu từ localStorage ra
  const token = getAccessToken();
      const res = await fetch(
        `${HeadUrl}/admin/dashboard/order/confirmed` , {
            method : "GET",
            headers : {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // <--- Gửi token đi
            }
      });
       // 2. Nếu Backend trả về lỗi (401, 403, 500) -> Chuyển sang rejected
       if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(errorData.message || "Không thể lấy dữ liệu!");
      }
      const data: infoOrders[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
);
const adminDashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu";
      })
      .addCase(fetchOrderComplete.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.dataCompleteOrders = action.payload;
      })
      .addCase(fetchOrderComplete.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu";
      })
      .addCase(fetchOrderConfirmed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderConfirmed.fulfilled, (state, action) => {
        state.loading = false;
        state.dataConfirmedOrders = action.payload;
      })
      .addCase(fetchOrderConfirmed.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu";
      });
  },
});
export default adminDashboardSlice.reducer;
