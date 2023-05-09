import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../css/eod.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

const HrUpdateTicket = () => {
 //------------ Loader Code Start------------
 const [loader, setLoader] = useState(false)

 useEffect(() => {
   setLoader(true)
   setTimeout(() => {
     setLoader(false);
   }, 1500);
 }, []);

 //------------ Loader Code End ------------
  const handleCancel = () => {
    navigate("/tickets");
  };
  const defaultdate = new Date();

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
  const [ticketData, setTicketData] = useState({
    status: "",
    hr_resolution: "",
    hr_resolution_date: "",
    reqIdFromState: "",
  });
  const [allcategories, setAllCategories] = useState([]);
  const [allsubcategories, setAllSubCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [showFiles, setShowFiles] = useState(new Set());
  const [fileData, setFileData] = useState([]);

  const { state } = location;
  const { req_id: reqIdFromState, empName, phone, email } = state;

  const getTicketData = async () => {
    setLoader(true);
    try {
      setLoader(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/ticket/ticketDetails`,
        {
          params: {
            req_id: reqIdFromState,
          },
        }
      );

      if (res.status === 200) {
        setLoader(false);
        const ticketData = res.data.finalres;
        const catId = ticketData?.cat_id;
        setTicketData(ticketData);
        if (res.data.images && Array.isArray(res.data.images)) {
          const images = res.data.images.map((image) => ({
            name: image.imagename,
            url: image.image,
            id: image.image_id,
          }));
          setFileData((prevState) => [...prevState, ...images]);
          images.forEach((image) => {
            setShowFiles((prevState) => new Set(prevState.add(image.name)));
          });
        }
        if (res.data.files && Array.isArray(res.data.files)) {
          const newFiles = res.data.files.map((file) => ({
            name: file.filename,
            url: file.data,
            id: file.file_id,
          }));
          setFileData((prevState) => [...prevState, ...newFiles]);
          newFiles.forEach((file) => {
            setShowFiles((prevState) => new Set(prevState.add(file.name)));
          });
        }
        getSubCategories(catId);
        setLoader(false);
      } else {
        setTicketData([]);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  }
    const getData = (e) => {
    const { name, value } = e.target;
    setTicketData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    };
  const getCategories = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/categories`
      );

      if (res.status == 200) {
        setAllCategories(res.data);
        setLoader(false);
      } else {
        setAllCategories([]);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const getSubCategories = async (catId) => {
    setLoader(true);
   if (catId) {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/subcategories/?cat_id=${catId}`
      );
      if (res.status == 200) {
        setAllSubCategories(res.data);
        setLoader(false);
      } else {
        setAllSubCategories([]);
      }
    } else {
      setAllSubCategories([]);
    }
  };

  const updateHrTicket = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      if (ticketData.status && ticketData.hr_resolution) {
        console.log("status", ticketData.status);
        const res = await axios.patch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/hr/ticket/ticketDetails`,
          {
            status: ticketData.status,
            hr_resolution: ticketData.hr_resolution,
            hr_resolution_date: ticketData.hr_resolution_date,
            req_id: reqIdFromState,
          }
        );
        if (res.status === 200) {
          setLoader(false);
          Swal.fire({
            type: "success",
            icon: "success",
            title: "Ticket updated successfully",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
        } else {
          setLoader(false);
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Updation failed",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
        }
      } else {
        setLoader(false);
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please Enter all fields",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (id) => {
    const selectedFile = fileData.find((file) => file.id === id);
    setSelectedFile(selectedFile);
  };
  const [isEyeToggled, setIsEyeToggled] = useState(false);

  const handleEyeToggle = () => {
    setIsEyeToggled(!isEyeToggled);
  };

  useEffect(() => {
    getTicketData();
    getCategories();
  }, []);

  return (
    <>
    {loader ? <div className="loadingPopup"></div> : null}
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
                        Ticket{" "}
                        <span className="span-title">{reqIdFromState} </span>
                      </h3>
                    </div>
                    <div className="row col-12 mx-0 px-0 justify-content-center border-bottom pb-3">
                      <div className="col-12 col-sm-6 col-md-4 fs-5 d-flex align-items-center justify-content-center">
                        <i className="fas fa-user"></i>
                        <p className="name mb-0 ms-1">{empName}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 fs-5 mt-2 mt-sm-0 d-flex align-items-center justify-content-center">
                        <i className="fas fa-phone"></i>
                        <p className="phone mb-0 ms-1">
                          <span>+91</span>
                          {phone}
                        </p>
                      </div>
                      <div className="col-12 col-md-4 fs-5 d-flex align-items-center justify-content-center mt-2 mt-md-0">
                        <i className="fas fa-envelope"></i>
                        <p className="email mb-0 ms-1">{email}</p>
                      </div>
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
                                name="cat_id"
                                id="categoriesId"
                                className="form-select"
                                required
                                value={ticketData.cat_id}
                                readOnly
                                disabled
                              >
                                <option selected disabled>
                                  -- Select Categories --
                                </option>

                                {allcategories.map((data) => {
                                  return (
                                    <option
                                      key={data.cat_id}
                                      data-key={data.cat_id}
                                      value={data.cat_id}
                                    >
                                      {data.category_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6  ">
                            <label className="form-label raise-ticket-label">
                              Sub-Category List
                            </label>
                            <div id="input-color">
                              <select
                                name="sub_cat_id"
                                id="subcategoriesId"
                                className="form-select"
                                required
                                value={ticketData.sub_cat_id}
                                readOnly
                                disabled
                              >
                                <option value="-- Select SubCategories --">
                                  -- Select SubCategories--
                                </option>

                                {allsubcategories.map((data) => {
                                  return (
                                    <option
                                      key={data.sub_cat_id}
                                      data-key={data.sub_cat_id}
                                      value={data.sub_cat_id}
                                    >
                                      {data.sub_cat_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row ms-sm-5 ms-0   mt-3">
                          <label className="form-label col-12 raise-ticket-label">
                            Title
                          </label>
                          <div id="input-color" className="col-12 ">
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              name="title"
                              value={ticketData.title}
                              disabled
                              readOnly
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
                                name="description"
                                id="description"
                                className="form-control"
                                value={ticketData.description}
                                disabled
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3  ms-sm-5 ms-0">
                          <div className="col-12 ">
                            <label className="form-label raise-ticket-label">
                              Attach File:-
                            </label>
                            <div className="col-12  d-sm-flex ">
                              <ul>
                                {[...showFiles].map((fileName, index) => {
                                  const files = fileData.filter(
                                    (file) => file.name === fileName
                                  );
                                  return (
                                    <li
                                      key={index}
                                      style={{ display: "block" }}
                                    >
                                      <span>{fileName}</span>
                                      {files.map((file, fileIndex) => {
                                        if (fileIndex === 0) {
                                          return (
                                            <span key={file.id}>
                                              &nbsp;
                                              <i
                                                className={
                                                  selectedFile &&
                                                  selectedFile.id === file.id
                                                    ? isEyeToggled
                                                      ? "fas fa-eye"
                                                      : "fas fa-eye-slash"
                                                    : "fas fa-eye"
                                                }
                                                onClick={() => {
                                                  handleFileSelect(file.id);
                                                  handleEyeToggle();
                                                }}
                                                title={file.name}
                                              ></i>
                                              &nbsp;&nbsp;
                                              <a
                                                href={file.url}
                                                download={file.name}
                                              >
                                                <i
                                                  className="fas fa-download"
                                                  style={{ color: "black" }}
                                                ></i>
                                              </a>
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                    </li>
                                  );
                                })}
                              </ul>

                              {/* Modal to display selected file */}

                              <Modal
                                show={selectedFile !== null}
                                onHide={() => setSelectedFile(null)}
                                size="xl"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    {selectedFile && selectedFile.name}
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  {selectedFile !== null &&
                                    (selectedFile.url.endsWith(".jpg") ||
                                    selectedFile.url.endsWith(".jpeg") ||
                                    selectedFile.url.endsWith(".png") ? (
                                      <div
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "calc(100vh - 200px)",
                                          overflow: "auto",
                                        }}
                                      >
                                        <img
                                          src={selectedFile.url}
                                          alt=""
                                          style={{
                                            height: "auto",
                                            width: "100%",
                                          }}
                                        />
                                        <a
                                          href={selectedFile.url}
                                          download={selectedFile.name}
                                          className="float-right"
                                        >
                                          <i className="fas fa-download text-secondary"></i>
                                        </a>
                                      </div>
                                    ) : (
                                      <div>
                                        <embed
                                          src={selectedFile.url}
                                          type="application/pdf"
                                          style={{
                                            height: "500px",
                                            width: "100%",
                                          }}
                                        />
                                        <a
                                          href={selectedFile.url}
                                          download={selectedFile.name}
                                          className="float-right"
                                        >
                                          <i
                                            className="fas fa-download text-secondary"
                                            style={{
                                              display: "flex",
                                              order: -1,
                                              color: "gray",
                                              marginLeft: "1080px",
                                            }}
                                          ></i>
                                        </a>
                                      </div>
                                    ))}
                                </Modal.Body>
                              </Modal>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col-12 d-flex justify-content-end">
                            <button
                              type="submit"
                              className="px-4 py-2 add-button ms-1"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 add-button ms-1"
                              onClick={(e) => {
                                updateHrTicket(e);
                              }}
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
                            <select
                              name="status"
                              value={ticketData.status}
                              onChange={getData}
                              id="Project"
                              className="form-select"
                              required
                              placeholder="Select Status"
                            >
                              <option value="open">Open</option>
                              <option value="work in progress">Work In Progress</option>
                              <option value="on hold">On Hold</option>
                              <option value="completed">Completed</option>
                            </select>
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
                                name="hr_resolution"
                                value={ticketData.hr_resolution}
                                // defaultValue="here come the Brief information about the task done"
                                onChange={getData}
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

export default HrUpdateTicket;
