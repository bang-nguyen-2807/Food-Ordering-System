import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { otimizeSliceGET, otimizeSlicePost, otimizeSliceUpdate, otimizeSliceDelete, otimizeSliceError } from "@/features/util/helpRTK";

export interface infoMenuItem {
    MenuItemId: number;
    ImageItems: string;
    NameItems: string;
    Description?: string;
    CateName: string;
    Amount: number;
    OpenOrClose: boolean;
}

export interface infoCategoriesRestaurant {
    CategoriesRestaurantId: number;
    CategoriesRestaurantName: string;
}

export interface initialState {
    dataManagerMenu: infoMenuItem[];
    categoriesList: infoCategoriesRestaurant[];
    loading: boolean;
    error: string | null;
}

const initialState: initialState = {
    dataManagerMenu: [],
    categoriesList: [],
    loading: false,
    error: null
};

export const fetchManagerMenu = createAsyncThunk(
    "managerMenu/fetchManagerMenu",
    async ({ UserId, CategoriesRestaurantId }: { UserId: string; CategoriesRestaurantId: string }, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoMenuItem[]>(
                `/restaurant/managerMenu/menu?UserId=${UserId}&CategoriesRestaurantId=${CategoriesRestaurantId}`,
                thunkAPI
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy thông tin thực đơn!");
        }
    }
);

export const fetchCategoriesRestaurant = createAsyncThunk(
    "managerMenu/fetchCategoriesRestaurant",
    async (UserId: string, thunkAPI) => {
        try {
            return await otimizeSliceGET<infoCategoriesRestaurant[]>(
                `/restaurant/managerMenu/categories?UserId=${UserId}`,
                thunkAPI
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể lấy danh sách danh mục!");
        }
    }
);

export const fetchAddMenuItem = createAsyncThunk(
    "managerMenu/fetchAddMenuItem",
    async (
        data: {
            UserId: number;
            CategoriesRestaurantId?: number;
            NameMenuItems: string;
            Description?: string;
            Price: number;
            ImageUrl?: string;
            is_available: boolean;
        },
        thunkAPI
    ) => {
        try {
            return await otimizeSlicePost(
                "/restaurant/managerMenu/addMenuItem",
                thunkAPI,
                data
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể thêm món ăn mới!");
        }
    }
);

export const fetchAddCategoriesRestaurant = createAsyncThunk(
    "managerMenu/fetchAddCategoriesRestaurant",
    async (
        data: {
            UserId: number;
            CategoriesRestaurantName: string;
            CategorieRestaurantsCode: string;
            Descriptions?: string;
            ImageUrl?: string;
        },
        thunkAPI
    ) => {
        try {
            return await otimizeSlicePost(
                "/restaurant/managerMenu/addCategories",
                thunkAPI,
                data
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể thêm danh mục mới!");
        }
    }
);

export const fetchDeleteMenuItem = createAsyncThunk(
    "managerMenu/fetchDeleteMenuItem",
    async (MenuItemId: number, thunkAPI) => {
        try {
            return await otimizeSliceDelete(
                `/restaurant/managerMenu/deleteMenuItem/${MenuItemId}`,
                thunkAPI,
                {}
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể xóa món ăn!");
        }
    }
);

export const fetchDeleteCategoriesRestaurant = createAsyncThunk(
    "managerMenu/fetchDeleteCategoriesRestaurant",
    async (CategoriesRestaurantId: number, thunkAPI) => {
        try {
            return await otimizeSliceDelete(
                `/restaurant/managerMenu/deleteCategories/${CategoriesRestaurantId}`,
                thunkAPI,
                {}
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể xóa danh mục!");
        }
    }
);

export const fetchUpdateMenuItem = createAsyncThunk(
    "managerMenu/fetchUpdateMenuItem",
    async (
        data: {
            MenuItemId: number;
            NameMenuItems: string;
            Description?: string;
            Price: number;
            ImageUrl?: string;
            is_available: boolean;
        },
        thunkAPI
    ) => {
        try {
            return await otimizeSliceUpdate(
                "/restaurant/managerMenu/updateMenuItem",
                thunkAPI,
                data
            );
        } catch (err) {
            return otimizeSliceError(err, thunkAPI, "Không thể cập nhật món ăn!");
        }
    }
);

const managerMenuSlice = createSlice({
    name: "restaurantManagerMenuSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagerMenu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagerMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.dataManagerMenu = action.payload;
            })
            .addCase(fetchManagerMenu.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCategoriesRestaurant.fulfilled, (state, action) => {
                state.categoriesList = action.payload;
            })
            .addCase(fetchAddMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddMenuItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchAddMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAddCategoriesRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddCategoriesRestaurant.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchAddCategoriesRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDeleteMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeleteMenuItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchDeleteMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDeleteCategoriesRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeleteCategoriesRestaurant.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchDeleteCategoriesRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUpdateMenuItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUpdateMenuItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchUpdateMenuItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default managerMenuSlice.reducer;
