import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

// RTK-Query
// import { Provider } from "react-redux";
// import { store } from "./src/RTK-Query/state";
// import App from "./src/RTK-Query/App";

// redux-toolkit
// import { Provider } from "react-redux";
// import { store } from "./src/redux-toolkit/store";
// import App from "./src/redux-toolkit/App";

// RTK-Query2
import App from "./src/RTK-Query2/App";
import { dataStore } from "./src/RTK-Query2/dataStore";
import { Provider } from "react-redux"; 


// RTK-Query2
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={dataStore}>
    <App />
    </Provider>
  </React.StrictMode>
);

// redux-toolkit
// ReactDOM.createRoot(document.getElementById("root")).render(
//   // <React.StrictMode>
//     <Provider store={store}>
//     <App />
//     </Provider>
//   // </React.StrictMode>
// );

// // for rtk-query
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//   <Provider store={store}>
//     <App />
//   </Provider>
//   </React.StrictMode>
// );
