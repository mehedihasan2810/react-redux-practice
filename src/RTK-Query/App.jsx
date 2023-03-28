import React, { memo, useEffect } from "react";
import {
  increment,
  decrement,
  reset,
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostsMutation,
  useEditPostMutation,
} from "./state";
import { useSelector, useDispatch } from "react-redux";



const App = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  

  const {
    data: posts,
     isLoading: loading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery();

  // console.log(isFetching)

  const [addNewPost, { isLoading }] = useAddNewPostsMutation();

  // console.log(isLoading)

  const handleSavePost = async () => {
    try {
      await addNewPost(
        {
          useId: 1,
          id: 101,
          title: "hello im 101",
          body: "foo im body",
        }
      ).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p>{count}</p>
      <p style={{ color: isFetching ? "blue" : "" }}>
        {posts && posts[98].title}
      </p>
      <p>{posts && posts[100]?.title}</p>
      <button onClick={handleSavePost}>save post</button>
      {/* <button onClick={refetch}>refetch posts</button> */}
      <br />
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(reset())}>reset</button>
      <GetPost/>
      <EditPost/>
    </div>
  );
};



const GetPost = () => {

  const {
    data: post,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    // refetch,
  } = useGetPostQuery(1);


  return (
    <div>
      <h1>hi im get post</h1>
       <p>{post?.title}</p>
    </div>
  )
}



const EditPost = () => {

  const [editPost, {isLoading}] = useEditPostMutation();


async function handleEditPost() {
  try{
   await editPost({id: 1, title: 'foobarrr'}).unwrap()
  }catch(error){
    console.log(error)
  }
}

  return (
    <div>
  <h1>hello im edit</h1>
  <button onClick={handleEditPost}>edit</button>
  </div>
  )
};

export default App;


