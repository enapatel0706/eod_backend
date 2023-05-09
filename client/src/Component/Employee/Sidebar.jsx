import React, { useEffect, useState } from 'react';
import "../../css/sidebar.css";
import LOGO from "../../Image/Logo.png";
// import Menu from "../../assets/Image/menu-24.svg";
import Profile from "../../Image/75.jpg";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

  const [activeTab, setActiveTab] = useState("eod");
  const [role, setRole] = useState("");

  useEffect(() => {

    setRole(JSON.parse(localStorage.getItem("userData")).roleName);
  })


  const RenderSideBar = () => {
    return (
      <>
        <div id="sidebar_area">
          <div className="left side-menu">

            {/* <div className="left-side-logo d-block d-md-none">
              <div className="text-center">
                <div className="res-img">
                  <NavLink className="logo" to="/admin/main">
                    <img src={LOGO} alt="logo" style={{ width: "100%" }} />
                  </NavLink>
                </div>
              </div>
            </div> */}

            <div className="sidebar-inner slimscrollleft">
              <div id="sidebar-menu">
                <div className="profile">
                  <div className="profile_img">
                    {/* <img src={Profile} alt="Profile Image" /> */}
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

                  {(role == "employee" || role == "intern" ? <li onClick={() => { setActiveTab("helpdesk") }} className={(activeTab == "helpdesk") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active" to="/helpdesk" onlyActiveOnIndex>
                      Help Desk
                    </NavLink>
                  </li> : null)}

                  {(role == "hr"  ? <li onClick={() => { setActiveTab("tickets") }} className={(activeTab == "tickets") ? "active nav-link" : "nav-link"}>
                    <NavLink exact activeClassName="active" to="/tickets" onlyActiveOnIndex>
                      Tickets
                    </NavLink>
                  </li> : null)}

                </ul>
              </div>
              <div className="clearfix"></div>
            </div>

          </div>
          <script
        src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
        crossOrigin="anonymous"
      ></script>

      <script
        src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossOrigin="anonymous"
      ></script>

      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
        integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
        crossOrigin="anonymous"
      ></script>
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