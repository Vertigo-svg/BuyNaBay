import React from "react";
import ReactDOM from "react-dom";
import AdminApp from "./admin/app";
import MobileApp from "./app/_layout";

const isAdmin = process.env.REACT_APP_ADMIN === "true";

ReactDOM.render(
  <React.StrictMode>{isAdmin ? <AdminApp /> : <MobileApp />}</React.StrictMode>,
  document.getElementById("root")
);