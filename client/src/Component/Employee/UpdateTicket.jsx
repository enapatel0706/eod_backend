import React, { useState,useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import pinimg from "../../Image/icon-pin.svg";
import "./../../css/eod.css";

const UpdateTicket = () => {
  const defaultdate = new Date();
  // const getdate=defaultdate.getDate();
  // getdate.toLocaleString();

  // const date=()=>{
  //     setInputDate(getdate);
  //     console.log("date",inputdate)
  // }
  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  const [inputdate, setInputDate] = useState(todayDate());
  const navigate = useNavigate();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reqid =  queryParams.get("req_id") ;

  const handleCancel = () => {
     navigate("/helpdesk")  ; 
  }; 
  return (
    <>
      <div className="fixed-left">
        <div id="wrapper">
          <div className="content-page">
            <div className="content">
              <div className="page-content-wrapper">
                <div className="container-fluid">
                  <div className="row col-12 border-bottom ">
                    <div className="col-8 col-sm-4 mt-sm-4 mt-3 ">
                      <div className="input-group-date input-group ">
                        <span className="input-group-text ">Date</span>
                        <div className="col-sm-4 col-8">
                          <input
                            type="date"
                            className="form-control "
                            defaultValue={inputdate}
                            onChange={(e) => setInputDate(e.target.value)}
                            max={todayDate()}
                          />
                        </div>
                      </div>
                    </div>
                          <div className="col-sm-4 col-12  d-flex flex-sm-row flex-column justify-content-center mt-sm-4 mt-3">
                            <h3 className="  raise-ticket-title  ">
                              Ticket<span className="span-title">{reqid} </span>
                            </h3>
                          </div>
                    <div className="col-sm-4 col-12  d-flex  flex-sm-row flex-column  justify-content-sm-end justify-content-center mb-xl-2 mb-2 mt-sm-4 mt-3">
                      <button
                        type="submit"
                        className="btn submit-data-btn"
                      >
                        Raise Ticket
                      </button>
                    </div>
                  </div>
                  <div>
                    <form className="row">
                    <div className="col-lg-8 col-12">
                      <div className="row mt-5 ms-sm-5 ms-0">
                        <div className="col-12 col-sm-6">
                          <label className="form-label raise-ticket-label">
                            Category
                          </label>
                          <div id="input-color">
                            <select
                              name="projectId"
                              id="Project"
                              className="form-select"
                              required
                              placeholder=" Category"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-6  ">
                          <label className="form-label raise-ticket-label">
                            Sub-Category List
                          </label>
                          <div id="input-color">
                            <select
                              name="projectId"
                              id="Project"
                              className="form-select"
                              required
                              placeholder="Sub-Category List"
                            />
                          </div>
                        </div>
                        {/* <div className="col-12 col-sm-3  ms-xl-5 ms-0">
                          <label className="form-label raise-ticket-label">
                            Status
                          </label>
                          <div className="status-placeholder">
                            <input
                              type="text"
                              className="form-control"
                              placeholder=" Drafting Query"
                            />
                          </div>
                        </div> */}
                      </div>
                      <div className="row ms-sm-5 ms-0   mt-3">
                        <label className="form-label col-12 raise-ticket-label">
                          Title
                        </label>
                        <div id="input-color" className="col-12 ">
                          <input
                            type="text"
                            className="form-control"
                            id="input-color"
                            placeholder="Here comes the Title"
                          />
                        </div>
                      </div>

                      <div className="row mt-3  ms-sm-5 ms-0">
                        <div className="col-12 ">
                          <label className="form-label raise-ticket-label">
                            Description
                          </label>
                          <div id="input-color">
                            <textarea
                              className="form-control"
                              placeholder="Here comes the Brief information about the task done."
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3  ms-sm-5 ms-0">
                        <div className="col-12 ">
                          <label className="form-label raise-ticket-label">
                            Attach File
                          </label>
                          <div id="input-color">
                            <input
                              id="input-file"
                              className="d-none"
                              type="file"
                            />
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control cstm-control"
                                placeholder="upload"
                              />
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <img src={pinimg} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4  ms-sm-5 ms-0">
                        <div className="col-12  d-sm-flex ">
                          <div className="col-12 col-sm-4 ">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Required file.xyz"
                            />
                            <i className="fas fa-circle-xmark d-flex justify-content-end close-icon " />
                          </div>
                          <div className="col-12 col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Required file.xyz"
                            />
                            <i className="fas fa-circle-xmark d-flex justify-content-end close-icon " />
                          </div>
                          <div className="col-12 col-sm-4 ">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Required file.xyz"
                            />
                            <i className="fas fa-circle-xmark d-flex justify-content-end close-icon " />
                          </div>
                        </div>
                      </div>
                     <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-end">
                        <button
                            type="cancel"
                            className="px-4 py-2 add-button ms-1"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 add-button ms-1"
                          >
                            Submit
                          </button>
                        </div>
                       </div> 
                      </div>
                      <div className="col-md-auto mt-4 help-desk-right-border">
                      <div className="row ">
                      <div className="col-12 "/>
                      
                      </div>
                      </div>
                      <div className="col-lg-3 col-12">
                        <div className="row mt-5">
                        <div className="col-9  mx-auto">
                          <label className="form-label raise-ticket-label d-flex justify-content-center">
                            Status
                          </label>
                          <div className="status-placeholder">
                            <input
                              type="text"
                              className="form-control"
                              placeholder=" Drafting Query"
                              disabled
                              readOnly
                            />
                          </div>
                        </div> 
                          </div>
                          <div className="row">
                        <div className="col-11 mt-md-4 mx-auto">
                          <label className="form-label raise-ticket-label d-flex justify-content-center">
                            HR Resolution
                          </label>
                          <div className="status-placeholder">
                            <textarea
                              type="text"
                              className="form-control"
                              placeholder=""
                              rows={11}
                              disabled
                              readOnly
                              value="here come the Brief information about the task done"
                            />
                          </div>
                        </div> 

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
    </>
  );
};

export default UpdateTicket;
