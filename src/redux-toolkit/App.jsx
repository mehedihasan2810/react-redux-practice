import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncIncrementThunks, decrement, fetchUsersById, increment, incrementByAmount, reset } from './counterSlice';
// import { addNormalizeUsers, fetchNormalizeUsers, removeUser } from './normalize';
import { postsAction } from './reuseAction';
import { nanoid } from '@reduxjs/toolkit';
import { addOneUser, removeUser, selectAllUsers, selectTotalUsers, selectUserById, selectUserEntities, selectUserIds, setOneUser, updateOneUser, upsertManyUsers, upsertOneUser } from './normalize';



const upsertManyUsersArr = [
  {
    id: 1,
    firstName: 'mehedi',
    lastName: 'hasan',
  },
  {
    id: 2,
    firstName: 'john',
    lastName: 'doe',
  },
  {
    id: 3,
    firstName: 'leo',
    lastName: 'messi',
  },
  {
    id: 4,
    firstName: 'hugo',
    lastName: 'loris',
  },
  {
    id: 5,
    firstName: 'karim',
    lastName: 'khan',
  },
]





const App = () => {
    const dispatch = useDispatch();

    // get value and count
    const [value, count] = useSelector(state => [state.counter.value, state.actionSlice.count]);

    // get posts
    const post = useSelector(state => state.counter.posts);
    const isLoading = useSelector(state => state.counter.status);


    // dispatch(fetchNormalizeUsers())


    // selectAllUsers from createEntityAdapter
    const users = useSelector(selectAllUsers)
    console.log(users)
    // alternative
    // const users = useSelector((state) => selectAllUsers(state))

    //  select user by id from createEntityAdapter
    const userById = useSelector((state) => selectUserById(state, 1))
    console.log(userById)

    // select users all ids
    const userIds = useSelector(selectUserIds)
    console.log(userIds)

    // select users total users or length
    const totalUsers = useSelector(selectTotalUsers)
    console.log(totalUsers)

    // select users entity object
    const userEntity = useSelector(selectUserEntities)
    console.log(userEntity)

  return (
    <div>
        <h1>My Counter App</h1>
        <p>value: {value}</p>
        <p>count: {count}</p>
        <button onClick={() => dispatch(increment())}>increment</button>
        <button onClick={() => dispatch(incrementByAmount(2))}>incrementByAmount</button>
        <button onClick={() => dispatch(decrement())}>decrement</button>
        <button onClick={() => dispatch(reset())}>reset</button>

        {/* increment asynchronously with a thunk */}
        <button onClick={() => dispatch(asyncIncrementThunks(3))}>asyncIncrementThunks</button>

        {/* increment in both slice with a common action */}
        <button onClick={() => dispatch(postsAction())}>incrementBothSlice</button>
        <br />
        <br />

        {/* fetch data by createAsyncThunks */}
        <h1>createAsyncThunk</h1>
        <button onClick={() => dispatch(fetchUsersById(1))}>dispatch createAsyncThunks and fetch data</button>
        <p>{post.length ? post[0].title : null}</p>
        <br />
        <br />

        {/* show normalize data */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const formObj = Object.fromEntries(formData.entries())
          if(formObj.firstName) {
            dispatch(addNormalizeUsers({ id:nanoid(), ...formObj }))
            // dispatch(fetchNormalizeUsers())
          }
        }} style={{
          border: '1px solid blue',
          padding: '40px',
        }}>
          <label htmlFor="firstName">
            First Name: 
            <input type="text" name='firstName' id='firstName'/>
          </label>
          <br />
          <br />
          <label htmlFor="lastName">
            last Name: 
            <input type="text" name='lastName' id='lastName'/>
          </label>
           <br />
           <br />
          <button>submit</button>
        </form>
        <br />
        <button onClick={() => dispatch(upsertManyUsers(upsertManyUsersArr))}>upsertManyUsers</button>
        <button onClick={() => dispatch(upsertOneUser({
          id: 5,
          firstName:'foo',
          lastNamee: 'bar',

        }))}>upsertOneUser</button>
        <button onClick={() => dispatch(addOneUser({
          id: 5,
          firstName:'rahim',
          lastName: 'rubban',
        }))}>addOneUser</button>
        <button onClick={() => dispatch(setOneUser({
          id: 5,
          firstName: 'boom',
          lastName: 'foom',
        }))}>setOneUser</button>
        <button onClick={() => dispatch(updateOneUser({
          id: 1,
          changes: {
            firstName: 'jhonny',
            lastNamee: 'ponny',
          }
        }))}>updateOneUser</button>
        <button onClick={() => dispatch(removeUser(1))}>removeAnUser</button>
        <br />
      <ul>
      {/* {
        normalizeData.ids.length && normalizeData.ids.map((id) => (
          <li key={id}>{normalizeData.entities[id].firstName}</li>
        ))
      } */}
       </ul>


        {/* <button onClick={() => dispatch(fetchNormalizeUsers())}>dispatch normalize datafetch</button> */}
    </div>
  )
}

export default App