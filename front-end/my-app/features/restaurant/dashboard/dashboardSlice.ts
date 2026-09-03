import { otimizeSliceGET , otimizeSliceError } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface infoDashboard { // info total
    TotalItems : number;
    TotalOrders : number;
    TotalMoney : string;
    ProcessingOrders : number | null;
    CompletedOrders : number | null;
    CancelledOrders : number | null;
    PendingOrders : number | null
}
interface infoWeeklyRevenue{ // info weekly revenue
    DayIndex : number;
    SaleDate : string;
    DayName : string;
    Revenue : string | null;
}
interface infoOrderJustPlaced{// info Order just place 
    OrderId : number;
    customerName : string;
    accountName : string;
    itemNames : string;
    sumSubItems : string;
    timeCreateItems : string;
    statusOrder : string;
}
interface initialState {
    dataTotal : infoDashboard[];
    dataWeeklyRevenue : infoWeeklyRevenue[];
    dataOrderJustPlaced : infoOrderJustPlaced[];
    loading  : boolean;
    err    : string | null
}
const initialState : initialState = {
    dataTotal : [],
    dataWeeklyRevenue : [],
    dataOrderJustPlaced : [],
    loading: false,
    err: null,
}
export const fetchDashboard = createAsyncThunk( // get info total
    "dashboard/fetchDashboard", async(UserId : string, thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoDashboard[]>(`http://localhost:5000/api/restaurant/dashboard/total?UserId=${UserId}` , thunkAPI)
        }catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin");
        }
    }
)
export const fetchWeeklyRevenue = createAsyncThunk(
    "dashboard/fetchWeeklyRevenue" , async(UserId : string , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoWeeklyRevenue[]>(`http://localhost:5000/api/restaurant/dashboard/weeklyRevenue?UserId=${UserId}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin doanh thu")
        }
    }
)
export const fetchOrderJustPlaced = createAsyncThunk(
    "dashboard/fetchOrderJustPlaced" , async(UserId : string , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoOrderJustPlaced[]>(`http://localhost:5000/api/restaurant/dashboard/orderJustPlaced?UserId=${UserId}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin đơn hàng")
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
        .addCase(fetchDashboard.pending , (state) => {
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchDashboard.fulfilled , (state , action) => {
            state.loading = false;
            state.dataTotal = action.payload;
        })
        .addCase(fetchDashboard.rejected , (state , action) => {
            state.loading = false;
            state.err = action.payload as string;
        })
        // GET weekly revenue
        .addCase(fetchWeeklyRevenue.pending , (state) => {
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchWeeklyRevenue.fulfilled , (state , action) => {
            state.loading = false;
            state.dataWeeklyRevenue = action.payload;
        })
        .addCase(fetchWeeklyRevenue.rejected , (state , action) => {
            state.loading = false;
            state.err = action.payload as string;
        })
        // GET order just placed
        .addCase(fetchOrderJustPlaced.pending , (state) => {
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchOrderJustPlaced.fulfilled , (state , action) => {
            state.loading = false;
            state.dataOrderJustPlaced = action.payload;
        })
        .addCase(fetchOrderJustPlaced.rejected , (state , action) => {
            state.loading = false;
            state.err = action.payload as string;
        })
    }
})
export default dashboardSlice.reducer