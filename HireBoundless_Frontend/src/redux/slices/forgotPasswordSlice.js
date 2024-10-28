import { forgotPassword } from "../../api/create";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {};

export const fetchForgotPassword = createAsyncThunk(
    "forgotPassword/fetchForgotPassword",
    async (data, { dispatch }) => {
        const response = await forgotPassword(data);
        dispatch(putUser(response));
        return response;
    }
);

export const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        putUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },

});
export default forgotPasswordSlice.reducer;

export const { putUser } = forgotPasswordSlice.actions;