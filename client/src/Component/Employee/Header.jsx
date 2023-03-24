import React from "react";
import { useState } from "react";
import logo from "./../../Image/Logo.png";
import _image_75 from "./../../Image/75.jpg";
import { NavLink } from "react-router-dom";
// import "./../../css/eod.scss";
import "./../../css/header.css";
import Menu from "../../Image/menu.svg";

const Header = () => {
  const [isActive, setActive] = useState("false");

  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };

  // const handleToggle = () => {
  //   setActive(!isActive);
  // };
  return (
    <>

      <div className="topbar">
        <div className="topbar-left d-none d-md-block">
          <div
            className="text-center d-flex justify-content-center align-items-center"
            style={{ lineHeight: "70px" }}
          >
            <a href="index.html" className="logo">
              <img src={logo} alt="" style={{ width: "100%" }} />
            </a>
          </div>
        </div>

        <nav className="navbar-custom d-flex">
          <ul className="list-inline menu-left mb-0 d-block d-md-none">
            <li className="list-inline-item">
              <button
                id="toggle_sidebar"
                type="button"
                className="button-menu-mobile open-left"
              >
                <img src={Menu} />
              </button>
            </li>
          </ul>
          <ul className="list-inline ms-auto mb-0" style={{ display: "flex", alignItems: "center" }}>
            <li className="list-inline-item dropdown notification-list">
              <div className="nav-link input-group d-flex">
                <button className="btn btn-secondary">
                  <i className="fas fa-search"></i>
                </button>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </li>
            <li className="list-inline-item dropdown notification-list nav-user">
              <div className="dropdown selectdiv" id='navbar'>
                <a className="nav-link dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "40px",
                      marginTop: "10px"
                    }}
                  >
                    <img src={_image_75} alt="" srcSet="" className="me-2 rounded-circle" />
                  </div>
                  <span className="d-inline-block ml-1" style={{ "textTransform": "capitalize" }}>{`${getuserDetails().empFname} ${getuserDetails().empLname}`}</span>
                  {/* <i
                  onClick={handleToggle}
                  className={
                    isActive ? "fas fa-angle-down ms-2" : "fas fa-angle-up ms-2"
                  }
                  ></i> */}
                </a>

                <ul className="dropdown-menu dropdown-menu-right dropdown-menu-animated profile-dropdown" aria-labelledby="dropdownMenuLink">
                  {/* <li><a className="dropdown-item" href="#"><i class="fas fa-right-from-bracket"></i> Log Out</a></li> */}
                  <li>
                    <NavLink className="dropdown-item" to="/logout">
                      <i class="fas fa-right-from-bracket"></i> Logout
                    </NavLink>
                  </li>
                  {/* <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>


      {/* <nav className="navbar navbar-expand-md bg-light">
        <div className="container-fluid">
          <a href="#" className="navbar-brand">
            <img src={logo} alt="" srcSet="" />
          </a>
          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-md-end"
            id="navbarCollapse"
          >
            <form className="d-flex" style={{ width: "40%" }}>
              <div className="input-group">
                <button className="btn btn-secondary">
                  <i className="fas fa-search"></i>
                </button>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </form> */}

      {/* <!-- Dropdown button --> */}

      {/* <div className="dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={_image_75} alt="" srcSet="" className="me-2" />
                <span style={{ "textTransform": "capitalize" }}>{`${getuserDetails().empFname} ${getuserDetails().empLname}`}</span>                <i
                  onClick={handleToggle}
                  className={
                    isActive ? "fas fa-angle-down ms-2" : "fas fa-angle-up ms-2"
                  }
                ></i>
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <NavLink className="dropdown-item" to="/logout">
                    Logout
                  </NavLink>
                </li> */}
      {/* <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li> */}
      {/* </ul>
            </div>
          </div>
        </div>
      </nav> */}
    </>
  );
};

export default Header;
