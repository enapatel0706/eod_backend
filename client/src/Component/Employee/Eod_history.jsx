import React, { useState, useEffect } from "react";
// import "./../../css/history.css";
import "./../../css/history.scss";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const Eod_history = () => {
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
    today = dd + "-" + mm + "-" + yyyy;
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };

  const [eodDate, setEodDate] = useState(todayDate());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [tasks, setTasks] = useState([]);

  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };

  const fetchTask = async () => {
    try {
      setLoader(true);
      if (eodDate) {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod/task`, {
          params: {
            empid: getuserDetails().empId,
            eoddate: eodDate,
          },
        });
        setTasks(res.data);
        setLoader(false);
      } else {
        Swal.fire({
          title: "Error",
          type: "error",
          icon: "error",
          text: "Select Date",
        }).then(() => setLoader(false));
      }
    } catch (err) {
      setTasks([]);
      setLoader(false);
    }
  };

  const fetchDateRange = async () => {
    try {
      setLoader(true);
      if ((startDate && endDate) && (endDate > startDate)) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/eod/task/daterange`,
          {
            params: {
              emp_id: getuserDetails().empId,
              start_date: startDate,
              end_date: endDate,
            },
          }
        );
        setTasks(res.data);
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
    } catch (err) {
      setTasks([]);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [eodDate]);

  return (
    <>
      {loader ? <div className="loadingPopup"></div> : null}
      <div className="fixed-left">
        <div id="wrapper">
          {/* <Sidebar /> */}
          <div className="content-page">
            <div className="content">
              {/* <Navbar /> */}
              <div className="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row col-12 px-0 mx-0">
                    <div className="col-sm-12 px-0">
                      <div className="page-title-box">
                        <div className="row col-12 mx-0 px-0 text-center border-bottom">
                          <h3 className="text-uppercase">end of day report</h3>
                        </div>
                        <div className="mt-3 d-flex justify-content-end">
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
                                  fetchTask();
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
                                // onClick={() => { setTasks([]); }}
                                onClick={() => {
                                  if (startDate && endDate) {
                                    fetchDateRange();
                                  } else {
                                    setTasks([]);
                                    setStartDate("");
                                    setEndDate("");
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
                              <div className="col-10 col-sm-8 col-md-5 d-flex align-items-end">
                                <div className="col-10 me-2 date-1">
                                  <p className="date-report mb-0 text-white">
                                    End of Day Report Date
                                  </p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    className="form-control p-2"
                                    defaultValue={eodDate}
                                    max={todayDate()}
                                    onChange={(e) => setEodDate(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="col-2">
                                  {/* <button
                  type="submit"
                  className="btn-search text-white"
                  onClick={() => {
                    fetchTask();
                  }}
                >
                  Search
                </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center align-items-end">
                              <div className="col-12 col-sm-6 col-md-5 col-lg-4 d-flex">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">Starting Date</p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    className="form-control p-2"
                                    value={startDate}
                                    max={todayDate()}
                                    onChange={(e) => setStartDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-6 col-md-5 col-lg-4 mt-3 mt-sm-0 d-flex">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">End Date</p>
                                  <input
                                    type="date"
                                    className="form-control p-2"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    max={todayDate()}
                                  />
                                </div>
                              </div>
                              <div className="col-2 mt-3 mt-md-0 d-flex justify-content-start">
                                <button
                                  type="submit"
                                  className="btn-search text-white"
                                  onClick={fetchDateRange}
                                >
                                  Search
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="table-responsive" style={{ width: "100%" }}>
                        <table className="table border">
                          <thead>
                            <tr>
                              <th scope="col">Sr. no</th>
                              <th scope="col">Date</th>
                              <th scope="col">Project</th>
                              <th scope="col">Task</th>
                              <th scope="col">Description</th>
                              <th scope="col">Status</th>
                              <th scope="col">T.W.T</th>
                            </tr>
                          </thead>
                          <tbody className="position-relative">
                            {tasks.length != 0 ? (
                              tasks.map((elem, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{moment(elem.eod_date).format("DD-MM-YYYY")}</td>
                                  <td>{elem.project_name}</td>
                                  <td>{elem.task_title}</td>
                                  <td>{elem.task_desc}</td>
                                  <td>
                                    {elem.status == "COMPLETED" ? (
                                      <i
                                        className="fa-solid fa-calendar-check"
                                        style={{ color: "green" }}
                                        title="Complete"
                                      ></i>
                                    ) : (
                                      <i
                                        className="fa-solid fa-hourglass-half"
                                        style={{ color: "orange" }}
                                        title="Work in progress"
                                      ></i>
                                    )}
                                  </td>
                                  <td>{elem.worktime}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <th colSpan={7} style={{ textAlign: "center" }}>
                                  No Data Available
                                </th>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
    </>
  );
};

export default Eod_history;
