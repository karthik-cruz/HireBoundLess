import { loginUser } from "../../api/create";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchLoginUser = createAsyncThunk(
    "loginUser/fetchLoginUser",
    async (data, { dispatch }) => {
        const response = await loginUser(data);
        dispatch(getUser(response));
        return response
    }
);

export const loginUserSlice = createSlice({
    name: "loginUser",
    initialState,
    reducers: {
        getUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { getUser } = loginUserSlice.actions;
export default loginUserSlice.reducer;