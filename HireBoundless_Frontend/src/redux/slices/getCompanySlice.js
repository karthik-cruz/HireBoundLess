import { getCompany } from "../../api/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchCompany = createAsyncThunk(
    "getCompany/fetchCompany",
    async (data, { dispatch }) => {
        const response = await getCompany(data);
        dispatch(listCompany(response));
        return response
    }
);

export const getCompanySlice = createSlice({
    name: "listCompany",
    initialState,
    reducers: {
        listCompany: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { listCompany } = getCompanySlice.actions;
export default getCompanySlice.reducer;