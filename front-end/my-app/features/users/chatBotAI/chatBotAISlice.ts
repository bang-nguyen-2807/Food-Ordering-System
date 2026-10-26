import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { otimizeSlicePost , otimizeSliceError } from "@/features/util/helpRTK";
export interface ChatbotAI{
    RestaurantId : string,
    messageUser : string,
}
interface initialState{
    ChatbotAI : ChatbotAI[],
    resultChatbotAI : string, // Backend trả về plain string (câu trả lời AI)
    loading: boolean,
    err : string | null,
}
const initialState: initialState = {
    ChatbotAI : [],
    resultChatbotAI: "",
    loading: false,
    err: null,
}
export const chatBoxAI = createAsyncThunk(
    "/user/aiChatBox/chatBoxAISuggestItemsRestaurant", async ({ RestaurantId, messageUser }: ChatbotAI, thunkAPI) => {
        try {
            return await otimizeSlicePost<string>(`/user/aiChatBox/chatBoxAISuggestItemsRestaurant`, thunkAPI , {
                RestaurantId,
                messageUser
            })
        }
        catch (err: any) {
            return otimizeSliceError(err, thunkAPI, "Không thể chat box AI")
        }
    }
)

const chatBotAISlice = createSlice({
    name: "chatBotAI",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(chatBoxAI.pending , (state) => {
            state.loading = true;
        })
        .addCase(chatBoxAI.fulfilled , (state , action) => {
            state.loading = false;
            state.resultChatbotAI = action.payload
        })
        .addCase(chatBoxAI.rejected , (state) => {
            state.loading = false;
        })

    }
})
export default chatBotAISlice.reducer