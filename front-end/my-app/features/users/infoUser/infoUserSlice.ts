import { otimizeSliceError, otimizeSlicePost, otimizeSliceGET , otimizeSliceDelete , otimizeSliceUpdate } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface InfoAddressUser {
    AddressName: string,
    Addresses: string,
    UserId: string
}
export interface fetchAddressUser {
    UserAddressId: number,
    AddressName: string,
    Addresses: string
}
export interface InfoUser {
    FullName: string,
    NumberPhone: string,
    Email: string
}
export interface changePassword{
    UserId : string,
    oldPassword : string,
    newPassword : string
}
interface InitialState {
    dataUserAddress: InfoAddressUser[],
    addresses: fetchAddressUser[],
    infoUser : InfoUser[],
    loading: boolean,
    err: string | null
}
const initialState: InitialState = {
    dataUserAddress: [],
    addresses: [],
    infoUser : [],
    loading: false,
    err: null
}
export const fetchAddAddressUser = createAsyncThunk(
    "infoUserSlice/fetchAddAddressUser", async ({ AddressName, Addresses, UserId }: { AddressName: string, Addresses: string, UserId: string }, thunkAPI) => {
        try {
            return await otimizeSlicePost<InfoAddressUser[]>(`/user/info/addAddress`, thunkAPI, { AddressName, Addresses, UserId })
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể thêm địa chỉ")
        }
    }
)
export const getAddressUser = createAsyncThunk(// get địa chỉ người dùng
    "cartUserSlice/getAddressUser", async ({ UserId }: { UserId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<fetchAddressUser[]>(`/user/info/getAddressUser?UserId=${UserId}`, thunkAPI)
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy địa chỉ người dùng")
        }
    }
)
export const getInfoUser = createAsyncThunk(
    "infoUserSlice/getInfoUser", async ({ UserId }: { UserId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<InfoUser[]>(`/user/info/getInfoUser?UserId=${UserId}`, thunkAPI)
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin người dùng")
        }
    }
)
export const deleteAddressUser = createAsyncThunk(
    "infoUserSlice/deleteAddressUser", async ({ UserAddressId }: { UserAddressId: string }, thunkAPI) => {
        try {
            return await otimizeSliceDelete<fetchAddressUser[]>(`/user/info/deleteAddressUser`, thunkAPI, { UserAddressId })
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể xóa địa chỉ")
        }
    }
)
export const updateInfoUser = createAsyncThunk(
    "infoUserSlice/updateInfoUser", async ({ FullName, NumberPhone, Email, UserId }: { FullName: string, NumberPhone: string, Email: string, UserId: string }, thunkAPI) => {
        try {
            return await otimizeSliceUpdate<InfoUser[]>(`/user/info/updateInfoUser`, thunkAPI, { FullName, NumberPhone, Email, UserId })
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể cập nhật thông tin")
        }
    }
)
export const changePassword = createAsyncThunk(
    "infoUserSlice/changePassword", async ({ UserId, oldPassword, newPassword }: { UserId: string, oldPassword: string, newPassword: string }, thunkAPI) => {
        try {
            return await otimizeSliceUpdate<changePassword>(`/user/info/changePassword`, thunkAPI, { UserId, oldPassword, newPassword })
        } catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể đổi mật khẩu")
        }
    }
)

const infoUserSlice = createSlice({
    name: "infoUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddAddressUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(fetchAddAddressUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchAddAddressUser.rejected, (state) => {
                state.loading = false;
            })
            // get address user
            .addCase(getAddressUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getAddressUser.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(getAddressUser.rejected, (state) => {
                state.loading = false;
            })
            // get infoUser
            .addCase(getInfoUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getInfoUser.fulfilled, (state, action) => {
                state.loading = false;
                state.infoUser = action.payload;
            })
            .addCase(getInfoUser.rejected, (state) => {
                state.loading = false;
            })
            // delete address user
            .addCase(deleteAddressUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(deleteAddressUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteAddressUser.rejected, (state) => {
                state.loading = false;
            })
            // update info User
            .addCase(updateInfoUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(updateInfoUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateInfoUser.rejected, (state) => {
                state.loading = false;
            })
            // change password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state) => {
                state.loading = false;
            })
    }
})
export default infoUserSlice.reducer