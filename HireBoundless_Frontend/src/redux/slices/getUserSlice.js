import { getUser } from "../../api/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchGetUser = createAsyncThunk(
    "getUser/fetchGetUser",
    async (data, { dispatch }) => {
        const response = await getUser(data);
        dispatch(listUser(response));
        return response
    }
);

export const getUserSlice = createSlice({
    name: "getUser",
    initialState,
    reducers: {
        listUser: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { listUser } = getUserSlice.actions;
export default getUserSlice.reducer;