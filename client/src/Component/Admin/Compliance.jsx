import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import edit_emp from "./../../Image/EditIcon.svg";
import moment from "moment";
import Swal from "sweetalert2";
import './../../css/history.scss'
import DataTable from "react-data-table-component";
// import Header from "./AdminHeader";
// import Sidebar from "./AdminSidebar";

const Compliance = () => {
  //------------ Loader Code Start------------
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
    setLoader(false);
  }, []);

  //------------ Loader Code End ------------

  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };

  const [compliance, setCompliance] = useState([]);
  const [eodDate, setEodDate] = useState(todayDate());
  const [eodStartDate, setEodStartDate] = useState("");
  const [eodEndDate, setEodEndDate] = useState("");
  // const [complianceDateRange, setComplianceDateRange] = useState([]);
  // const [dateRange, setDateRange] = useState(false);

  const getEODCompliance = async () => {
    // setDateRange(false);
    try {
      if (eodDate) {
        setLoader(true);

        let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod/compliance`, {
          params: {
            eod_date: eodDate,
          },
        });
        setCompliance(res.data);      
        setLoader(false);
      } else {
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please enter EOD Date",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
        setCompliance([]);
      }
    } catch (error) {
      setCompliance([]);
      setLoader(false);
    }
  };

  const getEODComplianceDateRange = async () => {
    // setDateRange(true);
    try {
      setLoader(true);
      if (eodStartDate && eodEndDate && eodEndDate > eodStartDate) {
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod/compliance/daterange`, {
          params: {
            start_date: eodStartDate,
            end_date: eodEndDate,
          },
        });
        setCompliance(res.data);
        setLoader(false);
      } else {
        setLoader(false);
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please select valid date",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
    } catch (error) {
      setCompliance([]);
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getEODCompliance();
  }, [eodDate]);
// --------------------------Data Fetching -----------------------------------
const columns = [
  {
    name: (
      <th scope="col">
        Sr.No
      </th>
    ),
    selector: (row,index) => <th scope="row">{index+1}</th>,
  },
  {
    name: (
      <th scope="col">
        Date
      </th>
    ),
    selector: (row) => <td>{moment(row.eod_date).format("DD-MM-YYYY")}</td>,
  },
  {
    name: (
      <th scope="col">
        Submitted on
      </th>
    ),
    selector: (row) =>  <td>{moment(row.created_at).format("DD-MM-YYYY")}</td>,
  },
  {
    name: (
      <th scope="col">
        Emp.Code
      </th>
    ),
    selector: (row) => <td>{row.emp_code}</td>,
  },
  {
    name: (
      <th scope="col">
        Name
      </th>
    ),
    selector: (row) => <td>{row.emp_fname + " " + row.emp_lname}</td>,
  },
  {
    name: (
      <th scope="col">
        Email
      </th>
    ),
    selector: (row) => <td>{row.email}</td>,
    minWidth:"18rem"
  },
  {
    name: (
      <th scope="col">
        Type
      </th>
    ),
    selector: (row) => <td>
    {row.emp_type}
  </td>,
  },
]
const customStyles ={
  pagination: {
    style: {
      color:'black',
      fontSize:'20px',
    },
  },   
};  
  return (
    <>
      {loader ? <div className="loadingPopup"></div> : null}

      {/* <Header /> */}

      <div className="fixed-left">
        <div id="wrapper">
          {/* <Sidebar /> */}
          <div className="content-page">
            <div className="content content-top">
              {/* <Header /> */}
              <div className="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row col-12 px-0 mx-0">
                    <div className="col-sm-12 px-0">
                      <div className="page-title-box">
                        <div className="row col-12 mx-0 px-0 text-center border-bottom">
                          <h3 className="text-uppercase">end of day Compliance</h3>
                        </div>
                        <div className="mt-3 d-flex justify-content-center justify-content-sm-end">
                          <nav className="date-btn d-flex justify-content-between" id="btn-top">
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
                                onClick={() => {
                                  getEODCompliance();
                                }}
                              >
                                Date
                              </button>
                              <button
                                className="nav-link btn-2"
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false"
                                onClick={() => {
                                  if (eodStartDate && eodEndDate) {
                                    getEODComplianceDateRange();
                                  } else {
                                    setCompliance([]);
                                    setEodStartDate("");
                                    setEodEndDate("");
                                  }
                                }}
                              >
                                Date Range
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
                            <div className="row col-12 mx-0 px-0 my-3 text-center">
                              <div className="col-12 col-sm-8 col-md-6 col-lg-5 d-flex justify-content-center justify-content-sm-start align-items-end">
                                <div className="col-10 me-2 date-1">
                                  <p className="date-report mb-0 text-white">
                                    End of Day Report of Date
                                  </p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    className="form-control p-2"
                                    defaultValue={eodDate}
                                    max={todayDate()}
                                    onChange={(e) => setEodDate(e.target.value)}
                                  />
                                </div>
                                {/* <div className="col-2">
                <button
                  type="submit"
                  className="btn-search text-white"
                  onClick={() => {
                    getEODCompliance();
                  }}
                >
                  Search
                </button>
              </div> */}
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center justify-content-center justify-content-sm-start align-items-end">
                              <div className="col-8 col-sm-5 col-md-4">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">Starting Date</p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    className="form-control p-2"
                                    value={eodStartDate}
                                    max={todayDate()}
                                    onChange={(e) => setEodStartDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-8 col-sm-5 col-md-4 mt-3 mt-sm-0">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">End Date</p>
                                  <input
                                    type="date"
                                    className="form-control p-2"
                                    value={eodEndDate}
                                    min={eodStartDate}
                                    max={todayDate()}
                                    onChange={(e) => setEodEndDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-2 mt-3 mt-sm-0 d-flex justify-content-center justify-content-sm-start">
                                <button
                                  type="submit"
                                  className="btn-search text-white"
                                  onClick={getEODComplianceDateRange}
                                >
                                  Search
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="table-responsive mx-auto custm-paginator" style={{ width: "100%" }}>
                        <DataTable 
                            columns={columns} data={compliance}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="400px"
                            subHeader
                            subHeaderAlign="left" 
                            customStyles={customStyles}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container-fluid"> */}
      {/* <div className="row flex-nowrap bg-dark pt-3">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 py-3">
          <Sidebar />
        </div>
      </div> */}
    </>
  );
};

export default Compliance;
