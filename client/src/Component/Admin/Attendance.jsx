import React from "react";
import "./../../css/attendence.css";
import { useState, useEffect,useMemo } from "react";
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
import DataTable from "react-data-table-component";
import styled from "styled-components";

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
  const [filterText, setFilterText] = useState("");

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
    setLoader(true);
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
        setLoader(false);
      }
      // setAllAttendance(res.data);
      setLoader(false);
    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false);
    }
  };

  const getPresent = async () => {
    setLoader(true);
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
        setLoader(false);
      } else if (res.status == 204) {
        setTableData([]);
      }

      // setPresent(res.data);
      setLoader(false);
    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false);
    }
  };

  const getAbsent = async () => {
    setLoader(true);
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
        setLoader(false);
      } else if (res.status == 204) {
        setTableData([]);
      }
      // setAbsent(res.data);
      setLoader(false);
    } catch (error) {
      setTableData([]);
      console.log(error);
      setLoader(false);
    }
  };

  const getData = () => {
    // alert("called")
    setLoader(true);
    if (eodDate != "") {
      if (attendanceState == "all") {
        getAllAttandace();
        setLoader(false);
      } else if (attendanceState == "present") {
        getPresent();
        setLoader(false);
      } else if (attendanceState == "absent") {
        getAbsent();
        setLoader(false);
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
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    getData();
    setLoader(false);
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

  // --------------------------Data Fetching -----------------------------------
  const columns = [

    {
      name: (
        <th scope="col" className="border-top">
          Sr.No
        </th>
      ),
      selector: (row) => <th scope="row">{row.emp_id}</th>,
      
    },
    {
      name: (
        <th scope="col" className="border-top">
          Date
        </th>
      ),
      selector: (row) => (
        <tr>
          <td>
            {row.eod_date
              ? moment(row.eod_date).format("DD-MM-YYYY")
              : moment(eodDate).format("DD-MM-YYYY")}
          </td>
        </tr>
      ),
      
    },
    {
      name: (
        <th scope="col" className="border-top">
          EmpCode
        </th>
      ),
      selector: (row) => row.emp_code,
      sortable: true,
      
      
    },
    {
      name: (
        <th scope="col" className="border-top">
          Name
        </th>
      ),
      selector: (row) => row.emp_fname + " " + row.emp_lname,
      sortable: true,
    
    },
    {
      name: (
        <th scope="col" className="border-top">
          Email
        </th>
      ),
      selector: (row) =>row.email,
      
    },
    {
      name: (
        <th scope="col" className="border-top">
          Type
        </th>
      ),
      selector: (row) => row.emp_type,
     
    },
    {
      name: (
        <th scope="col" className="border-top">
          Attendance
        </th>
      ),
      selector: (row) => (
        <tr>
          <td className="text-center">
            {row.eod_date ? (
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
        </tr>
      ),
      
    },
    {
      name: (
        <th scope="col" className="border-top">
          {" "}
          T.W.T
        </th>
      ),
      selector: (row) => (
        <tr>
          <td
            style={{ borderRight: "1px solid #dee2e6" }}
            className="text-center"
          >
            {row.total_work_time ? row.total_work_time : "T.W.T unavailable"}
          </td>
        </tr>
      ),
      
    },

    {
      selector: (row) => (
        <tr>
          <td className="border-0">
            {row.eod_date ? (
              <>
                <img
                  src={edit_emp}
                  alt=""
                  width={20}
                  height={20}
                  onClick={() => {
                    ShowTask(
                      row.emp_id,
                      moment(row.eod_date).format("YYYY-MM-DD"),
                      row.emp_fname + " " + row.emp_lname,
                      row.phoneno,
                      row.email
                    );
                  }}
                />
              </>
            ) : (
              " "
            )}
          </td>
        </tr>
      ),
     
    },
   
  ];
  
  //--------------------------Data Fetching -----------------------------------

  //------------------------Searching Data----------------------------------
 
 const TextField = styled.input`
 height: 32px;
 width: 200px;
 border-radius: 3px;
 border-top-left-radius: 5px;
 border-bottom-left-radius: 5px;
 border-top-right-radius: 0;
 border-bottom-right-radius: 0;
 border: 1px solid #e5e5e5;
 padding: 0 32px 0 16px;

 &:hover {
   cursor: pointer;
 }
`;
const FilterComponent = ({ filterText, onFilter}) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search by name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      autoFocus
    />
  </>
);
const filteredItems = tableData.filter(
item => item.emp_fname.toLowerCase().includes(filterText.toLowerCase()) ||
        item.emp_lname.toLowerCase().includes(filterText.toLowerCase()),
);
const subHeaderComponentMemo = useMemo(() => {
  return (
    <FilterComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} />
  );
}, [filterText]);

 //------------------------Searching Data----------------------------------
const customStyles ={
        pagination: {
      		style: {
            color:'black',
            fontSize:'20px',
      		},
      	},
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
                                  className={
                                    allAttendance
                                      ? "nav-link btn-1 active px-4"
                                      : "nav-link btn-1 px-4"
                                  }
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
                                    setAbsent(false);
                                    setPresent(false);
                                    setAllAttendance(true);
                                  }}
                                  // onClick={() => getAllAttandace()}
                                >
                                  All
                                </button>
                                <button
                                  className={
                                    present
                                      ? "nav-link active btn-1"
                                      : "nav-link btn-1"
                                  }
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
                                    setAllAttendance(false);
                                    setAbsent(false);
                                    setPresent(true);
                                  }}
                                  // onClick={() => getPresent()}
                                >
                                  Present
                                </button>
                                <button
                                  className={
                                    absent
                                      ? "nav-link active btn-1"
                                      : "nav-link btn-1"
                                  }
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
                                    setAllAttendance(false);
                                    setPresent(false);
                                    setAbsent(true);
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
                          <DataTable 
                            columns={columns} data={filteredItems}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="400px"
                            subHeader
                            subHeaderAlign="left"
                            subHeaderComponent={subHeaderComponentMemo}    
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
