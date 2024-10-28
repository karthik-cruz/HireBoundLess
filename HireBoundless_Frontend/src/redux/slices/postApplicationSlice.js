import { postApplication } from "../../api/create";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {};

export const fetchPostApplication = createAsyncThunk(
    "postApplication/fetchPostApplication",
    async (data, { dispatch }) => {
        const response = await postApplication(data);
        dispatch(createApplication(response));
        return response
    }
);

export const postApplicationSlice = createSlice({
    name: "createJob",
    initialState,
    reducers: {
        createApplication: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { createApplication } = postApplicationSlice.actions;
export default postApplicationSlice.reducer;