import { otimizeSliceError, otimizeSliceGET, otimizeSliceUpdate } from "@/features/util/helpRTK";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export interface DeliveriesOrderDetail {
    DeliveryStatus: string,
    CustomerName: string,
    CustomerPhone: string,
    DeliveryAddress: string,
    TotalMoneyToCollect: number,
    ItemsSummary: string,
}
export interface DeliveryStatus{
    FINDING_DRIVER : string,
    ACCEPTED : string,
    ARRIVED_AT_STORE : string,
    PICKED_UP : string,
    DELIVERED : string,
    FAILED : string,
    CANCELLED : string
}
interface InfoRoute{
    RestaurantName : string,
    RestaurantAddress : string,
    UserAddressName : string,
    UserAddress : string,
}
interface initialState {
    DeliveriesOrderDetail: DeliveriesOrderDetail[],
    InfoRoute : InfoRoute[],
    loading: boolean,
    error: string | null
}
const initialState: initialState = {
    DeliveriesOrderDetail: [],
    InfoRoute : [],
    loading: false,
    error: null
}
export const getDeliveriesOrderDetail = createAsyncThunk( // get info order to whom shiper will deliver 
    "delivering/getDeliveriesOrderDetail", async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<DeliveriesOrderDetail[]>(`/shipper/ordering/statusOrder?UserId=${UserId}&OrderId=${OrderId}`, thunkAPI)
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin đơn hàng")
        }
    }
)
export const updateNextStatusOrder = createAsyncThunk(  // update status deliveries for shipper 
    "delivering/updateNextStatusOrder", async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceUpdate(`/shipper/ordering/updateNextStatusOrder`, thunkAPI , {UserId, OrderId})
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể cập nhật trạng thái đơn hàng")
        }
    }
)
export const getInfoRoute = createAsyncThunk( // get info route(lộ trình) for shipper deliveries 
    "delivering/getInfoRoute", async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<InfoRoute[]>(`/shipper/ordering/infoRoute?UserId=${UserId}&OrderId=${OrderId}`, thunkAPI)
        }
        catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin lộ trình")
        }
    }
)
const deliveringSlice = createSlice({
    name: "delivering",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getDeliveriesOrderDetail
            .addCase(getDeliveriesOrderDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDeliveriesOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.DeliveriesOrderDetail = action.payload;
            })
            .addCase(getDeliveriesOrderDetail.rejected, (state, action) => {
                state.loading = false;
            })
            // Update status deliveries for shipper
            .addCase(updateNextStatusOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNextStatusOrder.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateNextStatusOrder.rejected, (state, action) => {
                state.loading = false;
            })
            // getInfoRoute
            .addCase(getInfoRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInfoRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.InfoRoute = action.payload;
            })
            .addCase(getInfoRoute.rejected, (state, action) => {
                state.loading = false;
            })
    }
})
export default deliveringSlice.reducer