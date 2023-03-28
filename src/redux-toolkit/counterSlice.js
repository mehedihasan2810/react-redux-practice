import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postsAction } from "./reuseAction";

//* createAsyncThunk to do async stuff like data fetching
export const fetchUsersById = createAsyncThunk(
    'posts/fetchById',
    async (userId, thunkApi) => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`);
        const data = await res.json();
        //* console.log(thunkApi)
        return data;
    }
)
// ------------


const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
        posts: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
        reset: (state) => {
            state.value = 0;
        },
        asyncIncrement: (state, action) => {
            state.value += action.payload;
        }
    },
    //* for createAsyncThunks
    extraReducers: (builder) => {
        builder.addCase(fetchUsersById.pending, (state, action) => {
           state.status = 'loading';
        })
        builder.addCase(fetchUsersById.fulfilled, (state, action) => {
           state.posts.push(action.payload)
           state.status = 'idle';
        })
        builder.addCase(fetchUsersById.rejected, (state, action) => {
           state.error = action.payload;
           state.status = 'idle';
        })
        
        //* dispatch one action in more than one slice
        .addCase(postsAction, (state, action) => {
            state.value += 1;
        })
    }
});


export const {
    increment, 
    decrement, 
    incrementByAmount, 
    reset,
    asyncIncrement,
} = counterSlice.actions;


//* normal thunks for async operations
export const asyncIncrementThunks = (num) => (dispatch) => {
    setTimeout(() => dispatch(asyncIncrement(num)), 1000);
}

//* normal thunks for data fetching
// const fetchUsers = () => async (dispatch) => {
//     dispatch(usersLoading())
//     const response = await usersAPI.fetchAll()
//     dispatch(usersReceived(response.data))
//   }




export default counterSlice.reducer;



