import { createSlice } from "@reduxjs/toolkit";
import { postsAction } from "./reuseAction";

//* dispatch one action in more than one slice
const actionSlice = createSlice({
    name:'actionSlice',
    initialState: {
        count: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(postsAction, (state, action) => {
            state.count += 1;
        })
    }
})

export default actionSlice.reducer;