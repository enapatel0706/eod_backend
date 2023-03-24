import React from "react";
import "./../../css/attendence.css";
import { useState, useEffect } from "react";
// import "./../../css/attendence.scss";
import axios from "axios";
// import "./../../css/attendencenew.scss";
import edit_emp from "./../../Image/EditIcon.svg";
import presentIcon from "./../../Image/Present.png";
import absentIcon from "./../../Image/Absent.jpeg";
import moment from "moment";
// import Header from "./AdminHeader";
// import Sidebar from "./Sidebar";
import History from "./History";
import Swal from "sweetalert2";

const Attendance = () => {
  const [allAttendance, setAllAttendance] = useState(true);
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  let [attendanceState, setAttendanceState] = useState("all");
  let [tableData, setTableData] = useState([]);

  const [showAllTaskData, setShowAllTaskData] = useState(true);
  const [showSingleTaskData, setshowSingleTaskData] = useState(false);
  const [empId, setEmpId] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
    setLoader(false);
  }, []);

  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };

  let [eodDate, setEodDate] = useState(todayDate());

  const getAllAttandace = async () => {
    setLoader(true)
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance`,
        {
          params: {
            eod_date: eodDate,
          },
        }
      );
      if (res.status == 200) {
        setTableData(res.data);
        setLoader(false)
      }
      // setAllAttendance(res.data);
      setLoader(false)

    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false)
    }
  };

  const getPresent = async () => {
    setLoader(true)
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/present`,
        {
          params: {
            eod_date: eodDate,
          },
        }
      );

      if (res.status == 200) {
        setTableData(res.data);
        setLoader(false)
      }
      // setPresent(res.data);
      setLoader(false)
    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false)
    }
  };

  const getAbsent = async () => {
    setLoader(true)
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/attendance/absent`,
        {
          params: {
            eod_date: eodDate,
          },
        }
      );

      if (res.status == 200) {
        setTableData(res.data);
        setLoader(false)
      }
      // setAbsent(res.data);
      setLoader(false)
      // console.log("----- Present-Data  ------");
      // console.log(present);
    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false)
    }
  };

  const getData = () => {
    // alert("called")
    setLoader(true)
    if (eodDate != "") {
      if (attendanceState == "all") {
        getAllAttandace();
        setLoader(false)
      } else if (attendanceState == "present") {
        getPresent();
        setLoader(false)
      } else if (attendanceState == "absent") {
        getAbsent();
        setLoader(false)
      }
    } else {
      Swal.fire({
        type: "warning",
        icon: "warning",
        title: "Please Enter EOD Date",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
      setTableData([]);
      setLoader(false)
    }
  };

  useEffect(() => {
    setLoader(true)
    getData();
    setLoader(false)
  }, [eodDate]);

  const SingleTask = () => {
    return (
      <>
        <History
          empId={empId}
          date={date}
          name={name}
          phoneno={phoneno}
          email={email}
          temp={true}
        />
      </>
    );
  };
  const ShowTask = (empId, date, name, phoneno, email) => {
    setEmpId(empId);
    setDate(date);
    setName(name);
    setPhoneno(phoneno);
    setEmail(email);
    setShowAllTaskData(false);
    setshowSingleTaskData(true);
  };

  const AllTask = () => {
    return (
      <>
        {/* <Header /> */}
        <div className="fixed-left">
          <div id="wrapper">
            {/* <Sidebar /> */}
            <div className="content-page">
              <div className="content">
                {/* <Header /> */}
                <div className="page-content-wrapper">
                  <div className="container-fluid">
                    <div className="row col-12 px-0 mx-0">
                      <div className="col-sm-12 px-0" id="attendence-report">
                        <div className="page-title-box" id="attendence-report">
                          <div className="row col-12 mx-0 px-0 text-center border-bottom">
                            <h3 className="text-uppercase">
                              employee's attendence report
                            </h3>
                          </div>

                          <div className="mt-3 d-flex justify-content-center justify-content-sm-end">
                            <nav
                              className="date-btn d-flex justify-content-between"
                              id="btn-top"
                            >
                              <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist"
                              >
                                <button
                                  className={allAttendance ? "nav-link btn-1 active px-4" : "nav-link btn-1 px-4"}
                                  id="nav-home-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-home"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-home"
                                  aria-selected="true"
                                  onClick={() => {
                                    setAttendanceState("all");
                                    getAllAttandace();
                                    setAbsent(false); setPresent(false); setAllAttendance(true);
                                  }}
                                // onClick={() => getAllAttandace()}
                                >
                                  All
                                </button>
                                <button
                                  className={present ? "nav-link active btn-1" : "nav-link btn-1"}
                                  id="nav-profile-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-profile"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-profile"
                                  aria-selected="false"
                                  onClick={() => {
                                    setAttendanceState("present");
                                    getPresent();
                                    setAllAttendance(false); setAbsent(false); setPresent(true);
                                  }}
                                // onClick={() => getPresent()}
                                >
                                  Present
                                </button>
                                <button
                                  className={absent ? "nav-link active btn-1" : "nav-link btn-1"}
                                  id="nav-profile-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-profile"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-profile"
                                  aria-selected="false"
                                  onClick={() => {
                                    setAttendanceState("absent");
                                    getAbsent();
                                    setAllAttendance(false); setPresent(false); setAbsent(true);
                                  }}
                                >
                                  Absent
                                </button>
                              </div>
                            </nav>
                          </div>

                          <div className="row col-12 mx-0 px-0 my-3 justify-content-center justify-content-sm-start border-bottom pb-3">
                            <div className="col-10 col-sm-5 col-md-4 d-flex px-0">
                              <div className="col-12 attendence-date">
                                <p className="attendence-report mb-0 text-white text-center">
                                  Attendence Report of Date
                                </p>
                                <input
                                  type="date"
                                  id="eod_date"
                                  name="eod_date"
                                  className="form-control p-2"
                                  defaultValue={todayDate()}
                                  max={todayDate()}
                                  onChange={(e) => {
                                    setEodDate(e.target.value);
                                    // getData();
                                  }}
                                  value={eodDate}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="table-responsive mx-auto"
                            style={{ width: "100%" }}
                          >
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
                                    Emp.Code
                                  </th>
                                  <th scope="col" className="border-top">
                                    Name
                                  </th>
                                  <th scope="col" className="border-top">
                                    Email
                                  </th>
                                  <th scope="col" className="border-top">
                                    Type
                                  </th>
                                  <th scope="col" className="border-top">
                                    Attendance
                                  </th>
                                  <th
                                    scope="col"
                                    className="border-top"
                                    style={{ borderRight: "1px solid #dee2e6" }}
                                  >
                                    T.W.T
                                  </th>
                                  <th className="border-0"></th>
                                </tr>
                              </thead>

                              <tbody className="">
                                {tableData.length != 0 ? (
                                  <>
                                    {tableData.map((elem, index) => {
                                      return (
                                        <>
                                          <tr className="border-start">
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                              {elem.eod_date
                                                ? moment(elem.eod_date).format(
                                                  "DD-MM-YYYY"
                                                )
                                                : moment(eodDate).format(
                                                  "DD-MM-YYYY"
                                                )}
                                            </td>
                                            <td>{elem.emp_code}</td>
                                            <td>
                                              {elem.emp_fname} {elem.emp_lname}
                                            </td>
                                            <td>{elem.email}</td>
                                            <td>{elem.emp_type}</td>
                                            <td className="text-center">
                                              {elem.eod_date ? (
                                                <img
                                                  src={presentIcon}
                                                  alt="present"
                                                  width={20}
                                                  height={20}
                                                  title="Present"
                                                />
                                              ) : (
                                                <img
                                                  src={absentIcon}
                                                  alt="absent"
                                                  width={20}
                                                  height={20}
                                                  title="Absent"
                                                />
                                              )}
                                            </td>
                                            <td
                                              style={{
                                                borderRight: "1px solid #dee2e6",
                                              }}
                                              className="text-center"
                                            >
                                              {elem.total_work_time
                                                ? elem.total_work_time
                                                : "T.W.T unavailable"}
                                            </td>
                                            <td className="border-0">
                                              {elem.eod_date ? (
                                                <>
                                                  <img
                                                    src={edit_emp}
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                    onClick={() => {
                                                      ShowTask(
                                                        elem.emp_id,
                                                        moment(
                                                          elem.eod_date
                                                        ).format("YYYY-MM-DD"),
                                                        elem.emp_fname +
                                                        " " +
                                                        elem.emp_lname,
                                                        elem.phoneno,
                                                        elem.email
                                                      );
                                                    }}
                                                  />
                                                </>
                                              ) : (
                                                " "
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <tr className="text-center">
                                    <th
                                      style={{
                                        borderRight: "1px solid #dee2e6",
                                        borderLeft: "1px solid #dee2e6",
                                      }}
                                      className="text-center"
                                      colSpan="8"
                                    >
                                      No Data Available.
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

  return (
    <>
      {loader ? <div className="loadingPopup">Hello</div> : null}

      {showAllTaskData && <AllTask />}
      {showSingleTaskData && <SingleTask />}
    </>
  );
};

export default Attendance;
