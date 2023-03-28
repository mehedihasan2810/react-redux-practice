import React from 'react'
import { useGetDatasQuery, useGetDataQuery, useAddDataMutation, useUpdateDataMutation } from './dataSlice';
import { nanoid } from '@reduxjs/toolkit';
const App = () => {

//* useQuery hooks also provides this isLoading isError status
//* this hook useGetPokemonByNameQuery accepts a optional second parameter like {pollingInterval: 1000} which refetches data after every 1 seconds
const {data, error, isLoading, isFetching } = useGetDatasQuery('users'
// ,
//  {
//*  https://redux-toolkit.js.org/rtk-query/usage/conditional-fetching
//   skip: false, //default false see docs for usecase
//   pollingInterval: 1000,
//   Allows altering the returned value of the hook to obtain a subset of the result, render-optimized for the returned subset.
//*   https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result
//   selectFromResult: see docs for usecases

//* https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#encouraging-re-fetching-with-refetchonmountorargchange
//   refetchOnMountOrArgChange: //see docs
//* https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-window-focus-with-refetchonfocus
//   refetchOnFocus: //see docs
//   refetchOnReconnect: //see docs
// }
);
// console.log(data)

//* get single user
const {data: user, refetch} = useGetDataQuery('EU_revi9s8-ZXjgdBlT4J');

//* https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#re-fetching-on-demand-with-refetchinitiate
// refetch

//* add a single data(POST)
const [addUser, {isError}] = useAddDataMutation();

const [updateUser, {isSuccess}] = useUpdateDataMutation({
  //* https://redux-toolkit.js.org/rtk-query/usage/mutations#shared-mutation-results
  fixedCacheKey: 'shared-update-post',
})

  return (
    <div>
        <h1>Users</h1>
        <ul>
        {
          isLoading ? (
            <h1>loading...</h1>
          ) : (
          data?.map((user) => (
            <li key={user.id}>{user.firstName}</li>
          ))
          )
        }
        </ul>

        <h1>Mutation</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
            console.log(Object.fromEntries(formData))
            const formDataObj = Object.fromEntries(formData);
            if(formDataObj.firstName){

              addUser({id:nanoid(), ...formDataObj})
            }
        }} style={{
          border: '1px solid blue',
          padding: '20px',
         }}>
          <label htmlFor="firstName">
            firstName
            <input type="text" id='firstName' name='firstName' />
          </label>
          <br />
          <br />
          <label htmlFor="lastName">
            lastName
            <input type="text" id='lastName' name='lastName' />
          </label>
          <br />
          <br />
          <button>submit</button>
        </form>
        <br />
        <br />

        <p>{user?.firstName}</p>

        {/* update users */}
        <button onClick={() => {
          updateUser({id: 'EU_revi9s8-ZXjgdBlT4J', firstName: 'gggg'})
        }}>UpdateUser</button>
    </div>
  )
}

export default App;