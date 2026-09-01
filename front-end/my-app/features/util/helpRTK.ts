import { AsyncThunkConfig, GetThunkAPI } from "@reduxjs/toolkit";
import { getAccessToken } from "./getAccessKey"
// otimization API calls in redux toolkit
// GET OTIMIZE
export async function otimizeSliceGET<T>(url: string, ThunkAPI: GetThunkAPI<AsyncThunkConfig>) {

    const token = getAccessToken();
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return ThunkAPI.rejectWithValue(
            errorData.message || "Không thể lấy dữ liệu!"
        );
    }
    const data: T = await res.json();
    return data;
}
// POST OTIMIZE
export async function otimizeSlicePost<T, B = any>(url: string, ThunkAPI: GetThunkAPI<AsyncThunkConfig>, body: B) {
    const token = getAccessToken();
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return ThunkAPI.rejectWithValue(
            errorData.message || "Không thể thêm dữ liệu!"
        );
    }
    const result: T = await res.json();
    return result;
}
// UPDATE OTIMIZE
export async function otimizeSliceUpdate<T, B = any>(url: string, ThunkAPI: GetThunkAPI<AsyncThunkConfig>, body: B) {
    const token = getAccessToken();
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return ThunkAPI.rejectWithValue(
            errorData.message || "Không thể cập nhật dữ liệu!"
        );
    }
    const result: T = await res.json();
    return result;
}
// DELETE OTIMIZE
export async function otimizeSliceDelete<T, B = any>(url: string, ThunkAPI: GetThunkAPI<AsyncThunkConfig>, body: B) {
    const token = getAccessToken();
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return ThunkAPI.rejectWithValue(
            errorData.message || "Không thể xóa dữ liệu!"
        );
    }
    const result: T = await res.json();
    return result;
}
// Error handler for RTK
export function otimizeSliceError(err: any, ThunkAPI: GetThunkAPI<AsyncThunkConfig>, message: string) {
    console.log(err);
    return ThunkAPI.rejectWithValue(message);
}