import { getAccessToken } from "@/features/util/getAccessKey";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface infoUsers {
  UserId: number;
  FullName: string;
  UserName: string;
  NumberPhone: string;
  Email: string;
  Addresses: string;
  AddressesName: string;
}
export interface infoRestaurant {
  RestaurantId: number;
  RestaurantName: string;
  FullName: string;
  Addresses: string;
  RestaurantRole: string;
}
export interface infoShipper {
  ShipperId?: number;
  UserId: number;
  FullName: string;
  UserName: string;
  NumberPhone: string;
  Email: string;
}
export interface infoShipperAdd {
  UserId?: number;
  FullName: string;
  UserName: string;
  Password?: string;
  NumberPhone: string;
  Email: string;
}
export interface infoShipperUpdate {
  ShipperId: number;
  UserId: number;
  FullName: string;
  UserName: string;
  NumberPhone: string;
  Email: string;
}
export interface infoRestaurantAdd {
  RestaurantName: string;
  UserId: number;
  Addresses: string;
  RestaurantRole: string;
}
export interface infoRestaurantUpdate {
  RestaurantId: number;
  RestaurantName: string;
  UserId: number;
  Addresses: string;
  RestaurantRole: string;
}
export interface infoUserAdd {
  FullName: string;
  UserName: string;
  NumberPhone: string;
  Email: string;
  Password?: string;
}
export interface infoUserUpdate {
  UserId: number;
  FullName: string;
  UserName: string;
  NumberPhone: string;
  Email: string;
}
interface initialState {
  dataUsers: infoUsers[];
  dataRestaurant: infoRestaurant[];
  dataShipper: infoShipper[];
  loading: boolean;
  err: string | null;
}
const initialState: initialState = {
  dataUsers: [],
  dataRestaurant: [],
  dataShipper: [],
  loading: false,
  err: null,
};
export const fetchInfoUser = createAsyncThunk(
  // info user
  "admin/User",
  async (_, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <--- Gửi token đi
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(
          errorData.message || "Không thể lấy dữ liệu!"
        );
      }
      const data: infoUsers[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu!");
    }
  }
);
export const fetchInfoRestaurant = createAsyncThunk(
  // info Restaurant
  "admin/Restaurant",
  async (_, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/restaurant",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <--- Gửi token đi
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(
          errorData.message || "Không thể lấy dữ liệu!"
        );
      }
      const data: infoRestaurant[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu!");
    }
  }
);
export const fetchInfoShipper = createAsyncThunk(
  // info shipper
  "admin/Shipper",
  async (_, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/shipper",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <--- Gửi token đi
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return thunkAPI.rejectWithValue(
          errData.message || "Không thể lấy dữ liệu!"
        );
      }
      const data: infoShipper[] = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu!");
    }
  }
);
export const fetchAddUser = createAsyncThunk(
  // ADD USER
  "admin/addUser",
  async (
    { FullName, UserName, NumberPhone, Email, Password }: infoUserAdd,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/addUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            FullName,
            UserName,
            NumberPhone,
            Email,
            Password,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoUser());
        return result;
      }
      return thunkAPI.rejectWithValue(
        result.message || "Thêm người dùng thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);
export const fetchUpdateUser = createAsyncThunk(
  // UPDATE USER
  "admin/updateUser",
  async (
    { UserId, FullName, UserName, NumberPhone, Email }: infoUserUpdate,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/updateUser/${UserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <--- Gửi token đi
          },
          body: JSON.stringify({ FullName, UserName, NumberPhone, Email }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoUser());
        return result.message;
      }
      return thunkAPI.rejectWithValue(
        result.message || "Cập nhật hồ sơ thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);
export const fetchDeleteUser = createAsyncThunk(
  "admin/deleteUser",
  async ({ UserId }: { UserId: number }, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/deleteUser/${UserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <--- Gửi token đi
          },
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoUser());
        return result.message || "Xóa người dùng thành công";
      }
      return thunkAPI.rejectWithValue(result.message || "Xóa hồ sơ thất bại");
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

// RESTAURANT THUNKS
export const fetchAddRestaurant = createAsyncThunk(
  "admin/addRestaurant",
  async (
    { RestaurantName, UserId, Addresses, RestaurantRole }: infoRestaurantAdd,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/addRestaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            RestaurantName,
            UserId,
            Addresses,
            RestaurantRole,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoRestaurant());
        return result.message || "Thêm nhà hàng thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Thêm nhà hàng thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

export const fetchUpdateRestaurant = createAsyncThunk(
  "admin/updateRestaurant",
  async (
    {
      RestaurantId,
      RestaurantName,
      UserId,
      Addresses,
      RestaurantRole,
    }: infoRestaurantUpdate,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/updateRestaurant/${RestaurantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            RestaurantName,
            UserId,
            Addresses,
            RestaurantRole,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoRestaurant());
        return result.message || "Cập nhật nhà hàng thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Cập nhật nhà hàng thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

export const fetchDeleteRestaurant = createAsyncThunk(
  "admin/deleteRestaurant",
  async ({ RestaurantId }: { RestaurantId: number }, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/deleteRestaurant/${RestaurantId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoRestaurant());
        return result.message || "Xóa nhà hàng thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Xóa nhà hàng thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

// SHIPPER THUNKS
export const fetchAddShipper = createAsyncThunk(
  "admin/addShipper",
  async (
    { FullName, UserName, Password, NumberPhone, Email, UserId }: infoShipperAdd,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        "http://localhost:5000/api/admin/userAndPartness/addShipper",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            FullName,
            UserName,
            Password,
            NumberPhone,
            Email,
            UserId,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoShipper());
        return result.message || "Thêm shipper thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Thêm shipper thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

export const fetchUpdateShipper = createAsyncThunk(
  "admin/updateShipper",
  async (
    {
      ShipperId,
      UserId,
      FullName,
      UserName,
      NumberPhone,
      Email,
    }: infoShipperUpdate,
    thunkAPI
  ) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/updateShipper/${ShipperId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UserId,
            FullName,
            UserName,
            NumberPhone,
            Email,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoShipper());
        return result.message || "Cập nhật shipper thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Cập nhật shipper thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

export const fetchDeleteShipper = createAsyncThunk(
  "admin/deleteShipper",
  async ({ ShipperId }: { ShipperId: number }, thunkAPI) => {
    try {
      const token = getAccessToken();
      const res = await fetch(
        `http://localhost:5000/api/admin/userAndPartness/deleteShipper/${ShipperId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (res.ok) {
        thunkAPI.dispatch(fetchInfoShipper());
        return result.message || "Xóa shipper thành công";
      }
      return thunkAPI.rejectWithValue(
        result.message || "Xóa shipper thất bại"
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Lỗi kết nối máy chủ");
    }
  }
);

const adminUserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // info user
      .addCase(fetchInfoUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInfoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.dataUsers = action.payload;
      })
      .addCase(fetchInfoUser.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu";
      })
      // info restaurant
      .addCase(fetchInfoRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInfoRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.dataRestaurant = action.payload;
      })
      .addCase(fetchInfoRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu";
      })
      //add user
      .addCase(fetchAddUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAddUser.rejected, (state, action) => {
        state.loading = false;
        state.err =
          (action.payload as string) ||
          action.error.message ||
          "Xảy ra lỗi khi thêm người dùng";
      })
      // update user
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      //delete User
      .addCase(fetchDeleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDeleteUser.rejected, (state) => {
        state.loading = false;
      })
      // add Restaurant
      .addCase(fetchAddRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddRestaurant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAddRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.err = (action.payload as string) || "Thêm nhà hàng thất bại";
      })
      // update Restaurant
      .addCase(fetchUpdateRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateRestaurant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateRestaurant.rejected, (state) => {
        state.loading = false;
      })
      // delete Restaurant
      .addCase(fetchDeleteRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteRestaurant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDeleteRestaurant.rejected, (state) => {
        state.loading = false;
      })
      // info shipper
      .addCase(fetchInfoShipper.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInfoShipper.fulfilled, (state, action) => {
        state.loading = false;
        state.dataShipper = action.payload;
      })
      .addCase(fetchInfoShipper.rejected, (state, action) => {
        state.loading = false;
        state.err = action.error.message || "Xảy ra lỗi khi tải dữ liệu shipper";
      })
      // add shipper
      .addCase(fetchAddShipper.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddShipper.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAddShipper.rejected, (state, action) => {
        state.loading = false;
        state.err = (action.payload as string) || "Thêm shipper thất bại";
      })
      // update shipper
      .addCase(fetchUpdateShipper.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateShipper.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateShipper.rejected, (state) => {
        state.loading = false;
      })
      // delete shipper
      .addCase(fetchDeleteShipper.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteShipper.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDeleteShipper.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default adminUserSlice.reducer;
