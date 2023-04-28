import React, { useState } from "react";
import pinimg from "../../Image/icon-pin.svg";
import "./../../css/eod.css";

const RaiseTicket = () => {
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
                    {/* </div> */}
                    <div className="col-sm-4 col-12  d-flex flex-sm-row flex-column   justify-content-center mt-sm-4 mt-3">
                      <h3 className="  raise-ticket-title  ">
                        Raise <span className="span-title">Ticket</span>
                      </h3>
                    </div>
                    <div className="col-sm-4 col-12  d-flex  flex-sm-row flex-column  justify-content-sm-end justify-content-center mb-xl-2 mb-2 mt-sm-4 mt-3">
                      <button
                        type="submit"
                        className="btn text-white add-button"
                      >
                        Raise Ticket
                      </button>
                    </div>
                  </div>
                  <div>
                    <form>
                      <div className="row mt-5 ms-sm-5 ms-0  ">
                        <div className="col-12 col-sm-4  ">
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
                        <div className="col-12 col-sm-4  ">
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
                        <div className="col-12 col-sm-3  ms-xl-5 ms-0">
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
                        </div>
                      </div>
                      <div className="row ms-sm-5 ms-0   mt-3">
                        <label className="form-label col-12 col-sm-8 raise-ticket-label">
                          Title
                        </label>
                        <div id="input-color" className="col-12 col-sm-8">
                          <input
                            type="text"
                            className="form-control"
                            id="input-color"
                            placeholder="Here comes the Title"
                          />
                        </div>
                      </div>

                      <div className="row mt-3  ms-sm-5 ms-0">
                        <div className="col-12 col-sm-8">
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
                        <div className="col-12 col-sm-6">
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
                        <div className="col-12 col-sm-6 d-sm-flex ">
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
                            type="submit"
                            className="btn text-white add-button"
                          >
                            Submit
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
    </>
  );
};

export default RaiseTicket;