import React, { useEffect } from "react";

import _image_75 from "./../../Image/75.jpg";
import BACK from "./../../Image/Back-Button.svg";
import "./../../css/profile.css";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import { useState } from "react";
import Employee_list from "./Employee_list";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Edit_emp_details = (props) => {
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const [empData, setEmpData] = useState({});

  const getEmpData = async () => {
    setLoader(true)
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee`, {
      params: {
        emp_id: props.empId,
      },
    });
    setEmpData(res.data[0]);
    setLoader(false)
  };


  let name, value;
  const getData = (e) => {
    name = e.target.name;
    value = e.target.value;

    setEmpData({ ...empData, [name]: value });
  };

  const getFullName = () => {
    return `${empData.emp_fname} ${empData.emp_midname} ${empData.emp_lname}`
  }


  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  const updateEmployee = async (e) => {

    // e.preventDefault();
    setLoader(true)
    try {
      const res = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee`, {
        fname: empData.emp_fname,
        mname: empData.emp_midname,
        lname: empData.emp_lname,
        email: empData.email,
        phoneno: empData.phoneno,
        post: empData.post,
        type: empData.emp_type,
        status: empData.status,
        update_at: todayDate(),
        // skill_id: empData.emp_skill_id,
        // project_id: 4,
        emp_id: empData.emp_id,
      }
      );

      if (res.status == 200) {
        setLoader(false)
        Swal.fire({
          type: "success",
          icon: "success",
          title: "Employee details updated successfully",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
        // window.location.reload();
      } else {
        setLoader(false)
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Updation failed",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
    } catch (err) {
      setLoader(false)
      console.log(err);
    }

  }

  useEffect(() => {
    getEmpData();
    getSkill()
    getEmpSkill()
    getProject()
    getEmpProject()
    getMentor()
  }, []);

  const [tValue, setTValue] = useState("");
  const [allSkill, setAllSkill] = useState([{}])
  const [empSkill, setEmpSkill] = useState([{}])


  const getSkill = async () => {
    setLoader(false)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/skills`);
      if (res.status == 200) {
        setAllSkill(res.data)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const getEmpSkill = async () => {
    setLoader(true)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/skills`, {
        params: {
          emp_id: props.empId,
        },
      });
      if (res.status == 200) {
        setEmpSkill(res.data)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const handleSkill = async () => {
    setLoader(true)
    try {
      if (tValue != "") {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/skill`, {
          emp_id: props.empId,
          skill_name: tValue,
          created_at: todayDate()
        });
        if (res.status === 200) {
          setTValue("")
          getSkill()
          getEmpSkill()
          setLoader(false)
        } else {
          setLoader(false)
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Skill insertion failed",
            confirmButtonText: 'OK',
            confirmButtonColor: '#06bdff',
          })
        }
      }
      else {
        setLoader(false)
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please select or enter skill",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
    } catch (err) {
      setLoader(false)
      console.log(err);
      Swal.fire({
        type: "error",
        icon: "error",
        title: "Something Went Wrong",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
    }
  }

  const deleteEmpSkill = async (skill_id) => {
    setLoader(true)
    try {
      let res = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/skill`, {
        data: {
          emp_id: props.empId,
          emp_skill_id: skill_id
        },
      });
      if (res.status == 200) {
        getEmpSkill()
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }



  const [pValue, setPValue] = useState({ emp_id: props.empId, project_id: "", project_name: "", mentor_id: "", mentor_name: "" });
  const [allProject, setAllProject] = useState([])
  const [empProject, setEmpProject] = useState([])


  const getProject = async () => {
    setLoader(false)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/admin/projects`, {
        params: {
          emp_id: props.empId
        }
      });
      if (res.status == 200) {
        setAllProject(res.data)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const getEmpProject = async () => {
    setLoader(true)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project`, {
        params: {
          emp_id: props.empId,
        },
      });
      if (res.status == 200) {
        setEmpProject(res.data)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const [mentorList, setMentorList] = useState([])

  const getMentor = async () => {
    setLoader(true)
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employees`);
      if (res.status == 200) {
        setMentorList(res.data)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const handleProjectStatus = (projectId) => {
    setLoader(true)
    try {
      setLoader(false)
      Swal.fire({
        title: 'Do you want to remove the project?',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#06bdff',
      })
        .then((result) => {
          setLoader(true)
          if (result.isConfirmed) {
            const res = axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project/status`, {
              emp_id: props.empId,
              status: 'inactive',
              project_id: projectId,
              updated_at: todayDate()
            });
            if (res.status == 200) {
              getProject()
              getEmpProject()
              setLoader(false)
            } else {
              setLoader(false)
              Swal.fire({
                type: "error",
                icon: "error",
                title: "Project status updation failed",
                confirmButtonText: 'OK',
                confirmButtonColor: '#06bdff',
              })
            }
          }
        })
    } catch (error) {
      console.log(error);
      setLoader(false)
    }
  }




  const handleProject = async () => {
    setLoader(true)
    try {
      // setLoader(false)
      if (pValue.project_name == "" || pValue.project_name == "-- Select Project --") {
        setLoader(false)
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please select project",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
      else if (pValue.mentor_id == "" || pValue.mentor_id == "0") {
        setLoader(false)
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please select mentor",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
      else {
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project`, {
          params: {
            emp_id: props.empId,
          },
        });
        if (res.status == 200) {
          let temp = false;
          res.data.map((dt) => {
            return (
              dt.project_id == pValue.project_id ? temp = true : ''
            )
          })
          if (temp == true) {
            const res = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project`, {
              emp_id: pValue.emp_id,
              project_id: pValue.project_id,
              mentor_id: pValue.mentor_id,
              updated_at: todayDate()
            });
            if (res.status === 200) {
              setPValue({ emp_id: props.empId, project_id: "", mentor_id: 0, project_name: "" })
              getProject()
              getEmpProject()
              setLoader(false)
            } else {
              setLoader(false)
              Swal.fire({
                type: "error",
                icon: "error",
                title: "Project updation failed",
                confirmButtonText: 'OK',
                confirmButtonColor: '#06bdff',
              })
            }
          }
          else if (temp == false) {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project`, {
              emp_id: pValue.emp_id,
              project_id: pValue.project_id,
              mentor_id: pValue.mentor_id,
              created_at: todayDate()
            });
            if (res.status === 200) {
              setPValue({ emp_id: props.empId, project_id: "", mentor_id: 0, project_name: "" })
              getProject()
              getEmpProject()
              setLoader(false)
            } else {
              setLoader(false)
              Swal.fire({
                type: "error",
                icon: "error",
                title: "Project insertion failed",
                confirmButtonText: 'OK',
                confirmButtonColor: '#06bdff',
              })
            }
          }
          setLoader(false)
        }



        // const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/employee/project`, {
        //   emp_id: pValue.emp_id,
        //   project_id: pValue.project_id,
        //   mentor_id: pValue.mentor_id,
        //   created_at: todayDate()
        // });
        // if (res.status === 200) {
        //   setPValue({ emp_id: props.empId, project_id: "", mentor_id: 0, project_name: "" })
        //   getProject()
        //   getEmpProject()
        //   setLoader(false)
        // } else {
        //   setLoader(false)
        //   Swal.fire({
        //     type: "error",
        //     icon: "error",
        //     title: "Project insertion failed",
        //     confirmButtonText: 'OK',
        //     confirmButtonColor: '#06bdff',
        //   })
        // }
      }
    } catch (err) {
      setLoader(false)
      Swal.fire({
        type: "error",
        icon: "error",
        title: "Something Went Wrong",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
    }
  }






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
                      <div className="page-title-box">
                        <div className="row col-12 mx-0 px-0 text-center border-bottom align-items-center">
                          <div className="col-1 px-0 d-flex justify-content-start">
                            <img src={BACK} alt="back" onClick={() => { window.location.reload() }} style={{ width: "33px", height: "33px" }} />
                          </div>
                          <div className="col-11 d-flex justify-content-center">
                            <h3 className="text-uppercase">edit details</h3>
                          </div>

                        </div>
                        <div className="row col-12 mx-0 px-0 justify-content-center mt-3">

                          <div class="col-8 col-sm-5 col-md-6 col-lg-3 px-0 bg-image">
                            <img src={_image_75} alt="" />
                            <div class="row col-12 Empname mx-auto text-center d-flex align-items-center">
                              <h5 style={{ "textTransform": "capitalize" }}>{getFullName()}</h5>
                              <p class="mb-0">Employee Profile</p>
                            </div>
                          </div>

                          <div className="col-12 col-lg-8 mt-3 mt-lg-0">
                            <form className="admin-edit">
                              <div class="row col-12 mx-0 px-0 mb-3">
                                <div class="col-12 col-sm-8">
                                  <label class="mb-1">Employee Code</label>
                                  <input
                                    type="text"
                                    name="emp_code"
                                    id="Empcode"
                                    value={empData.emp_code}
                                    className="form-control"
                                    onChange={getData}
                                  />
                                </div>
                                <div class="col-12 col-sm-4 mt-3 mt-sm-0">
                                  <label class="mb-1">Status</label>
                                  <select
                                    className="form-select"
                                    name="status"
                                    value={empData.status}
                                    onChange={getData}
                                    defaultValue={empData.status}
                                  >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row col-12 mx-0 px-0 mb-3">
                                <div className="col-12 col-sm-8">
                                  <label className="mb-1">Name</label>
                                  <input
                                    type="text"
                                    name="emp_fname"
                                    id="Empname"
                                    value={empData.emp_fname}
                                    className="form-control"
                                    onChange={getData}
                                  />
                                </div>
                                <div className="col-12 col-sm-4 mt-3 mt-sm-0">
                                  <label className="mb-1">Type</label>
                                  <select className="form-select" name="emp_type" value={empData.emp_type} defaultValue={empData.emp_type}
                                    onChange={getData}>
                                    <option value="intern">Intern</option>
                                    <option value="employee">Employee</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="admin">admin</option>

                                  </select>
                                </div>
                              </div>
                              <div class="row col-12 mx-0 px-0 mb-3">
                                <div class="col-12 col-sm-8">
                                  <label class="mb-1">E-mail Id</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={empData.email}
                                    onChange={getData}
                                    className="form-control"
                                    id="inputEmail"
                                    required
                                  />
                                </div>
                                <div class="col-12 col-sm-4 mt-3 mt-sm-0">
                                  <label class="mb-1">Post</label>
                                  <input
                                    type="text"
                                    name="post"
                                    id="Emppost"
                                    value={empData.post}
                                    onChange={getData}
                                    className="form-control"
                                  />
                                </div>
                              </div>

                              <div className="row col-12 mx-0 px-0 mb-3">
                                <div className="col-12 col-md-8"></div>
                                <div className="col-12 col-md-4 mt-3 mt-sm-0 d-flex justify-content-center justify-content-md-end">
                                  <button type="submit" className="btn-done text-white" onClick={(e) => { updateEmployee(e) }}>
                                    Done
                                  </button>
                                </div >
                              </div >
                            </form >
                          </div >
                        </div >
                        <div className="row col-12 mx-0 px-0 justify-content-center admin-edit">
                          <div className="col-12 col-md-5 col-lg-4 px-3 px-md-0">
                            <label className="mb-1">Skills</label>
                            <div className="skill">
                              <Stack style={{ width: "100%" }}>
                                <Autocomplete
                                  freeSolo
                                  id="free-solo-2-demo"
                                  disableClearable

                                  options={allSkill.map((option) => option.skill_name)}
                                  onChange={(event, value) => setTValue(value)}
                                  value={tValue}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      onChange={(e) => { setTValue(e.target.value) }}
                                      placeholder="Skills"
                                    />
                                  )}
                                />
                              </Stack>
                              <i className="fas fa-circle-plus" onClick={handleSkill}></i>
                            </div>
                            <div className="row col-12 mx-0 px-0 mb-0 mb-md-3 mt-0 mt-lg-3">

                              {empSkill.map((data, index) => {
                                return (
                                  <div className="col-6 mt-3 px-1 ps-0 ps-sm-1" key={index} title={data.skill_name} >
                                    <div className="skill-box p-2 col-auto" style={{ paddingRight: 20 }}>
                                      <div className="mb-0" style={{ paddingRight: '2rem' }}>{data.skill_name}</div>
                                      <i className="fas fa-circle-xmark" onClick={() => deleteEmpSkill(data.emp_skill_id)}></i>
                                    </div>
                                  </div>
                                )
                              })}


                            </div>

                          </div>
                          <div className="col-12 col-md-7 px-0 px-sm-1">
                            <div className="row col-12 mx-0 px-0 mb-3">
                              <div className="col-12 col-lg-7 ps-3 pe-2">
                                <div className="emp-project">
                                  <label className="mb-1">Project</label>

                                  <select className="form-select" value={pValue.project_name} onChange={(e) => { setPValue({ ...pValue, project_id: e.target.options[e.target.options.selectedIndex].getAttribute('data-key'), project_name: e.target.value, mentor_id: 0 }); }}>
                                    <option value="-- Select Project --">-- Select Project --</option>
                                    {allProject.map((data) => {
                                      return (
                                        <option key={data.project_id} data-key={data.project_id} value={data.project_name}>{data.project_name}</option>
                                      )
                                    })}
                                  </select>

                                </div>
                                <div className="row col-12 mx-0 px-0 mb-0 mb-md-3 mt-0 mt-lg-3">
                                  {empProject.map((data, index) => {
                                    return (
                                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-3  px-1 ps-0 ps-sm-1 cursor-pointer">
                                        <div className="skill-box">
                                          <p className="m-0 p-2" onClick={() => setPValue({ ...pValue, mentor_id: data.mentor_id, project_id: data.project_id, project_name: data.project_name })} key={data.project_id} title={data.project_name} >{data.project_name}</p>
                                          <i className="fas fa-circle-xmark" onClick={() => handleProjectStatus(data.project_id)}></i>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="col-12 col-lg-4 mt-3 mt-lg-0 px-1 px-lg-0">
                                <div className="row mx-0 px-0">
                                  <div class="col-12 col-sm-6 col-md-12 P-name">
                                    <label className="mb-1">Project Name</label>
                                    <input type="text" name="pname" value={pValue.project_name == "-- Select Project --" ? "" : pValue.project_name} id="PName" className="form-control" />
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-12 Mentor mt-2 mt-sm-0 mt-md-2">
                                    <label className="mb-1">Mentor</label>
                                    <select className="form-select" value={pValue.mentor_id} onChange={(e) => { setPValue({ ...pValue, mentor_id: e.target.value }); }} disabled={pValue.project_name == "" || pValue.project_name == "-- Select Project --"}>
                                      <option value="0" selected={!pValue.project_name || pValue.project_name == "-- Select Project --"}>-- Select Mentor --</option>
                                      {mentorList.map((data, index) => {
                                        return (
                                          (data.emp_id != props.empId && (data.emp_type == "employee" || data.emp_type == "admin") && data.status == "ACTIVE"
                                            ? <option key={data.emp_id} value={data.emp_id}>{data.emp_fname} {data.emp_lname}</option>
                                            : "")
                                        )
                                      })}
                                    </select>
                                    {/* <option key={data.emp_id} value={data.emp_id}>{data.emp_fname} {data.emp_lname}</option> */}
                                  </div>
                                </div>


                                <div className="mt-3 me-2 d-flex justify-content-center justify-content-md-end">
                                  <button type="submit" className="btn-done text-white" onClick={handleProject}>Add Project</button>
                                </div>
                              </div>
                            </div>



                          </div>
                        </div>
                      </div >
                    </div >
                  </div >
                </div >
              </div >
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default Edit_emp_details;
