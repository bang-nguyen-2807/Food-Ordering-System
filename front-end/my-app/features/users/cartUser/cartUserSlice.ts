import { otimizeSliceGET, otimizeSliceError, otimizeSlicePost , otimizeSliceDelete } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface fetchItemsToCart {
    CartId: number,
    UserId: number,
    RestaurantId: number,
    CartItemsId: number,
    MenuItemId: number,
    NameMenuItems: string,
    ImageUrl: string,
    UnitPrice: number,
    Quantity: number,
    TotalPrice: string
}
export interface fetchAddressUser {
    UserAddressId: number,
    AddressName: string,
    Addresses: string
}
interface initialState {
    items: fetchItemsToCart[],
    addresses: fetchAddressUser[],
    loading: boolean,
    err: string | null
}
const initialState: initialState = {
    items: [],
    addresses : [],
    loading: false,
    err: null
}
export const getItemsToCart = createAsyncThunk(// xem thông tin giỏ hàng
    "cartUserSlice/fetchItemsToCart", async ({ RestaurantId, UserId }: { RestaurantId: string, UserId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<fetchItemsToCart[]>(`/user/cart/fetchItemsToCart/${RestaurantId}?UserId=${UserId}`, thunkAPI)
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin giỏ hàng")
        }
    }
)
export const addItemsToCart = createAsyncThunk(// thêm vào giỏ hàng
    "cartUserSlice/addItemsToCart", async ({ RestaurantId, UserId, MenuItemId, Quantity }: { RestaurantId: string, UserId: string, MenuItemId: string, Quantity: number }, thunkAPI) => {
        try {
            return await otimizeSlicePost(`/user/cart/addItemsToCart/${RestaurantId}?UserId=${UserId}&MenuItemId=${MenuItemId}&Quantity=${Quantity}`, thunkAPI , {})
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể thêm vào giỏ hàng")
        }
    }
)
export const deleteItemsFromCart = createAsyncThunk(// xóa món ăn trong giỏ hàng
    "cartUserSlice/deleteItemsFromCart", async ({ RestaurantId, UserId, MenuItemId }: { RestaurantId: string, UserId: string, MenuItemId: string }, thunkAPI) => {
        try {
            return await otimizeSliceDelete(`/user/cart/deleteItemsFromCart/${RestaurantId}?UserId=${UserId}&MenuItemId=${MenuItemId}`, thunkAPI , {})
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể xóa món ăn trong giỏ hàng")
        }
    }
)
export const createOrderAndBill = createAsyncThunk(
    "cartUserSlice/createOrderAndBill", async ({ RestaurantId, UserId, UserAddressId, DeliveryAddress, PaymentMethod, CodeSaleId, DeliveryFee }: { RestaurantId: string, UserId: string, UserAddressId?: string | null, DeliveryAddress?: string, PaymentMethod: string, CodeSaleId: string | null, DeliveryFee: string }, thunkAPI) => {
        try {
            const encodedAddress = encodeURIComponent(DeliveryAddress || "");
            return await otimizeSlicePost(`/user/cart/createOrderAndBill/${RestaurantId}?UserId=${UserId}&UserAddressId=${UserAddressId || ""}&DeliveryAddress=${encodedAddress}&PaymentMethod=${PaymentMethod}&CodeSaleId=${CodeSaleId}&DeliveryFee=${DeliveryFee}`, thunkAPI , {})
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể tạo đơn hàng và hóa đơn")
        }
    }
)
export const getAddressUser = createAsyncThunk(// get địa chỉ người dùng
    "cartUserSlice/getAddressUser", async ({ UserId }: { UserId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<fetchAddressUser[]>(`/user/cart/getAddressUser?UserId=${UserId}`, thunkAPI)
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy địa chỉ người dùng")
        }
    }
)
const CartUserSlice = createSlice({
    name: "cartUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
    // get list items in cart
    .addCase(getItemsToCart.pending , (state)=>{
        state.loading = true;
        state.err = null;
    })
    .addCase(getItemsToCart.fulfilled , (state , action)=>{
        state.loading = false;
        state.items = action.payload;
    })
    .addCase(getItemsToCart.rejected , (state)=>{
        state.loading = false;
    })
    // add items to cart
    .addCase(addItemsToCart.pending , (state)=>{
        state.loading = true;
        state.err = null;
    })
    .addCase(addItemsToCart.fulfilled , (state)=>{
        state.loading = false;
    })
    .addCase(addItemsToCart.rejected , (state)=>{
        state.loading = false;
    })
    // delete items from cart
    .addCase(deleteItemsFromCart.pending , (state)=>{
        state.loading = true;
        state.err = null;
    })
    .addCase(deleteItemsFromCart.fulfilled , (state)=>{
        state.loading = false;
    })
    .addCase(deleteItemsFromCart.rejected , (state)=>{
        state.loading = false;
    })
    // create order and bill
    .addCase(createOrderAndBill.pending , (state)=>{
        state.loading = true;
        state.err = null;
    })
    .addCase(createOrderAndBill.fulfilled , (state)=>{
        state.loading = false;
    })
    .addCase(createOrderAndBill.rejected , (state)=>{
        state.loading = false;
    })
    // get address user
    .addCase(getAddressUser.pending , (state)=>{
        state.loading = true;
        state.err = null;
    })
    .addCase(getAddressUser.fulfilled , (state , action)=>{
        state.loading = false;
        state.addresses = action.payload;
    })
    .addCase(getAddressUser.rejected , (state)=>{
        state.loading = false;
    })
    }
})

export default CartUserSlice.reducer