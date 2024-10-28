import { updateCompany } from "../../api/update";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchUpdateCompany = createAsyncThunk(
    "putCompany/fetchUpdateCompany",
    async (data, { dispatch }) => {
        const response = await updateCompany(data.params, data.data);
        dispatch(putCompany(response));
        return response
    }
);

export const updateCompanySlice = createSlice({
    name: "listCompany",
    initialState,
    reducers: {
        putCompany: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { putCompany } = updateCompanySlice.actions;
export default updateCompanySlice.reducer;