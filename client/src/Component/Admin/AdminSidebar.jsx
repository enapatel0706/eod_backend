import React, { useEffect, useState } from 'react';
import "../../css/sidebar.css";
import LOGO from "../../Image/Logo.png";
// import Menu from "../../assets/Image/menu-24.svg";
import Profile from "../../Image/75.jpg";
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {


  const [activeTab, setActiveTab] = useState("list");
  const [active, setActive] = useState("active");


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
                  <li onClick={() => { setActiveTab("list") }} className={(activeTab == "list") ? "active nav-link" : "nav-link"}>
                    <NavLink to="/admin/main" exact={true} activeClassName="active"
                      onlyActiveOnIndex>
                      Employees's List
                    </NavLink>
                  </li>

                  <li onClick={() => { setActiveTab("attendance") }} className={(activeTab == "attendance") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active"
                      to="/admin/attendance" onlyActiveOnIndex>
                      Attendance Report
                    </NavLink>
                  </li>

                  <li onClick={() => { setActiveTab("history") }} className={(activeTab == "history") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active" to="/admin/history" onlyActiveOnIndex>
                      EOD History
                    </NavLink>
                  </li>

                  <li onClick={() => { setActiveTab("compliance") }} className={(activeTab == "compliance") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active" to="/admin/compliance" onlyActiveOnIndex>
                      EOD Compliance
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



  // useEffect(() => {
  //   alert(activeTab);
  // }, [activeTab])


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

export default AdminSidebar;