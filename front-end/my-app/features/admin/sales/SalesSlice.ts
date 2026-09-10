import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { otimizeSliceGET , otimizeSliceError , otimizeSlicePost , otimizeSliceDelete } from "@/features/util/helpRTK";
export interface infoSaleCode {
    AdminCodeId : number;
    CodeSale : string;
    Description : string | null ;
    Amount : string;
    MinOrderAmount : string;
    MaxAmount : string;
    EndDate : string ;
    IsActive : number ; 
    TotalUsed : number;
    UsageLimitText :  number;
    UsageRatio : string;
}
export interface postAddSale{
   CodeSale : string ; 
   Description : string ;
   DiscountType : string ;
   Amount : string;
   MinOrderAmount : string ;
   MaxAmount : string ; 
   EndDate : string;
   StartDate : string;
   UsageLimit : number
}
interface initialState {
    dataSale : infoSaleCode[];
    loading : boolean;
    err : string | null;
}
const initialState : initialState = {
    dataSale : [],
    loading : false,
    err : null
}
export const fetchInfoSale = createAsyncThunk(
    "admin/fetchInfoSale", async(_ , thunkAPI)=>{
        try{
            return await otimizeSliceGET<infoSaleCode[]>("/admin/saleCode/listSaleCode" , thunkAPI)
        }catch(err){
            return otimizeSliceError(err , thunkAPI , "lỗi lấy dữ liệu")
        }
    }
)
export const fetchAddSale = createAsyncThunk(
    "admin/fetchAddSale" , async(body : postAddSale , thunkAPI)=>{
        try{
            const res = await otimizeSlicePost<any , postAddSale>("/admin/saleCode/addSaleCode" , thunkAPI , body)
            thunkAPI.dispatch(fetchInfoSale());
            return res;
        }catch(err){
            return otimizeSliceError(err , thunkAPI , "lỗi thêm dữ liệu")
        }
    }
)
export const fetchDeleteSale = createAsyncThunk(
    "admin/fetchDeleteSale" , async(AdminCodeId : number , thunkAPI) => {
        try{
            const res = await otimizeSliceDelete<number , any>(`/admin/saleCode/deleteSaleCode/${AdminCodeId}` , thunkAPI, { AdminCodeId })
            thunkAPI.dispatch(fetchInfoSale());
            return res;
        }catch(err){
            return otimizeSliceError(err , thunkAPI , "lỗi xóa dữ liệu")
        }
    }
)
const adminSaleSlice = createSlice({
    name : "saleSlice",
    initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder
        // get data sale code
        .addCase(fetchInfoSale.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchInfoSale.fulfilled , (state , action )=>{
            state.loading = false;
            state.dataSale = action.payload;
        })
        .addCase(fetchInfoSale.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
        // add sale code
        .addCase(fetchAddSale.pending , (state)=>{
            state.loading = true;
            state.err = null;
        })
        .addCase(fetchAddSale.fulfilled , (state , action)=>{
            state.loading = false;
        })
        .addCase(fetchAddSale.rejected , (state , action)=>{
            state.loading = false;
            state.err = action.payload as string;
        })
    }
})
export default adminSaleSlice.reducer