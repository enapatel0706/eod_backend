import React, { useEffect, useState } from 'react';
import "../../css/sidebar.css";
import LOGO from "../../Image/Logo.png";
// import Menu from "../../assets/Image/menu-24.svg";
import Profile from "../../Image/75.jpg";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {


  const [activeTab, setActiveTab] = useState("eod");

  const RenderSideBar = () => {
    return (
      <>
        <div id="sidebar_area">
          <div className="left side-menu">

            <div className="left-side-logo d-block d-md-none">
              <div className="text-center">
                <div className="res-img">
                  <NavLink className="logo" to="/admin/main">
                    <img src={LOGO} alt="logo" style={{ width: "100%" }} />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="sidebar-inner slimscrollleft">
              <div id="sidebar-menu">
                <div className="profile">
                  <div className="profile_img">
                    <img src={Profile} alt="Profile Image" />
                  </div>
                  <div className="profile_position">
                    <h5 style={{ "textTransform": "capitalize" }}>{`${getuserDetails().empFname} ${getuserDetails().empLname}`}</h5>
                    <p style={{ "textTransform": "capitalize" }}>{getuserDetails().post}</p>
                  </div>
                </div>
                <ul className='left-button'>
                  <li onClick={() => { setActiveTab("eod") }} className={(activeTab == "eod") ? "active nav-link" : "nav-link"}>
                    <NavLink to="/eod" exact={true} activeClassName="active"
                      onlyActiveOnIndex>
                      EOD
                    </NavLink>
                  </li>

                  <li onClick={() => { setActiveTab("history") }} className={(activeTab == "history") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active"
                      to="/history" onlyActiveOnIndex>
                      EOD History
                    </NavLink>
                  </li>

                  <li onClick={() => { setActiveTab("configuration") }} className={(activeTab == "configuration") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active" to="/configuration" onlyActiveOnIndex>
                      Configuration
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="clearfix"></div>
            </div>

          </div>
        </div>
      </>
    )
  }

  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };
  return (
    <>
      <RenderSideBar />
    </>
  )
}

export default Sidebar;