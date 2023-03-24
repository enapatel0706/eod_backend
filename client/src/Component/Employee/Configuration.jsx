import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./../../css/configuration.scss";

const Configuration = () => {

  //------------ Loader Code Start------------
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  //------------ Loader Code End ------------

  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };

  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }

  const [mentor, setMentor] = useState({
    email1: null,
    email2: null,
    email3: null,
  })

  const getMentor = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/additional/mail`, {
        params: {
          emp_id: getuserDetails().empId,
        },
      });
      if (res.status == 200) {
        setMentor({ ...mentor, email1: res.data[0].mentor1_email, email2: res.data[0].mentor2_email, email3: res.data[0].mentor3_email })
      }
    } catch (error) {
      msg("error", "error", "Something went wrong")
    }
  }

  useEffect(() => {
    getMentor();
  }, [])

  const getInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setMentor({ ...mentor, [name]: value });
  };

  const msg = (type, icon, title) => {
    Swal.fire({
      type: type,
      icon: icon,
      title: title,
      confirmButtonText: 'OK',
      confirmButtonColor: '#06bdff',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    if (!mentor.email1) {
      setLoader(false)
      msg("warning", "warning", "Mentor 1 field is mandatory")
    }
    else if (mentor.email1 && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mentor.email1))) {
      setLoader(false)
      msg("warning", "warning", "Please enter valid email address for mentor 1")
    }
    else if (mentor.email2 && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mentor.email2))) {
      setLoader(false)
      msg("warning", "warning", "Please enter valid email address for mentor 2")
    }
    else if (mentor.email3 && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mentor.email3))) {
      setLoader(false)
      msg("warning", "warning", "Please enter valid email address for mentor 3")
    }
    else {
      try {
        const res = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/additional/mail`, {
          emp_id: getuserDetails().empId,
          email1: mentor.email1,
          email2: mentor.email2,
          email3: mentor.email3,
          updated_at: todayDate()
        });

        if (res.status == 200) {
          setLoader(false)
          msg("success", "success", "Configuration done successfully")
        } else {
          setLoader(false)
          msg("error", "error", "Something went wrong")
        }
      } catch (err) {
        setLoader(false)
        msg("error", "error", "Something went wrong")
      }
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
              {/* <Navbar /> */}
              <div className="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row col-12 px-0 mx-0">
                    <div className="col-sm-12 px-0">
                      <div className="page-title-box">
                        <div className="row col-12 mx-0 px-0 text-center border-bottom">
                          <h3 className="text-uppercase">configuration</h3>
                        </div>

                        <form className="mt-5 pt-2">
                          <div className="row col-12 mx-0 px-0 mt-5 mb-3 align-items-center justify-content-center mentor-id">
                            <label htmlFor="inputEmail" className="col-auto form-label mb-0">
                              Mentor1 E-mail Id
                            </label>
                            <div className="col-4 d-flex px-0" style={{ position: "relative" }}>
                              <input
                                type="email"
                                className="form-control"
                                id="inputEmail"
                                placeholder="Email" name="email1"
                                value={mentor.email1}
                                onChange={getInput}
                                required
                              />
                              <i className="fas fa-pen icon"></i>
                            </div>
                          </div>
                          <div className="row col-12 mx-0 px-0 mb-3 align-items-center justify-content-center mentor-id">
                            <label htmlFor="inputEmail" className="col-auto form-label mb-0">
                              Mentor2 E-mail Id
                            </label>
                            <div className="col-4 d-flex px-0" style={{ position: "relative" }}>
                              <input
                                type="email"
                                className="form-control"
                                id="inputEmail"
                                placeholder="Email" name="email2"
                                value={mentor.email2}
                                onChange={getInput}
                              />
                              <i className="fas fa-pen icon"></i>
                            </div>
                          </div>
                          <div className="row col-12 mx-0 px-0 mb-3 align-items-center justify-content-center mentor-id">
                            <label htmlFor="inputEmail" className="col-auto form-label mb-0 px-4">
                              Other E-mail Id
                            </label>
                            <div className="col-4 d-flex px-0" style={{ position: "relative" }}>
                              <input
                                type="email"
                                className="form-control"
                                id="inputEmail"
                                placeholder="Email" name="email3"
                                value={mentor.email3}
                                onChange={getInput}
                              />
                              <i className="fas fa-pen icon"></i>
                            </div>
                          </div>
                          <div className="row col-12 mx-0 px-0 mb-3 align-items-center justify-content-center mentor-id">
                            <div className="col-5 px-0 ms-5 d-flex justify-content-end">
                              <button type="submit" className="btn-done text-white" onClick={handleSubmit}>
                                Done
                              </button>
                            </div>
                          </div>
                        </form>
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

export default Configuration;
