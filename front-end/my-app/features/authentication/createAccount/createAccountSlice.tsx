import { getAccessToken } from "@/features/util/getAccessKey";
import { HeadUrl } from "@/features/util/helpRTK";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CreateAccountPayload {
  username: string;
  password: string;
  fullName: string;
  numberPhone: string;
  email: string;
  systemRole: "CUSTOMER" | "SHIPPER" | "MERCHANT";
}

export interface CreateAccountResponse {
  status: number;
  message: string;
  data?: {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    systemRole: string;
  };
}

interface CreateAccountState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CreateAccountState = {
  isLoading: false,
  isSuccess: false,
  error: null,
  successMessage: null,
};

// POST: Gửi request tạo tài khoản tới API
export const fetchCreateAccount = createAsyncThunk(
  "authentication/createAccount",
  async (payload: CreateAccountPayload, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `${HeadUrl}/authentication/createAccount`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: CreateAccountResponse = await res.json();

      // Nếu Backend trả về status !== 200
      if (res.status !== 200 || data.status !== 200) {
        return thunkAPI.rejectWithValue(
          data.message ||
            "Tạo tài khoản thất bại, vui lòng kiểm tra lại thông tin!"
        );
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Không thể kết nối đến máy chủ!"
      );
    }
  }
);

const createAccountSlice = createSlice({
  name: "createAccount",
  initialState,
  reducers: {
    resetCreateAccountState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateAccount.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchCreateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        state.successMessage =
          action.payload.message || "Đăng ký tài khoản thành công!";
      })
      .addCase(fetchCreateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || "Đã có lỗi xảy ra khi tạo tài khoản!";
      });
  },
});

export const { resetCreateAccountState } = createAccountSlice.actions;
export default createAccountSlice.reducer;
