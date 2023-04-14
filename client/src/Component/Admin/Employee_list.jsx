import { React, useEffect, useState } from "react";
import Edit_emp_details from "./Edit_emp_details";
import edit_emp from "./../../Image/EditIcon.svg";
import axios from "axios";
// import Header from "./AdminHeader";
// import Sidebar from "./AdminSidebar";
import "../../css/employee-list.css";
import Pagination from 'react-bootstrap/Pagination';
import { convertLength } from "@mui/material/styles/cssUtils";

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
      
      setEmpData(res.data);
      setLoader(false)
    } catch (error) {
      console.log(error);
      setLoader(false)
    }
  };

  const handlesubmit = () => { };

  

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
    // ---------------Pagination Code------------

  let [pageData, setPageData] = useState([])
  const [page,setPage]= useState(1)
  const [pagecount,setPagecount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("");

  const handleNext = () =>{
    if(page === pagecount) return page
    setPage(page + 1)
  }

  const handlePrevious = () =>{
    if(page === 1) return page
    setPage(page - 1)
  }
  useEffect(() => {
    getEmpData();
   
  }, [page]);

  
  const filteredEmpData = empData.filter(
    
    (data) =>
      data.emp_fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.emp_lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(data.emp_code).toLowerCase().includes(searchQuery.toLowerCase())
);


  const displayData = searchQuery ? filteredEmpData : pageData
  const pagedatacount = Math.ceil(empData.length/8)
  const limit = 8
  useEffect(() =>{
        setPagecount(pagedatacount)
          if(page){
            
            const skip = limit * page
              const dataskip = empData.slice(page === 1 ? 0 : skip - limit, skip) 
              setPageData(dataskip)
          }
         
  },[empData])

  // ---------------Pagination Code------------
     
  const AllEmployeesData = () => {
    return (
      <>
        {loader ? <div className="loadingPopup"></div> : null}
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
                          <div className="row col-12 mx-0 px-0 text-center border-bottom">
                            <h3 className="text-uppercase">EMPLOYEE'S LIST</h3>
                          </div>
                          <div className="nav-link input-group d-flex w-25 mt-3">
                            <button className="btn btn-secondary">
                              <i className="fas fa-search"></i>
                            </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                      }
                                      autoFocus />      
                          </div>
                          <div className="row col-12 mx-0 px-0 justify-content-center mt-3">
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
                                {filteredEmpData.length > 0?
                                  displayData.map((data) => {
                                    return (
                                      <>
                                        <tr className="border-start" key={data.emp_id}>
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
                                  }):(<tr>
                                    <th colSpan={6} style={{ textAlign: "center", borderRight: "1px solid rgb(222, 226, 230)", borderLeft: "1px solid rgb(222, 226, 230)" }}>
                                      No Data Available
                                    </th>
                                  </tr>)
                                }
                                </tbody>
                              </table>
                              
                              <div>
                              {
                                searchQuery.length == 0?
                                  <Pagination>
              
                                      <Pagination.Prev onClick={handlePrevious} disabled={page === 1}/>
                                      {
                                        Array(pagecount).fill(null).map((ele,index) =>{
                                            return(
                                                <>
                                                <Pagination.Item active={page === index+1 ? true : false} onClick={() => setPage(index+1)}>{index+1}</Pagination.Item>
                                                
                                                </>
                                            )
                                        })
                                      }
                                      <Pagination.Next onClick={handleNext} disabled={page === pagecount} />
                                      
                                  </Pagination>: null
                              }
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
        </div>
      </>
    );
  };

  return (
    <>
      {/* <Header /> */}

      <div className="fixed-left">
        <div id="wrapper">

          {showAllEmpData && <AllEmployeesData />}
          {showSingleEmpData && <SingleEmpData />}

        </div>
        
      </div>
    </>
  );
};

export default Employee_list;
