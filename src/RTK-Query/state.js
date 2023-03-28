import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// slice reducer
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: {
      reducer(state) {
        state.value += 1;
      },
      prepare(num1, num2) {
        return {
          payload: num1 + num2,
        };
      },
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});





// apiSlice
const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // get all posts
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result = [], error, arg) => ([
        'Post',
        ...result.map(({id}) => ({type: 'Post', id}))
      ])
    }),
    // get a single post
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{type: 'Post', id: arg}],
    }),
    // add a new post
    addNewPosts: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
    // edit post
    editPost: builder.mutation({
      query: post => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    })
  })
})

export const {
  useGetPostsQuery, 
  useGetPostQuery, 
  useAddNewPostsMutation, 
  useEditPostMutation
} = apiSlice;



//* use // apiSlice.injectEndpoints() // to write endpoints in separate file see docs
//* use // transformResponse // handler to extract or modify the data received from the server before it's cached 




// configure store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => 
  getDefaultMiddleware().concat(apiSlice.middleware)
});

 //* if we want to initiate the getPosts fetching manually outside component but useGetPostsQuery hook already do that internally in component
// store.dispatch(apiSlice.endpoints.getPosts.initiate())


//* to get the data pass the exported result to useSelector hoot in component returned from createSelector. or use useGetPostsQuery hook in component
// const selectPosts = apiSlice.endpoints.getPosts.select();
// export const selectAllPosts = createSelector(
//   selectPosts,
//   postsResult => postsResult ?? postsResult
// );
 //* use this in component to get data
// const {
//   data,
   // ...
// } = useSelector(selectAllPosts)






export const { increment, decrement, reset } = counterSlice.actions;

// const selectValue = createSelector(
//   (name) => name,
//   (_, name) => name,
//   (name1, name2) => name1 + name2
// );

// console.log(selectValue('mehedi', 'hasan'))
