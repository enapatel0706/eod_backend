import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ContextApi } from "./Context";

const PrivateRoutes = () => {
  const { user, setUser } = useContext(ContextApi);

  console.log("**************User******************");
  console.log(user);
  var haslogin = false;
  if (user === true) {
    haslogin = true;
  }
  console.log("************  " + haslogin);
  // const haslogin = hasuser.user;

  let auth = { token: haslogin };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
