import { resetPassword } from "../../api/create";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {};

export const fetchResetPassword = createAsyncThunk(
    "resetPassword/fetchResetPassword",
    async (data, { dispatch }) => {
        const response = await resetPassword(data);
        dispatch(putUser(response));
        return response;
    }
);

export const resetPasswordSlice = createSlice({
    name: "resetPassword",
    initialState,
    reducers: {
        putUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },

});
export default resetPasswordSlice.reducer;

export const { putUser } = resetPasswordSlice.actions;