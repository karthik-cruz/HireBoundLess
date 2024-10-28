import { signupUser } from "../../api/create";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchSignupUser = createAsyncThunk(
    "signupUser/fetchSignupUser",
    async (data, { dispatch }) => {
        const response = await signupUser(data);
        dispatch(putUser(response));
        return response
    }
);

export const signupUserSlice = createSlice({
    name: "signupUser",
    initialState,
    reducers: {
        putUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { putUser } = signupUserSlice.actions;
export default signupUserSlice.reducer;