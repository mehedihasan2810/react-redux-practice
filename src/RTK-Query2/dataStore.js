import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { dataApi } from "./dataSlice";


export const dataStore = configureStore({
    reducer: {
     [dataApi.reducerPath]: dataApi.reducer,
    },

    // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dataApi.middleware)
})


// refetchOnMount/Reconnect/Focus
setupListeners(dataStore.dispatch);