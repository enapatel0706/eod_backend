import React from "react";
// import "./../../css/eod.css";

import _image_75 from "./../../Image/75.jpg";
import Employee_list from "./Employee_list";
import Attendance from "./Attendance";
import History from "./History";
import Compliance from "./Compliance";

// import Header from "./AdminHeader";
import Sidebar from "./AdminSidebar";
import Edit_emp_details from "./Edit_emp_details";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";


const Eod = () => {
  return (
    <>
      {/* <Header />
      <div className="container-fluid">
        <div className="row flex-nowrap bg-dark pt-3">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 py-3">
            <Sidebar />
          </div> */}





      {/* 
          <div className="col py-3 bg-white px-5">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="v-pills-emp-list"
                role="tabpanel"
                aria-labelledby="v-pills-emp-list-tab"
                tabIndex="0"
              >
                <Employee_list />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-attendance"
                role="tabpanel"
                aria-labelledby="v-pills-attendance-tab"
                tabIndex="0"
              >
                <Attendance />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-history"
                role="tabpanel"
                aria-labelledby="v-pills-history-tab"
                tabIndex="0"
              >
                <History />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-compliance"
                role="tabpanel"
                aria-labelledby="v-pills-compliance-tab"
                tabIndex="0"
              >
                <Compliance />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-edit"
                role="tabpanel"
                aria-labelledby="v-pills-edit-tab"
                tabIndex="0"
              >
                <Edit_emp_details />
              </div>
            </div>
          </div> */}
      {/* </div>
      </div> */}
    </>
  );
};

export default Eod;
