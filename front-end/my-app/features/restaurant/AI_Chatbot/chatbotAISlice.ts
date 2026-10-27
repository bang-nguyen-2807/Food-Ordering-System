import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { otimizeSlicePost , otimizeSliceError } from "@/features/util/helpRTK";
export interface chatbotAI{
    messageUser : string;
    UserId : string;
}
interface initialState{
    ChatbotAI : chatbotAI[],
    resultChatbotAI : string,// in dashboard
    resultChatbotAISelling : string,// in best or slow selling
    loading: boolean,
    err : string | null,
}
const initialState: initialState = {
    ChatbotAI : [],
    resultChatbotAI : "",
    resultChatbotAISelling : "",
    loading: false,
    err: null,
}
export const chatbotAIDashboard = createAsyncThunk( // ai cho dashboard
    "restaurant/chatbotAI/dashboard" , async({messageUser , UserId} : chatbotAI , thunkAPI) => {
        try{
            return await otimizeSlicePost<string>("/restaurant/chatbot/revenue-dashboard-chatbot", thunkAPI, {
                messageUser,
                UserId
            })
        }
        catch(err:any){
            return otimizeSliceError(err, thunkAPI, "Không thể chat box AI")
        }
    }
)
// 
export const ChatbotAISelling = createAsyncThunk( // ai cho best or slow selling
    "restaurant/chatbotAI/selling" , async({messageUser , UserId} : chatbotAI , thunkAPI) => {
        try{
            return await otimizeSlicePost<string>("/restaurant/chatbot/ChatbotSelling", thunkAPI, {
                messageUser,
                UserId
            })
        }
        catch(err:any){
            return otimizeSliceError(err, thunkAPI, "Không thể chat box AI")
        }
    }
)
const ChatbotAISlice = createSlice({
    name : "ChatbotAISlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        // AI in dashboard
        .addCase(chatbotAIDashboard.pending , (state) => {
            state.loading = true;
        })
        .addCase(chatbotAIDashboard.fulfilled , (state , action) => {
            state.loading = false;
            state.resultChatbotAI = action.payload
        })
        .addCase(chatbotAIDashboard.rejected , (state) => {
            state.loading = false;
        })
        // AI in manager Menu
        .addCase(ChatbotAISelling.pending , (state) => {
            state.loading = true;
        })
        .addCase(ChatbotAISelling.fulfilled , (state , action) => {
            state.loading = false;
            state.resultChatbotAISelling = action.payload
        })
        .addCase(ChatbotAISelling.rejected , (state) => {
            state.loading = false;
        })
    }
})
export default ChatbotAISlice.reducer;
