import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InfoLogin {
  UserId: number;
  FullName: string;
  UserName: string;
  Email: string;
  NumberPhone: string;
  SystemRole: string;
}

export interface CreateAccountPayload {
  username: string;
  password: string;
  fullName: string;
  email: string;
  numberPhone: string;
  systemRole: "CUSTOMER" | "SHIPPER" | "MERCHANT" | "ADMIN" | string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: InfoLogin;
  accessToken: string;
}

export interface CreateAccountResponse {
  status: number;
  message: string;
  data?: any;
}

interface LoginState {
  user: InfoLogin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRegisterSuccess: boolean;
  registerMessage: string | null;
}
export const getUserFromStorage = () : InfoLogin | null =>{ // đọc user từ localStorage lúc mới vừa đăng nhập để lưu info
  if(typeof window !== "undefined"){
    const saveUser = localStorage.getItem("userInfo");
    return saveUser ? JSON.parse(saveUser) : null;
  }
  return null;
}
const initialState: LoginState = {
  user: getUserFromStorage(),
  token:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: !! getUserFromStorage() ,
  isLoading: false,
  error: null,
  isRegisterSuccess: false,
  registerMessage: null,
};

// 1. POST: Đăng nhập
export const fetchLoginUser = createAsyncThunk(
  "authentication/login",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/authentication/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();

      if (res.status !== 200 || data.status !== 200) {
        return thunkAPI.rejectWithValue(
          data.message || "Tài khoản hoặc mật khẩu không chính xác!"
        );
      }

      const token = data.accessToken || data.token;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Lỗi kết nối đến Server!"
      );
    }
  }
);

// 2. POST: Tạo tài khoản (Register)
export const fetchCreateAccount = createAsyncThunk(
  "authentication/createAccount",
  async (formData: CreateAccountPayload, thunkAPI) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/authentication/createAccount",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (res.status !== 200 || data.status !== 200) {
        return thunkAPI.rejectWithValue(
          data.message || "Tạo tài khoản thất bại!"
        );
      }

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Lỗi kết nối đến Server!"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // Action Đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo"); // Xóa cả userInfo
      }
    },
    // Xóa lỗi chung
    clearError: (state) => {
      state.error = null;
    },
    // Reset đăng ký
    resetRegisterStatus: (state) => {
      state.isRegisterSuccess = false;
      state.registerMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Login
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        const userData = action.payload.data || action.payload.user;
        state.user = userData
        state.token = action.payload.accessToken || action.payload.token;
        state.error = null;
        // Lưu userInfo vào localStorage
        if (typeof window !== "undefined" && userData) {
          localStorage.setItem("userInfo", JSON.stringify(userData));
        }
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Đăng nhập thất bại!";
      })
      // Xử lý Create Account
      .addCase(fetchCreateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isRegisterSuccess = false;
      })
      .addCase(
        fetchCreateAccount.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.isRegisterSuccess = true;
          state.registerMessage =
            action.payload?.message || "Tạo tài khoản thành công!";
          state.error = null;
        }
      )
      .addCase(fetchCreateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isRegisterSuccess = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Tạo tài khoản thất bại!";
      });
  },
});

export const { logout, clearError, resetRegisterStatus } = loginSlice.actions;
export default loginSlice.reducer;
