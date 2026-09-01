import { getAccessToken } from "@/features/util/getAccessKey";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AnalyticsOverview {
  netRevenue: number;
  grossRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
  totalOrders: number;
  averageOrderValue: number;
  previousNetRevenue: number;
  growthRate: number;
}

export interface TimelineItem {
  TimeLabel: string;
  Revenue: number;
  CompletedCount: number;
  CancelledCount: number;
}

export interface PaymentItem {
  PaymentMethod: string;
  TotalRevenue: number;
  TotalOrders: number;
}

export interface CategoryItem {
  CategoryName: string;
  TotalRevenue: number;
  TotalQuantity: number;
}

export interface TopProduct {
  MenuItemId: number;
  ItemName: string;
  ImageUrl?: string;
  CategoryName: string;
  QuantitySold: number;
  TotalRevenue: number;
}

export interface PeakHour {
  HourSlot: number;
  HourSlotText: string;
  OrderCount: number;
  Revenue: number;
}

export interface DiscountAndLoss {
  TotalDiscountSpent: number;
  OrdersUsedVoucher: number;
  TotalLossCancelled: number;
  CancelledOrdersCount: number;
}

export interface OrderAnalyticsItem {
  OrderId: number;
  CreatedAt: string;
  CompletedAt?: string;
  CustomerName: string;
  CustomerPhone: string;
  RestaurantName: string;
  PaymentMethod: string;
  SubTotal: number;
  DiscountAmount: number;
  DeliveryFee: number;
  TotalPrice: number;
  OrderStatus: string;
}

export interface RestaurantOption {
  RestaurantId: number;
  RestaurantName: string;
  Addresses?: string;
}

export interface AnalyticsFilterState {
  timeRange: string; // 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'last_month' | 'custom'
  startDate: string;
  endDate: string;
  restaurantId: number;
  paymentMethod: string; // 'ALL' | 'CASH' | 'BANKING'
}

export interface AnalyticsDataPayload {
  overview: AnalyticsOverview;
  timeline: TimelineItem[];
  paymentDistribution: PaymentItem[];
  categoryDistribution: CategoryItem[];
  topProducts: TopProduct[];
  peakHours: PeakHour[];
  discountAndLoss: DiscountAndLoss;
  orders: OrderAnalyticsItem[];
  restaurants: RestaurantOption[];
}

interface AnalyticsState {
  filters: AnalyticsFilterState;
  data: AnalyticsDataPayload | null;
  loading: boolean;
  err: string | null;
}

const initialState: AnalyticsState = {
  filters: {
    timeRange: "7days",
    startDate: "",
    endDate: "",
    restaurantId: 0,
    paymentMethod: "ALL"
  },
  data: null,
  loading: false,
  err: null
};

export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchAnalyticsData",
  async (customFilters: Partial<AnalyticsFilterState> | undefined, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const currentFilters: AnalyticsFilterState = {
        ...state.adminAnalytics.filters,
        ...customFilters
      };

      const token = getAccessToken();
      const queryParams = new URLSearchParams();

      if (currentFilters.timeRange) queryParams.append("timeRange", currentFilters.timeRange);
      if (currentFilters.startDate) queryParams.append("startDate", currentFilters.startDate);
      if (currentFilters.endDate) queryParams.append("endDate", currentFilters.endDate);
      if (currentFilters.restaurantId) queryParams.append("restaurantId", String(currentFilters.restaurantId));
      if (currentFilters.paymentMethod) queryParams.append("paymentMethod", currentFilters.paymentMethod);

      const res = await fetch(`http://localhost:5000/api/admin/analytics/data?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(errorData.message || "Không thể lấy dữ liệu thống kê!");
      }

      const responseData: AnalyticsDataPayload = await res.json();
      return { data: responseData, filters: currentFilters };
    } catch (err: any) {
      console.error(err);
      return thunkAPI.rejectWithValue("Lỗi kết nối máy chủ thống kê!");
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AnalyticsFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.err = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.filters = action.payload.filters;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.err = (action.payload as string) || action.error.message || "Lỗi tải dữ liệu thống kê";
      });
  }
});

export const { setFilters, resetFilters } = adminAnalyticsSlice.actions;
export default adminAnalyticsSlice.reducer;
