import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ContextApi } from "./Context";

const PrivateRoutes = () => {
  const { user, setUser } = useContext(ContextApi);
  
  var haslogin = false;
  if (user === true) {
    haslogin = true;
  }
  // const haslogin = hasuser.user;

  let auth = { token: haslogin };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
