import { otimizeSliceError, otimizeSliceGET } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface infoDataShipperAndOrder { // lấy thông tin shipper và đơn hàng
    NameShipper: string,
    NumberPhoneShipper: string,
    LatShip: string,
    LngShip: string,
    CodeOrder: string,
    TimeCreateOrder: Date,
    Items: [{
        FoodName: string,
        Quantity: number,
        UnitPrice: number,
        ItemTotalPrice: number
    }],
    TotalPrice: number
}
export interface placeUserOrder { // vị trí người đặt hàng
    AddressUsersPlaceOrder: string;
}
export interface statusDeliveries { // trạng thái đơn hàng
    DeliveryStatus: string;
}
interface initialState {
    dataShipperAndOrder: infoDataShipperAndOrder[],
    AddressUsersPlaceOrder: placeUserOrder[],
    statusDeliveries: statusDeliveries[],
    loading: boolean,
    err: string | null,
}
const initialState: initialState = {
    dataShipperAndOrder: [],
    AddressUsersPlaceOrder: [],
    statusDeliveries: [],
    loading: false,
    err: null,
}
export const getLocationShipperDeliveries = createAsyncThunk( // get Location ShipperDeliveries and infomation order
    'deliveries/getLocationShipperDeliveries',
    async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoDataShipperAndOrder[]>(`/user/deliveries/getLocationShipperDeliveries?UserId=${UserId}&OrderId=${OrderId}`, thunkAPI)
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin shipper và đơn hàng")
        }
    }
)
export const getAddressUserPlaceOrder = createAsyncThunk( // get Address User Place Order
    'deliveries/getAddressUserPlaceOrder',
    async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<placeUserOrder[]>(`/user/deliveries/getAddressUserPlaceOrder?UserId=${UserId}&OrderId=${OrderId}`, thunkAPI)
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin địa chỉ của người đặt hàng")
        }
    }
)
export const getStatusDeliveries = createAsyncThunk( // get Status Deliveries
    'deliveries/getStatusDeliveries',
    async ({ UserId, OrderId }: { UserId: string, OrderId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<statusDeliveries[]>(`/user/deliveries/getStatusDeliveries?UserId=${UserId}&OrderId=${OrderId}`, thunkAPI)
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy trạng thái đơn hàng")
        }
    }
)
const DeliveriesSlice = createSlice({
    name: "deliveriesSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get Location ShipperDeliveries and infomation order
            .addCase(getLocationShipperDeliveries.pending, (state) => {
                state.loading = true
            })
            .addCase(getLocationShipperDeliveries.fulfilled, (state, action) => {
                state.loading = false
                state.dataShipperAndOrder = action.payload.map(order => ({
                    ...order,
                    Items: typeof order.Items === "string" ? JSON.parse(order.Items) : order.Items
                }));
            })
            .addCase(getLocationShipperDeliveries.rejected, (state, action) => {
                state.loading = false
            })
            // get Address User Place Order
            .addCase(getAddressUserPlaceOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(getAddressUserPlaceOrder.fulfilled, (state, action) => {
                state.loading = false
                state.AddressUsersPlaceOrder = action.payload
            })
            .addCase(getAddressUserPlaceOrder.rejected, (state, action) => {
                state.loading = false
            })
            // get Status Deliveries
            .addCase(getStatusDeliveries.pending, (state) => {
                state.loading = true
            })
            .addCase(getStatusDeliveries.fulfilled, (state, action) => {
                state.loading = false
                state.statusDeliveries = action.payload
            })
            .addCase(getStatusDeliveries.rejected, (state, action) => {
                state.loading = false
            })
    }
})

export default DeliveriesSlice.reducer