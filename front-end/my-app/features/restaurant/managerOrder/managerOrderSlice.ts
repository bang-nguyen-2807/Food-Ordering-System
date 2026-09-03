import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { otimizeSliceGET , otimizeSliceUpdate , otimizeSliceError } from "@/features/util/helpRTK";
export interface infoManagerOrder{
    OrderId : number;
    TimeBuy : string;
    ShipFee : string;
    CustomerName : string;
    Username : string;
    OrderItemsDetail : string;
    TotalItemsPrice : string;
    FinalOrderPrice : string;
    CodeSaleDiscount : string;
    PlaceShip : string;
    StatusOrder : string
}
export interface initialState {
    dataManagerOrder : infoManagerOrder[];
    loading : boolean;
    error : string | null
}
const initialState : initialState = {
    dataManagerOrder : [],
    loading : false,
    error : null
}
export const fetchManagerOrder = createAsyncThunk(
    "managerOrder/fetchManagerOrder" , async({UserId , OrderStatus} : {UserId : string , OrderStatus : string} , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoManagerOrder[]>(`http://localhost:5000/api/restaurant/managerOrder/order?UserId=${UserId}&OrderStatus=${OrderStatus}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin đơn hàng")
        }
    }
)
export const fetchUpdateOrderStatus = createAsyncThunk(
    "managerOrder/fetchUpdateOrderStatus",
    async ({ OrderId, OrderStatus }: { OrderId: number; OrderStatus: string }, thunkAPI) => {
        try {
            return await otimizeSliceUpdate("http://localhost:5000/api/restaurant/managerOrder/updateStatus", thunkAPI, { OrderId, OrderStatus });
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể cập nhật trạng thái đơn hàng");
        }
    }
);
const managerOrderSlice = createSlice({
    name : 'restaurantManagerOrderSlice',
    initialState , 
    reducers : {},
    extraReducers : (builder)=>{
        builder
        .addCase(fetchManagerOrder.pending , (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchManagerOrder.fulfilled , (state , action) => {
            state.loading = false;
            state.dataManagerOrder = action.payload;
        })
        .addCase(fetchManagerOrder.rejected , (state , action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(fetchUpdateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUpdateOrderStatus.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(fetchUpdateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
})
export default managerOrderSlice.reducer