import { getJobs } from "../../api/list";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchGetJobs = createAsyncThunk(
    "getJobs/fetchGetJobs",
    async (data, { dispatch }) => {
        const response = await getJobs(data);
        dispatch(listJobs(response));
        return response
    }
);

export const getJobsSlice = createSlice({
    name: "listCompany",
    initialState,
    reducers: {
        listJobs: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { listJobs } = getJobsSlice.actions;
export default getJobsSlice.reducer;