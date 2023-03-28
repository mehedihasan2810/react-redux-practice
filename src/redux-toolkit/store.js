import { configureStore } from "@reduxjs/toolkit";
import actionSlice from "./actionSlice";
import counterReducer from './counterSlice';
// import normalizeReducer, { fetchNormalizeUsers } from "./normalize";
import normalizeReducer from './normalize';


//* have to use combineReducers for nested reducer
export const store = configureStore({
    reducer: {
       counter: counterReducer,
       // dispatch one action in more than one slice
        actionSlice: actionSlice,
       // normalize reducer
        normalize: normalizeReducer,
    },
})

// store.dispatch(fetchNormalizeUsers())



