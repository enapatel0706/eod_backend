import React from "react";
import { useState, useEffect } from "react";
import _image_75 from "./../../Image/75.jpg";
import "./../../css/admin-history.css";
import edit_emp from "./../../Image/EditIcon.svg";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";

const History = (props) => {
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

  const [empData, setEmpData] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bar, setBar] = useState(false);

  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  const [eodDate, setEodDate] = useState(props.date ? props.date : todayDate());
  const getEmpData = async () => {
    try {
      setLoader(true);

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod/task`, {
        params: {
          empid: props.empId,
          eoddate: props.date,
        },
      });
      console.log("-----fatch data-----");
      console.log(res.data);
      setTasks(res.data);
      setBar(true);
      console.log("----empdata ----");
      console.log(tasks);
    } catch (err) {
      setTasks([]);
      setLoader(false);
    }
  };

  let name, value;
  const getData = (e) => {
    name = e.target.name;
    value = e.target.value;

    setTasks({ ...tasks, [name]: value });
  };

  const fetchTask = async () => {
    try {
      setLoader(true);

      if (eodDate) {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod`, {
          params: {
            eod_date: eodDate,
          },
        });
        setTasks(res.data);
        console.log("----fetchtask------");
        console.log(tasks);
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
      if (startDate && endDate && endDate > startDate) {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/eod/daterange`, {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
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
    getEmpData();
  }, []);

  useEffect(() => {
    !props.temp && fetchTask();
  }, [eodDate]);

  return (
    <>
      {loader ? <div className="loadingPopup"></div> : null}
      <div className="fixed-left">
        <div id="wrapper">
          {/* <Sidebar /> */}
          <div className="content-page">
            <div className="content">
              {/* <Header /> */}
              <div className="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row col-12 px-0 mx-0">
                    <div className="col-sm-12 px-0">
                      <div className="page-title-box" id="admin-history">
                        {bar == true ? (
                          <>
                            {console.log(props.phone)}

                            <div className="row flex-nowrap">
                              <div className="col py-2 h-100">
                                <div className="row col-12 mx-0 px-0 text-center border-bottom">
                                  <h3 className="text-uppercase">end of day report</h3>
                                </div>
                              </div>
                            </div>
                            <div className="row col-12 mx-0 px-0 justify-content-center border-bottom pb-3">
                              <div className="col-12 col-sm-6 col-md-4 fs-5 d-flex align-items-center justify-content-center">
                                <i className="fas fa-user"></i>
                                <p className="name mb-0 ms-1">{props.name}</p>
                              </div>
                              <div className="col-12 col-sm-6 col-md-4 fs-5 mt-2 mt-sm-0 d-flex align-items-center justify-content-center">
                                <i className="fas fa-phone"></i>
                                <p className="phone mb-0 ms-1">
                                  <span>+91</span>
                                  {props.phoneno}
                                </p>
                              </div>
                              <div className="col-12 col-md-4 fs-5 d-flex align-items-center justify-content-center mt-2 mt-md-0">
                                <i className="fas fa-envelope"></i>
                                <p className="email mb-0 ms-1">{props.email}</p>
                              </div>
                            </div>










                          </>
                        ) : (
                          <></>
                        )}
                        {/* TitleBar */}

                        {/* End Title Bar */}

                        <div className="mt-3 d-flex justify-content-center justify-content-sm-end">
                          <nav className="date-btn d-flex justify-content-between" id="btn-top">
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                              <button
                                className="nav-link btn-1 active"
                                id="nav-history-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-history"
                                type="button"
                                role="tab"
                                aria-controls="nav-history"
                                aria-selected="true"
                                onClick={() => {
                                  fetchTask();
                                }}
                              >
                                Date
                              </button>
                              <button
                                className="nav-link btn-1"
                                id="nav-profile_history-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile_history"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile_history"
                                aria-selected="false"
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
                            id="nav-history"
                            role="tabpanel"
                            aria-labelledby="nav-history-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center">
                              <div className="col-10 col-sm-8 col-md-5 d-flex align-items-end">
                                <div className="col-10 me-2 date-1">
                                  <p className="date-report mb-0 text-white">
                                    End of Day Report of Date
                                  </p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="eod_date"
                                    className="form-control p-2"
                                    value={eodDate}
                                    // defaultValue={eodDate}
                                    max={todayDate()}
                                    onChange={(e) => { setEodDate(e.target.value); fetchTask(); }}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-profile_history"
                            role="tabpanel"
                            aria-labelledby="nav-profile_history-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center align-items-end">
                              <div className="col-12 col-sm-5 col-md-4">
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
                              <div className="col-12 col-sm-5 col-md-4 mt-3 mt-sm-0">
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
                              <div className="col-12 col-sm-2 mt-3 mt-sm-0 d-flex justify-content-center justify-content-sm-start">
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

                          <div className="table-responsive" style={{ width: "100%" }}>
                            <table className="table border-end-0">
                              <thead>
                                <tr className="border-start">
                                  <th scope="col" className="border-top">
                                    Sr No.
                                  </th>
                                  <th scope="col" className="border-top">
                                    Date
                                  </th>
                                  <th scope="col" className="border-top">
                                    Name
                                  </th>
                                  <th scope="col" className="border-top">
                                    Project
                                  </th>
                                  <th scope="col" className="border-top">
                                    Task
                                  </th>
                                  <th scope="col" className="border-top">
                                    Description
                                  </th>
                                  <th scope="col" className="border-top">
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="border-top"
                                    style={{ borderRight: "1px solid #dee2e6" }}
                                  >
                                    T.W.T
                                  </th>
                                  {/* <th className="border-0" ></th> */}
                                </tr>
                              </thead>
                              <tbody className="position-relative">
                                {tasks.length != 0 ? (
                                  tasks.map((elem, index) => (
                                    <tr style={{ borderRight: "1px solid rgb(222, 226, 230)", borderLeft: "1px solid rgb(222, 226, 230)" }}>
                                      <td>{index + 1}</td>
                                      <td>{moment(elem.eod_date).format("DD-MM-YYYY")}</td>
                                      <td>{elem.emp_fname + " " + elem.emp_lname}</td>
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
                                    <th colSpan={8} style={{ textAlign: "center", borderRight: "1px solid rgb(222, 226, 230)", borderLeft: "1px solid rgb(222, 226, 230)" }}>
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
      </div>



    </>
  );
};

export default History;