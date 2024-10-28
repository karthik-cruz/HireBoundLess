import { jobPost } from "../../api/create";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchPostJob = createAsyncThunk(
    "postJob/fetchPostJob",
    async (data, { dispatch }) => {
        const response = await jobPost(data);
        dispatch(postJob(response));
        return response
    }
);

export const jobPostSlice = createSlice({
    name: "createJob",
    initialState,
    reducers: {
        postJob: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { postJob } = jobPostSlice.actions;
export default jobPostSlice.reducer;