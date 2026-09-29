import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { otimizeSliceGET, otimizeSliceError } from "@/features/util/helpRTK";

export interface ActiveDeliveryOrder {
    DeliveriesId: number;
    OrderId: number;
    DeliveryStatus: string;
}

interface initialState {
    infoActiveOrder: ActiveDeliveryOrder[];
    loading: boolean;
    err: string | null;
}

const initialState: initialState = {
    infoActiveOrder: [],
    loading: false,
    err: null,
};

export const fetchActiveDeliveryOrder = createAsyncThunk(
    "navbarShipper/fetchActiveDeliveryOrder",
    async (UserId: string, thunkAPI) => {
        try {
            return await otimizeSliceGET<ActiveDeliveryOrder[]>(`/shipper/navbar/getActiveDeliveryOrder?UserId=${UserId}`, thunkAPI);
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin đơn hàng đang giao");
        }
    }
);

const navbarShipperSlice = createSlice({
    name: "navbarShipper",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveDeliveryOrder.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchActiveDeliveryOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.infoActiveOrder = action.payload;
            })
            .addCase(fetchActiveDeliveryOrder.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload as string;
            });
    }
});

export default navbarShipperSlice.reducer;
