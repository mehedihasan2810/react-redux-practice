import { createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//* 1. https://redux-toolkit.js.org/rtk-query/usage/streaming-updates#websocket-chat-api-with-a-transformed-response-shape
//* 2. https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#manipulating-response-data
const messagesAdapter = createEntityAdapter()

export const dataApi = createApi({

  //* https://redux-toolkit.js.org/rtk-query/api/createApi#reducerpath
    reducerPath: 'dataApi',

    //* https://redux-toolkit.js.org/rtk-query/api/createApi#tagtypes
    tagTypes: ['Post', 'User'],
    baseQuery: fetchBaseQuery({ 
      baseUrl: 'http://localhost:3000',
      
      //* https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#adding-a-custom-timeout-to-requests
      timeout: 1000,
    }),

    //* 1. https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#manipulating-cache-behavior
    //* 2. https://redux-toolkit.js.org/rtk-query/api/createApi#keepunuseddatafor
    keepUnusedDataFor: 30,
    
    //* 1. https://redux-toolkit.js.org/rtk-query/api/createApi#refetchonmountorargchange
    //* 2. https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#encouraging-re-fetching-with-refetchonmountorargchange
    refetchOnMountOrArgChange: 30,

    //* 1. https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-window-focus-with-refetchonfocus
    //* 2. https://redux-toolkit.js.org/rtk-query/api/createApi#refetchonfocus
    refetchOnFocus: true,
    
    //* 1. https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-network-reconnection-with-refetchonreconnect
    //* 2. https://redux-toolkit.js.org/rtk-query/api/createApi#refetchonreconnect 
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getDatas: builder.query({
            query: (name) => `${name}`,
           
            //* https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#examples---queryfn 
            // queryFn: () => ({ data: null }),
           
            // ! normalizing. see these links
           //* 1. https://redux-toolkit.js.org/rtk-query/usage/streaming-updates#websocket-chat-api-with-a-transformed-response-shape
           //* 2. https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#manipulating-response-data
            transformResponse(response) {
              return messagesAdapter.addMany(
                messagesAdapter.getInitialState(),
                response
              )
            },

             //* Pick out data and prevent nested properties in a hook or selector (it will be called before caching)
            transformResponse: (response, meta, arg) => response,

            //* Pick out errors and prevent nested properties in a hook or selector (it will be called before caching)
            transformErrorResponse: (result, meta, arg) => response.status,

            //* invalidation 
            //* https://redux-toolkit.js.org/rtk-query/usage/mutations#advanced-mutations-with-revalidation
             // Provides a list of `Posts` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Posts` element was added.
      providesTags: (result) =>
      // is result available?
      result
        ? // successful query
          [
            ...result.map(({ id }) => ({ type: 'Post', id })),
            { type: 'Post', id: 'LIST' },
          ]
        : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
          [{ type: 'Post', id: 'LIST' }],

              //* The 2nd parameter is the destructured `QueryLifecycleApi`
            //   these are for optimistic updates
            // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
              async onQueryStarted(
                arg,
                {
                  dispatch,
                  getState,
                  extra,
                  requestId,
                  queryFulfilled,
                  getCacheEntry,
                  updateCachedData,
                }
              ) {},

             //* The 2nd parameter is the destructured `QueryCacheLifecycleApi`
             //   these are for optimistic updates
             // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
               async onCacheEntryAdded(
                    arg,
                    {
                    dispatch,
                    getState,
                    extra,
                    requestId,
                    cacheEntryRemoved,
                    cacheDataLoaded,
                    getCacheEntry,
                    updateCachedData,
                    }
                ) {},
                // https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#manipulating-cache-behavior
                keepUnusedDataFor: 5,
        }),
        
        //* get a single data
        getData: builder.query({
            query: (id) => `users/${id}`,
            providesTags: (result, error, id) => [{type: 'Post', id}],
        }),
        
        //* add a single data(POST) 
        addData: builder.mutation({
            query: (newUser) => ({
                url: `users`,
                method: 'POST',
               
                //* https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-the-body
                body: newUser,
            }),

            //* https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#tag-invalidation-behavior
            invalidatesTags: [{type: 'Post', id: 'LIST'}],
        }),

        //* update a single user(PATCH) 
        updateData: builder.mutation({
            query: ({id, ...updateUser}) => ({
                url: `users/${id}`,
                method: 'PATCH',
                body: updateUser,
            }), 
           
            //! Optimistic updates
           //* https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
            async onQueryStarted({id, ...updateUser}, {dispatch, queryFulfilled}) {
              const patchResult = dispatch(
                dataApi.util.updateQueryData('getData', id, (draft) => {
                  Object.assign(draft, updateUser)
                })
              )
              try{
                await queryFulfilled
              } catch {
                patchResult.undo()
                //Alternative
                //* dispatch(api.util.invalidateTags([{type: 'Post', id}]))
            /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           ** dispatch(api.util.invalidateTags([{type: 'Post', id}]))
           */
              }
            },


            invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}],
        })
    })
})

export const { useGetDatasQuery, useGetDataQuery, useAddDataMutation, useUpdateDataMutation } = dataApi;


//* alternative of useGetDataQuery hook 
// const useQueryResult = dataApi.endpoints.getDatas.useQuery(arg, options)


// https://redux-toolkit.js.org/rtk-query/usage/prefetching#prefetching-with-react-hooks
// usePrefetch


//* 1. https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#injecting-endpoints
//! 2. https://redux-toolkit.js.org/rtk-query/usage/code-splitting
// injectEnpoints()

//* https://redux-toolkit.js.org/rtk-query/usage/usage-without-react-hooks#removing-a-subscription
// dispatch the query instantly
// Adding a cache subscription
//* const result = store.dispatch(api.endpoints.getPosts.initiate())

// Removing the corresponding cache subscription
// result.unsubscribe()

//* refetchOnMount/Reconnect/Focus
//* https://redux-toolkit.js.org/rtk-query/api/setupListeners
// setupListeners(store.dispatch);
// dispatch(api.internalActions.onFocus())


//* https://redux-toolkit.js.org/usage/usage-with-typescript#generated-action-types-for-slices
// const slice = createSlice({
//   name: 'test',
//   initialState: 0,
//   reducers: {
//     increment: (state, action: PayloadAction<number>) => state + action.payload,
//   },
// })

// function myCustomMiddleware(action: Action) {
//!   if (slice.actions.increment.match(action)) {
//     `action` is narrowed down to the type `PayloadAction<number>` here.
//   }
// }


