import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccessToken } from "@/features/util/getAccessKey";

export interface RestaurantItem {
    RestaurantId: number;
    RestaurantName: string;
}

export interface infoOrder{
    OrderId : number,
    OrderDate : string,
    CompletedAt : string | null,
    CustomerName : string,
    CustomerPhone : string,
    ShipperName : string,
    ShipperPhone : string,
    RestaurantId?: number,
    RestaurantName : string,
    ItemsSummary : string,
    SubTotal : string,
    DiscountAmount : string ,
    DeliveryFee : string,
    OrderTotal : string,
    OrderStatus : string
}

export interface initialState {
    dataOrder : infoOrder[],
    restaurants: RestaurantItem[],
    loading : boolean,
    err : string | null
}

const initialState : initialState = {
    dataOrder : [],
    restaurants: [],
    loading : false,
    err : null
}

export interface FetchOrderParams {
    Status?: string;
    RestaurantId?: number;
}

export const fetchInfoOrder = createAsyncThunk(
    "admin/getOrder" , async(params: FetchOrderParams | string | undefined, thunkAPI)=>{
        try{
            const token = getAccessToken();
            let statusQuery = "";
            let restaurantIdQuery = "";

            if (typeof params === "string") {
                statusQuery = params;
            } else if (params && typeof params === "object") {
                statusQuery = params.Status || "";
                if (params.RestaurantId) {
                    restaurantIdQuery = params.RestaurantId.toString();
                }
            }

            const res = await fetch(`http://localhost:5000/api/admin/managerOrder/infoOrder?Status=${statusQuery}&RestaurantId=${restaurantIdQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if(!res.ok){
                const errorData = await res.json().catch(() => ({}));
                return thunkAPI.rejectWithValue(
                    errorData.message || "Không thể lấy dữ liệu!"
                );
            }
            const data = await res.json();
            return data;
        }
        catch(err){
            console.log(err);
            return thunkAPI.rejectWithValue("Không thể lấy dữ liệu!");
        }
    }
);

export const fetchRestaurantsList = createAsyncThunk(
    "admin/getRestaurantsList", async(_, thunkAPI)=>{
        try{
            const token = getAccessToken();
            const res = await fetch(`http://localhost:5000/api/admin/managerOrder/restaurants`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if(!res.ok){
                const errorData = await res.json().catch(() => ({}));
                return thunkAPI.rejectWithValue(
                    errorData.message || "Không thể lấy danh sách nhà hàng!"
                );
            }
            const data = await res.json();
            return data;
        }
        catch(err){
            console.log(err);
            return thunkAPI.rejectWithValue("Không thể lấy danh sách nhà hàng!");
        }
    }
);

const adminOrderSlice = createSlice({
    name : "orderSlice",
    initialState ,
    reducers : {},
    extraReducers : (builder)=>{
        builder
        // get infomation Order
        .addCase(fetchInfoOrder.pending, (state) => {
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchInfoOrder.fulfilled, (state, action) => {
            state.dataOrder = action.payload;
            state.loading = false;
            state.err = null;
        })
        .addCase(fetchInfoOrder.rejected, (state, action) => {
            state.loading = false;
            state.err = action.payload as string;
        })
        // get restaurants list
        .addCase(fetchRestaurantsList.fulfilled, (state, action) => {
            state.restaurants = action.payload;
        })
    }
})
export default adminOrderSlice.reducer