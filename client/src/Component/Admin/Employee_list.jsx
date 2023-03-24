import { React, useEffect, useState } from "react";
import Edit_emp_details from "./Edit_emp_details";
import edit_emp from "./../../Image/EditIcon.svg";
import axios from "axios";
// import Header from "./AdminHeader";
// import Sidebar from "./AdminSidebar";
import "../../css/employee-list.css";

const Employee_list = () => {
  const [empData, setEmpData] = useState([]);
  const [showAllEmpData, setShowAllEmpData] = useState(true);
  const [showSingleEmpData, setShowSingleEmpData] = useState(false);
  const [empId, setEmpId] = useState("");

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

  const getEmpData = async () => {
    setLoader(true)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees`);
      // console.log(res.data[0].email);
      setEmpData(res.data);
      setLoader(false)
    } catch (error) {
      console.log(error);
      setLoader(false)
    }
  };

  const handlesubmit = () => { };

  useEffect(() => {
    getEmpData();
  }, []);

  const SingleEmpData = () => {
    return (
      <>
        <Edit_emp_details empId={empId} />
      </>
    );
  };

  const editEmployee = (empId) => {
    // alert(empId);
    setEmpId(empId);
    setShowAllEmpData(false);
    setShowSingleEmpData(true);
  };

  const AllEmployeesData = () => {
    return (
      <>
        {loader ? <div className="loadingPopup"></div> : null}

        {/* <Header />
        <div className="container-fluid">
        <div className="row flex-nowrap bg-dark pt-3">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 py-3">
            <Sidebar />
          </div>
        </div> */}
        <div className="fixed-left">
          <div id="wrapper">
            <div className="content-page">
              <div className="content">
                {/* <Header /> */}
                <div className="page-content-wrapper">
                  <div className="container-fluid">
                    <div className="row col-12 px-0 mx-0">
                      <div className="col-sm-12 px-0">
                        <div className="page-title-box">
                          <div class="row col-12 mx-0 px-0 text-center border-bottom">
                            <h3 class="text-uppercase">EMPLOYEE'S LIST</h3>
                          </div>
                          <div class="row col-12 mx-0 px-0 justify-content-center mt-3">
                            <div className="table-responsive" style={{ width: "100%" }}>
                              <table className="table border-end-0">
                                <thead>
                                  <tr className="border-start">
                                    <th scope="col" className="border-top">
                                      Sr No.
                                    </th>
                                    <th scope="col" className="border-top">
                                      Emp. code
                                    </th>
                                    <th scope="col" className="border-top">
                                      Name
                                    </th>
                                    <th scope="col" className="border-top">
                                      E-mail
                                    </th>
                                    <th scope="col" className="border-top">
                                      Designation
                                    </th>
                                    <th
                                      scope="col"
                                      className="border-top"
                                      style={{ borderRight: "1px solid #dee2e6" }}
                                    >
                                      Status
                                    </th>
                                    <th className="border-0"></th>
                                  </tr>
                                </thead>
                                <tbody className="">
                                  {empData.map((data) => {
                                    return (
                                      <>
                                        <tr className="border-start">
                                          {console.log(data)}
                                          <th scope="row">{data.emp_id}</th>
                                          <td>{data.emp_code}</td>
                                          <td>{data.emp_fname + " " + data.emp_lname}</td>
                                          <td>{data.email}</td>

                                          <td>{data.post}</td>

                                          <td
                                            style={{ borderRight: "1px solid #dee2e6" }}
                                            className="text-center"
                                          >
                                            {data.status == "ACTIVE" ? (
                                              <i
                                                className="fa-solid fa-circle"
                                                style={{ color: "green", fontSize: "11px" }}
                                                onClick={handlesubmit}
                                                title="Active"
                                              ></i>
                                            ) : (
                                              <i
                                                className="fa-solid fa-circle"
                                                style={{ color: "#fcba03", fontSize: "11px" }}
                                                title="In Active"
                                              ></i>
                                            )}
                                          </td>
                                          <td className="border-0">
                                            <img
                                              src={edit_emp}
                                              alt=""
                                              width={20}
                                              height={20}
                                              onClick={() => {
                                                editEmployee(data.emp_id);
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
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
        {/* </div> */}
      </>
    );
  };

  return (
    <>
      {/* <Header /> */}

      <div className="fixed-left">
        <div id="wrapper">

          {/* <Sidebar /> */}

          {/* <div className="container-fluid"> */}
          {/* <div className="row flex-nowrap bg-dark pt-3">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 py-3">
          <Sidebar />
        </div>
      </div> */}

          {showAllEmpData && <AllEmployeesData />}
          {showSingleEmpData && <SingleEmpData />}

        </div>
      </div>
    </>
  );
};

export default Employee_list;
