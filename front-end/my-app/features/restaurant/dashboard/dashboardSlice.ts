import { otimizeSliceGET, otimizeSliceError, otimizeSliceUpdate } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface infoDashboard { // info total
    TotalItems: number;
    TotalOrders: number;
    TotalMoney: string;
    ProcessingOrders: number | null;
    CompletedOrders: number | null;
    CancelledOrders: number | null;
    PendingOrders: number | null
}
interface infoWeeklyRevenue { // info weekly revenue
    DayIndex: number;
    SaleDate: string;
    DayName: string;
    Revenue: string | null;
}
interface infoOrderJustPlaced {// info Order just place 
    OrderId: number;
    customerName: string;
    accountName: string;
    itemNames: string;
    sumSubItems: string;
    timeCreateItems: string;
    statusOrder: string;
}
interface initialState {
    dataTotal: infoDashboard[];
    dataWeeklyRevenue: infoWeeklyRevenue[];
    dataOrderJustPlaced: infoOrderJustPlaced[];
    loading: boolean;
    err: string | null
}
const initialState: initialState = {
    dataTotal: [],
    dataWeeklyRevenue: [],
    dataOrderJustPlaced: [],
    loading: false,
    err: null,
}
export const fetchDashboard = createAsyncThunk( // get info total
    "dashboard/fetchDashboard", async (UserId: string, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoDashboard[]>(`/restaurant/dashboard/total?UserId=${UserId}`, thunkAPI)
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin");
        }
    }
)
export const fetchWeeklyRevenue = createAsyncThunk(
    "dashboard/fetchWeeklyRevenue", async (UserId: string, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoWeeklyRevenue[]>(`/restaurant/dashboard/weeklyRevenue?UserId=${UserId}`, thunkAPI)
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin doanh thu")
        }
    }
)
export const fetchOrderJustPlaced = createAsyncThunk(
    "dashboard/fetchOrderJustPlaced", async (UserId: string, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoOrderJustPlaced[]>(`/restaurant/dashboard/orderJustPlaced?UserId=${UserId}`, thunkAPI)
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin đơn hàng")
        }
    }
)
export const fetchUpdateLocationRestaurant = createAsyncThunk(
    "dashboard/fetchUpdateLocationRestaurant", async ({ UserId, longitude, latitude }: { UserId: string, longitude: string, latitude: string }, thunkAPI) => {
        try {
            return await otimizeSliceUpdate(`/restaurant/dashboard/updateLocation`, thunkAPI, { UserId, longitude, latitude })
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể cập nhật thông tin vị trí")
        }
    }
)
const dashboardSlice = createSlice({
    name: "restaurantDashboard",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // GET dashboard total
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTotal = action.payload;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload as string;
            })
            // GET weekly revenue
            .addCase(fetchWeeklyRevenue.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchWeeklyRevenue.fulfilled, (state, action) => {
                state.loading = false;
                state.dataWeeklyRevenue = action.payload;
            })
            .addCase(fetchWeeklyRevenue.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload as string;
            })
            // GET order just placed
            .addCase(fetchOrderJustPlaced.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchOrderJustPlaced.fulfilled, (state, action) => {
                state.loading = false;
                state.dataOrderJustPlaced = action.payload;
            })
            .addCase(fetchOrderJustPlaced.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload as string;
            })
            // UPDATE location restaurant
            .addCase(fetchUpdateLocationRestaurant.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchUpdateLocationRestaurant.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(fetchUpdateLocationRestaurant.rejected, (state, action) => {
                state.loading = false;
            })
    }
})
export default dashboardSlice.reducer