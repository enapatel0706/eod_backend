import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./../../css/style.scss";
import Logo from "./../../Image/Logo.png";
import axios from "axios";
import Swal from 'sweetalert2';
import { useContext } from "react";
import { ContextApi } from "./Context";
import { MenuContext } from "../../App";

const Login = () => {

  //------------ Loader Code Start------------
  const [loader, setLoader] = useState(false);

  //------------ Loader Code End ------------

  const { state, dispatch } = useContext(MenuContext);

  let [role, setRole] = useState("employee");


  const navigate = useNavigate();
  const haslogin = useContext(ContextApi);
  const initialFormData = Object.freeze({
    Email: "",
    Password: "",
    Role: "",
    login: true,
  });

  const [formData, updateFormData] = useState(initialFormData);
  const [invalidLoginMsg, setInvalidLoginMsg] = useState(false);


  // const [user, SetUser] = useState(false);

  const handleChange = (e) => {
    setInvalidLoginMsg(false);
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  function ValidateEmail() {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (formData.Email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    let res;
    try {

      if (ValidateEmail()) {
        const obj = {
          Email: formData.Email,
          Password: formData.Password,
          Role: role,
        };


        setLoader(true)
        e.preventDefault();

        res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/login`, obj);
        if (res.status == 200) {
          localStorage.setItem("userData", JSON.stringify(res.data));
          dispatch({ type: "LOGIN", payload: true });
          setLoader(false)
          if (role == 'employee') {
            if (res?.data?.pass_expire == "no") {
              navigate("/eod");
            }
            else {
              const resdata = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/setuser/token`, obj)
              if (resdata.status == 200) {
                const user_id = resdata.data.user_id;
                const token = resdata.data.token
                navigate(`/resetpassword?user_id=${user_id}&token=${token}`)
              }
            }
          }
          else if (role == 'admin') {
            if (res?.data?.pass_expire == "no") {
              navigate("/admin/main");
            }
            else {
              const resdata = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/setuser/token`, obj);
              if (resdata.status == 200) {
                const user_id = resdata.data.user_id;
                const token = resdata.data.token
                navigate(`/resetpassword?user_id=${user_id}&token=${token}`)
              }
            }
          }
        }
        else {
          setLoader(false)
          setInvalidLoginMsg(true);
        }
      } else {
        setLoader(false)
        Swal.fire({
          type: "warning",
          icon: "warning",
          title: "Invalid Email Address",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }

    } catch (err) {
      setLoader(false)
      setInvalidLoginMsg(true);
      console.log(err);
      throw err;
    }

  };
  //-----------------password visibility----------------
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleAdminPassword = () => setShowAdminPassword(!showAdminPassword);
  return (
    <>
      {loader ? <div className="loadingPopup"></div> : null}
      {/* {/ <contextApi.Provider value={haslogin}></contextApi.Provider> /} */}
      <div className="main d-flex justify-content-center justify-content-sm-end align-items-center">
        <div className="box text-center ms-3 me-3 me-sm-5 p-4">
          <div
            className="d-flex justify-content-center"
            style={{ position: "relative" }}
          >
            <nav
              className="btn-top d-flex justify-content-between"
              id="btn-top"
            >
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link btn-1 active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                  onClick={() => { setRole("employee") }}
                >
                  Employee
                </button>
                <button
                  className="nav-link btn-1"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                  onClick={() => { setRole("admin") }}
                >
                  Admin
                </button>
              </div>
            </nav>
          </div>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <div className="image mt-4 mb-3">
                <img src={Logo} alt="" srcSet="" />
              </div>
              <div className="heading">
                <h4>Login as Employee</h4>
              </div>
              <form className="mt-4">
                <div className="row px-0 mx-0 d-flex justify-content-center">

                  <div className="col-10 px-0">
                    <div className="floating-label-group">
                      <input type="email" id="username" name="Email" className="form-control" autoComplete="off" required onChange={handleChange} />
                      <label className="floating-label">Email address</label>
                    </div>
                  </div>


                  <div className="col-10 px-0">
                    <div className="floating-label-group">
                      <input
                        type={showPassword ? "text" : "password"} // toggle password visibility
                        id="password"
                        name="Password"
                        className="form-control"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                      />
                      <div className="toggle-password" onClick={handleTogglePassword}>
                        {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                      </div>

                      <label className="floating-label">Password</label>
                    </div>
                  </div>
                </div>


                <NavLink to="/">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-3 px-5 py-1 fw-500 login"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>

                </NavLink>

                <a href={`${process.env.REACT_APP_ZOHO_SIGN_IN_REDIRECT_URL}?response_type=${process.env.REACT_APP_ZOHO_RESPONSE_TYPE}&client_id=${process.env.REACT_APP_ZOHO_CLIENT_ID}&scope=${process.env.REACT_APP_ZOHO_SCOPE}&redirect_uri=${process.env.REACT_APP_ZOHO_REDIRECT_URL}`}>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mb-3 px-5 py-1 fw-500 login"
                  // onClick={handleSubmit}
                  >
                    Sign in with Zoho
                  </button>
                </a>

                {(invalidLoginMsg && role == "employee" ? <div className="container text-center text-danger">
                  <p>Invalid Credentials</p>
                </div> : null)}

              </form>
              <div className="mt-2">
                <NavLink to="/forgotpassword" className="text-center d-flex justify-content-center" style={{ textDecoration: "none", fontWeight: '500', color: '#767171' }}>Forgot Password ?</NavLink>
              </div>

            </div>
            <div
              className="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              <div className="image mt-4 mb-3">
                <img src={Logo} alt="" srcSet="" />
              </div>
              <div className="heading">
                <h4>Login as Admin</h4>
              </div>
              <form className="mt-4">
                <div className="row px-0 mx-0 d-flex justify-content-center">

                  <div className="col-10 px-0">
                    <div className="floating-label-group">
                      <input type="email" id="username" className="form-control" name="Email" autoComplete="off" required onChange={handleChange} />
                      <label className="floating-label">Email address</label>
                    </div>
                  </div>


                  <div className="col-10 px-0">
                    <div className="floating-label-group">
                      <input
                        type={showAdminPassword ? "text" : "password"} // toggle password visibility
                        // type="password"
                        id="password"
                        name="Password"
                        className="form-control"
                        autoComplete="off"
                        required
                        onChange={handleChange}
                      />
                      <div className="toggle-password" onClick={handleToggleAdminPassword}>
                        {showAdminPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                      </div>
                      <label className="floating-label">Password</label>
                    </div>
                  </div>
                </div>

                <NavLink to="/admin/main">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-3 px-5 py-1 fw-500 login"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                </NavLink>

                <a href={`${process.env.REACT_APP_ZOHO_SIGN_IN_REDIRECT_URL}`}>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mb-3 px-5 py-1 fw-500 login"
                  // onClick={handleSubmit}
                  >
                    Sign in with Zoho
                  </button>
                </a>


                <div className="container text-center text-danger">
                  {(invalidLoginMsg && role == "admin" ? <div className="container text-center text-danger">
                    <p>Invalid Credentials</p>
                  </div> : null)}

                </div>
              </form>
              <div className="mt-2">
                <NavLink to="/forgotpassword" className="text-center d-flex justify-content-center" style={{ textDecoration: "none", fontWeight: '500', color: '#767171' }}>Forgot Password ?</NavLink>
              </div>
              {/* <!-- <div className="mt-2">
              <p>Don't have account? <a href="#">Register</a></p>
            </div> --> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
