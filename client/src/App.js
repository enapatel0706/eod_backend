import React from "react";
import Login from "./Component/Auth/Login";
import Eod from "./Component/Employee/Eod";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { Navigate, useNavigate } from 'react-router-dom';
import Main from "./Component/Admin/Main";
import PrivateRoutes from "./Component/Auth/PrivateRoutes";
import { ContextProvider } from "./Component/Auth/Context";
import { useReducer, createContext, useEffect } from 'react';
import { initialState, reducer } from "./reducer/reducer";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import ResetPassword from "./Component/Auth/ResetPassword";
import Error from "./Component/Auth/Error";
import Attendance from "./Component/Admin/Attendance";
import History from "./Component/Admin/History";
import Compliance from "./Component/Admin/Compliance";
import Employee_list from "./Component/Admin/Employee_list";
import Logout from "./Component/Auth/Logout";
import Sidebar from "./Component/Employee/Sidebar";
import AdminSidebar from "./Component/Admin/AdminSidebar";
import Header from "./Component/Employee/Header";
import AdminHeader from "./Component/Admin/AdminHeader";
import Eod_main from "./Component/Employee/Eod_main";
import Configuration from "./Component/Employee/Configuration";
import Eod_history from "./Component/Employee/Eod_history";
export const MenuContext = createContext();

function App() {

  const location = useLocation();
  const navigate = useNavigate();

  const checkLocalStorage = () => {

    if (localStorage.getItem("userData")) {
      let userData = JSON.parse(localStorage.getItem("userData"));
      dispatch({ type: "LOGIN", payload: true });

      if (userData.roleName == "employee" || userData.roleName == "intern") {
        if (location.pathname != '/eod') {
          navigate("/eod");
        }
      }
      if (userData.roleName == "admin") {
        if (location.pathname != '/admin/main') {
          navigate("/admin/main");
        }
      }
    } else {
      dispatch({ type: "LOGIN", payload: false });

      // window.location != 'http://localhost:3000/' && window.location != 'http://localhost:3000/forgotpassword
      if (location.pathname == "/") {
        navigate('/');
      }
      else if (location.pathname == "/forgotpassword") {
        navigate('/forgotpassword');
      }
      else if (location.pathname.includes("resetpassword")) {

        const queryParams = new URLSearchParams(window.location.search);
        const user_id = queryParams.get("user_id");
        const token = queryParams.get("token");
        navigate(`/resetpassword?user_id=${user_id}&token=${token}`);

      } else {
        navigate('/*');
      }


      // if (window.location != 'http://localhost:3000/' && window.location != 'http://localhost:3000/forgotpassword') {
      //   if (window.location != 'http://localhost:3000/resetpassword/:user_id/:token') {
      //     // .includes("resetpassword");
      //     let params = window.location.toString().split('/');
      //    
      //     localStorage.setItem("forgotPassToken", params[5]);
      //     localStorage.setItem("forgotPassUid", params[4]);

      //     window.location.replace("/resetpassword/:user_id/:token");
      //   }
      // }

      // else if (window.location != 'http://localhost:3000/forgotpassword' && window.location != 'http://localhost:3000/resetpassword/:user_id/:token') {

      //   // if (window.location != 'http://localhost:3000/') {
      //     window.location.replace("/");
      //   // }
      // }


      // else if (window.location != 'http://localhost:3000/' && window.location != 'http://localhost:3000/resetpassword/:user_id/:token') {

      //   if (window.location != 'http://localhost:3000/forgotpassword') {
      //     window.location.replace("/forgotpassword");
      //   }
      // }

    }
  }


  useEffect(() => {
    checkLocalStorage();
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);
  let userData = JSON.parse(localStorage.getItem("userData"));
  return (
    <>
      {/* Header */}

      {(localStorage.getItem("userData")) ? <>{(userData.roleName == "employee" || userData.roleName == "intern") ? <Header /> : null}</> : null}

      {(localStorage.getItem("userData")) ? <>{(userData.roleName == "admin") ? <AdminHeader /> : null}</> : null}



      {/* Sidebar */}

      {(localStorage.getItem("userData")) ? <>{(userData.roleName == "employee" || userData.roleName == "intern") ? <Sidebar /> : null}</> : null}

      {(localStorage.getItem("userData")) ? <>{(userData.roleName == "admin") ? <AdminSidebar /> : null}</> : null}


      <MenuContext.Provider value={{ state, dispatch }}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
          <Route exact path="/resetpassword" element={<ResetPassword />} />
          <Route exact path="/logout" element={<Logout />} />

          {/*Employee Routes  */}
          <Route exact path="/eod" element={<Eod_main />} />
          <Route exact path="/history" element={<Eod_history />} />
          <Route exact path="/configuration" element={<Configuration />} />

          {/* Admin Routes */}
          <Route exact={true} path="/admin/main" element={<Employee_list />} />
          <Route path="/admin/attendance" element={<Attendance />} exact />
          <Route path="/admin/history" element={<History />} exact />
          <Route path="/admin/compliance" element={<Compliance />} exact />

          {/* Error Page Routes */}
          <Route
            path="/*"
            element={<Error />}
          />
        </Routes>
      </MenuContext.Provider>
    </>
  );
}

export default App;
