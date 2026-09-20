import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { otimizeSliceGET , otimizeSliceError  } from "@/features/util/helpRTK";

interface infoRestaurant{
    RestaurantId : number;
    RestaurantName : string;
    ImageUrl : string;
    Addresses : string;
    MinTime?: number;
    MaxTime?: number;
}
interface infoCatagories{
    CategoriesId : number;
    CategoriesName : string;
    CategoriesCode : string;
}
interface initialState {
    infoRestaurant : infoRestaurant[];
    infoCatagories : infoCatagories[];
    loading  : boolean;
    err    : string | null
}
const initialState : initialState = {
    infoRestaurant : [],
    infoCatagories : [],
    loading: false,
    err: null,
}
export const getListRestaurant = createAsyncThunk(
    "dashboardShipper/getListRestaurant" , async({lat , lng} : {lat : string , lng : string},thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoRestaurant[]>(`/user/home/getListRestaurant?lat=${lat}&lng=${lng}` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin danh sách nhà hàng")
        }
    }
)
export const getListCatagories = createAsyncThunk(
    "dashboardShipper/getListCatagories" , async(_,thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoCatagories[]>(`/user/home/getListCatagories` , thunkAPI)
        }
        catch(err){
            return otimizeSliceError(err , thunkAPI , "Không thể lấy thông tin danh sách loại đồ ăn")
        }
    }
)
const HomeSlice = createSlice({
    name : "HomeUser" , 
    initialState ,
    reducers : {},
    extraReducers : (builder)=>{
        builder
        // getListRestaurant
        .addCase(getListRestaurant.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(getListRestaurant.fulfilled , (state , action)=>{
            state.loading = false;
            state.infoRestaurant = action.payload;
        })
        .addCase(getListRestaurant.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
        // getListCatagories
        .addCase(getListCatagories.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(getListCatagories.fulfilled , (state , action)=>{
            state.loading = false;
            state.infoCatagories = action.payload;
        })
        .addCase(getListCatagories.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
    }
})
export default HomeSlice.reducer
