import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { otimizeSliceGET , otimizeSliceError , otimizeSliceUpdate } from "@/features/util/helpRTK";
interface infoDashboardOrderShipper{
    DeliveriesId : number;
    OrderId : number;
    DeliveryStatus : string;
    RestaurantId : number;
    RestaurantName : string;
    RestaurantAddress : string;
    DeliveryAddress : string;
    ReceiverPhone : string;
    TotalPrice : string;
    DistanceMeter : string;
}
interface UpdateShipperLocation{
    UserId : string;
    longitude : string;
    latitude : string;
}
interface GetAvailableDeliveries{
    UserId : string;
    radiusMeter : string;
}
interface infoTotal {
    TotalOrderToday : number;
    EstimatedRevenueToday : string;
    TotalOrderValueToday : number
}
interface initialState {
    infoDashboardOrderShipper : infoDashboardOrderShipper[];
    infoTotal : infoTotal[];
    loading  : boolean;
    err    : string | null
}
const initialState : initialState = {
    infoDashboardOrderShipper : [],
    infoTotal : [],
    loading: false,
    err: null,
}
export const fetchTotalOrder = createAsyncThunk(
    "dashboardShipper/fetchTotalOrder" , async(UserId : string , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoTotal[]>(`/shipper/dashboard/totalOrder?UserId=${UserId}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin tổng đơn hàng")
        }
    }
)
export const fetchUpdateShipperLocation = createAsyncThunk(
    "dashboardShipper/fetchUpdateShipperLocation" , async({UserId , longitude , latitude} : {UserId : string , longitude : string , latitude : string} , thunkAPI)=>{
        try{
            return await otimizeSliceUpdate<string[]>(`/shipper/dashboard/updateShipperLocation` , thunkAPI , {UserId , longitude , latitude})
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể cập nhật thông tin vị trí")
        }
    }
)
export const getAvailableDeliveries = createAsyncThunk(
    "dashboardShipper/getAvailableDeliveries" , async({UserId , radiusMeter} : GetAvailableDeliveries , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoDashboardOrderShipper[]>(`/shipper/dashboard/getAvailableDeliveries?UserId=${UserId}&radiusMeter=${radiusMeter}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin đơn hàng khả dụng")
        }
    }
)
const dashboardShipperSlice = createSlice({
    name: "dashboardShipper",
    initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder
        // fetchTotalOrder
        .addCase(fetchTotalOrder.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchTotalOrder.fulfilled , (state , action)=>{
            state.loading = false;
            state.infoTotal = action.payload;
        })
        .addCase(fetchTotalOrder.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
        // fetchUpdateShipperLocation
        .addCase(fetchUpdateShipperLocation.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchUpdateShipperLocation.fulfilled , (state , action)=>{
            state.loading = false;
        })
        .addCase(fetchUpdateShipperLocation.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
        // getAvailableDeliveries
        .addCase(getAvailableDeliveries.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(getAvailableDeliveries.fulfilled , (state , action)=>{
            state.loading = false;
            state.infoDashboardOrderShipper = action.payload;
        })
        .addCase(getAvailableDeliveries.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
    }
})
export default dashboardShipperSlice.reducer;