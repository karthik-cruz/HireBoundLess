import { verifyOtp } from "../../api/create";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {};

export const fetchVerifyOtp = createAsyncThunk(
    "verifyOtp/fetchVerifyOtp",
    async (data, { dispatch }) => {
        const response = await verifyOtp(data);
        dispatch(putUser(response));
        return response;
    }
);

export const verifyOtpSlice = createSlice({
    name: "verifyOtp",
    initialState,
    reducers: {
        putUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },

});
export default verifyOtpSlice.reducer;

export const { putUser } = verifyOtpSlice.actions;