import React, { useEffect } from "react";
// import "./../../css/eod.scss";

import _image_75 from "./../../Image/75.jpg";
import Eod_main from "./Eod_main";

// import Header from "./Header";
import Eod_history from "./Eod_history";
import Configuration from "./Configuration";
// import Sidebar from "./Sidebar";
import { Navigate } from "react-router-dom";

const Eod = () => {
  // if (!authorized) {
  //   return <Navigate to="/login" />;
  // }
  return (
    <>
      {/* <Header /> */}
      <div className="container-fluid">
        <div className="row flex-nowrap bg-dark pt-3">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 py-3">
            {/* <Sidebar /> */}
          </div>
          {/* <Eod_main />; */}
          <div className="col py-3 bg-white px-5">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="v-pills-eod"
                role="tabpanel"
                aria-labelledby="v-pills-eod-tab"
                tabIndex="0"
              >
                <Eod_main />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-history"
                role="tabpanel"
                aria-labelledby="v-pills-history-tab"
                tabIndex="0"
              >
                <Eod_history />
              </div>
              <div
                className="tab-pane fade"
                id="v-pills-config"
                role="tabpanel"
                aria-labelledby="v-pills-config-tab"
                tabIndex="0"
              >
                <Configuration />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Eod;
