import { companyCreate } from "../../api/create";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchCompanyCreate = createAsyncThunk(
    "companyCreate/fetchCompanyCreate",
    async (data, { dispatch }) => {
        const response = await companyCreate(data);
        dispatch(postCompany(response));
        return response
    }
);

export const companyCreateSlice = createSlice({
    name: "companyCreate",
    initialState,
    reducers: {
        postCompany: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { postCompany } = companyCreateSlice.actions;
export default companyCreateSlice.reducer;