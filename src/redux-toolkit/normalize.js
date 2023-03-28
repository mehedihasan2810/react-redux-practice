import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

//* fetch all users
// export const fetchNormalizeUsers = createAsyncThunk('users/fetchAll', async () => {
//     const response = await fetch(`http://localhost:3000/users`);
//     const data = await response.json();
//     return data;
// });


//* add users( createAsyncThunk mutation )
// export const addNormalizeUsers = createAsyncThunk('users/addUsers', async (formObj, thunkApi) => {
//     const response = await fetch(`http://localhost:3000/users`, {
//       method: 'POST',
//       body: JSON.stringify(formObj),
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//     });
//     const data = await response.json();
//     return data;
// });

//* sort data
// const notificationsAdapter = createEntityAdapter({
//     sortComparer: (a, b) => b.date.localeCompare(a.date)
//   })

//* setup if our id name is not id but idx or userId
// export const usersAdapter = createEntityAdapter({
//     selectId: (user) => user.idx,
//   })

//* create an entity adapter
export const usersAdapter = createEntityAdapter();

//* get the initial state from the createEntityAdapter
const initialState = usersAdapter.getInitialState({
    status: 'idle',
});

// create slice
const normalizeData = createSlice({
    name: 'normalize',
    initialState,
    reducers: {
    upsertManyUsers: usersAdapter.upsertMany,

    //* in function body both state and payload have to be passed to upsertMany
    // upsertManyUsers: (state, action) => {
    //     usersAdapter.upsertMany(state, action.payload)
    // },
   
    //* https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions 
    upsertOneUser: usersAdapter.upsertOne,
    addOneUser: usersAdapter.addOne,
    setOneUser: usersAdapter.setOne,
    updateOneUser: usersAdapter.updateOne,
    // it removes entity from adapter but not from database
     removeUser: usersAdapter.removeOne,
    },
    extraReducers: (builder) => {

    // builder.addCase(fetchNormalizeUsers.fulfilled, usersAdapter.upsertMany)
    // builder.addCase(addNormalizeUsers, usersAdapter.addOne)



        //* without createEntityAdapter thats how you add fetch data
        // builder.addCase(fetchNormalizeUsers.fulfilled, (state, action) => {
        //     state.countries = action.payload;
        // })
        // builder.addCase(addNormalizeUsers.fulfilled, (state, action) => {
        //     state.countries = action.payload;
        //     console.log('added')
        // })
    }
});

export const { 
    selectAll: selectAllUsers, 
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities: selectUserEntities,
    selectTotal: selectTotalUsers,
 } = usersAdapter.getSelectors((state) => state.normalize);



export const { 
    upsertManyUsers, 
    upsertOneUser, 
    addOneUser,
    setOneUser, 
    removeUser,
    updateOneUser
 } = normalizeData.actions;

export default normalizeData.reducer;



