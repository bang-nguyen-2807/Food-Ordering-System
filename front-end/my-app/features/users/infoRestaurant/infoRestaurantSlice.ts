import { otimizeSliceGET , otimizeSliceError } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface InfoRestaurant{
    MenuItemId : number,
    NameMenuItems : string,
    ImageUrl : string,
    Price : string,
    is_available : number,
    CategoriesRestaurantName : string,
    CategorieRestaurantsCode : string,
    CategoriesRestaurantId : number,
    RestaurantName ?: string
}
export interface InfoCategoriesRestaurant{
    CategoriesRestaurantName : string,
    CategoriesRestaurantId : number
}
interface InitialState {
    dataRestaurant : InfoRestaurant[],
    dataCategories : InfoCategoriesRestaurant[],
    loading : boolean,
    err : string | null
}
const initialState : InitialState = {
    dataRestaurant : [],// getListMenu in restaurant
    dataCategories : [],// get list catagories in restaurant
    loading : false,
    err : null
}
export const fetchInfoRestaurant = createAsyncThunk(
    "infoRestaurant/fetchInfoRestaurant", async({RestaurantId , CategoriesRestaurantId} : {RestaurantId : string , CategoriesRestaurantId ?: string} , thunkAPI)=>{
        try{
            let queryString = CategoriesRestaurantId ? `?CategoriesRestaurantId=${CategoriesRestaurantId}` : "" ; // kiểm tra nếu CategoriesRestaurantId rỗng thì trả về ""
            return await otimizeSliceGET<InfoRestaurant[]>(`/user/infoRestaurant/getInfoRestaurant/${RestaurantId}${queryString}` , thunkAPI)
        }catch(err : any){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin nhà hàng")
        }
    }
)
export const fetchListCategoriesRestaurant = createAsyncThunk(
    "infoRestaurant/fetchListCategoriesRestaurant", async({RestaurantId} : {RestaurantId : string} , thunkAPI)=>{
        try{
            return await otimizeSliceGET<InfoCategoriesRestaurant[]>(`/user/infoRestaurant/getListCategoriesRestaurant?RestaurantId=${RestaurantId}` , thunkAPI)
        }catch(err : any){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy danh sách danh mục nhà hàng")
        }
    }
)
const infoRestaurantSlice = createSlice({
    name : "infoRestaurant",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        // GET infoRestaurant
        .addCase(fetchInfoRestaurant.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchInfoRestaurant.fulfilled , (state , action)=>{
            state.loading = false;
            state.dataRestaurant = action.payload;
        })
        .addCase(fetchInfoRestaurant.rejected , (state)=>{
            state.loading = false;
        })
        // GET listCategoriesRestaurant
        .addCase(fetchListCategoriesRestaurant.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchListCategoriesRestaurant.fulfilled , (state , action)=>{
            state.loading = false;
            state.dataCategories = action.payload;
        })
        .addCase(fetchListCategoriesRestaurant.rejected , (state)=>{
            state.loading = false;
        })
    }
})
export default infoRestaurantSlice.reducer
