import React, { useState, useRef, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import pinimg from "../../Image/icon-pin.svg";
import "./../../css/eod.css";
import axios from "axios";
import Swal from "sweetalert2";

const RaiseTicket = () => {
  const [loader, setLoader] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputField = useRef(null);
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedSubCat,setSelectedSubCat] = useState([])
  const [allcategories, setAllCategories] = useState([]);
  const [allsubcategories, setAllSubCategories] = useState([]);
 
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };
  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  const [ticketDate, setTicketDate] = useState(todayDate());

  //--------Select Category -------------------
  const [raiseTicketData, setRaiseTicketData] = useState({
    title: "",
    description: "",
  });

  const getInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setRaiseTicketData({ ...raiseTicketData, [name]: value });
  };
  const formData = new FormData();
  const getRaiseTicketData = async (e) => {
    e.preventDefault();
   
    if (
      selectedCat == "" ||
      selectedSubCat == "" ||
      raiseTicketData.title == "" ||
      raiseTicketData.description == "" ||
      files == ""
    ) {
      Swal.fire({
        type: "warning",
        icon: "warning",
        title: "Please enter all data",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
    } else {
      formData.append("emp_id",getuserDetails().empId)
      formData.append("cat_id",selectedCat)
      formData.append("sub_cat_id",selectedSubCat)
      formData.append("req_date",ticketDate);
      formData.append("title", raiseTicketData.title);
      formData.append("description", raiseTicketData.description);
      formData.append("status", "open");
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i])
      }

      for (const value of formData.values()) {
        console.log(value);
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/addTicket`,
          formData
        );
        if (res.status === 200) {
          setLoader(false);

          Swal.fire({
            icon: "success",
            title: "Ticket Added Successfully",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
          setRaiseTicketData({
            title: "",
            description: "",
          });
          setFiles([])
          setAllCategories([])
          setAllSubCategories([])
          getCategories()
        } else {
          setLoader(false);
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Data insertion failed",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  

  const getCategories = async () => {
    setLoader(false);
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
    setLoader(false);
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
  useEffect(() => {
    getCategories();
    //getRaiseTicketData();
  }, []);

  //-----------------File Upload----------------------

  // const handleClick=(e)=>{
  //   e.target.Value=''
  // }

  const uploadHandler = (e) => {
    //console.log(e.target.value)
  
    const file = e.target.files[0];
    //e.target.value=''
    //console.log(file)
    if (file?.size < 5 * 1024 * 1024) {
      
      setFiles(() => [...files, ...e.target.files]);
      console.log(e.target.files)
      console.log(file.name)
      //setFiles((prevFiles) => [...prevFiles, file]);
    } else {
      console.log("File is too large - maximum size is 8MB");
      Swal.fire({
        type: "warning",
        icon: "warning",
        title: "File size should not exceed 5MB",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
    }
    //setFiles(() => [...files, e.target.files[0]]);
      // setFiles(() => {
      //   return [...files, ...e.target.files];
      // }); 
  };

const navigate = useNavigate();
const [key, setKey] = useState(0);

const handleCancel = () => {
  navigate('/helpdesk');
};
const removeFile = (file) => {
  let newFiles = [...files]
  newFiles.splice(newFiles.indexOf(file),1)
  //alert(files.indexOf(file))
  setFiles(newFiles);
  setKey(key + 1);
}
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
                            Value={ticketDate}
                            readOnly
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
                      <button className="px-4 py-2 add-button ms-3">
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
                              name="categoriesId"
                              id="categories"
                              className="form-select"
                              required
                              placeholder="Category"
                              //value={selectedCat}
                              onChange={(e) => {
                                setSelectedCat(e.target.value);
                                getSubCategories(e.target.value);
                              }}
                            >
                              <option  selected disabled >
                                Select Categories
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
                        <div className="col-12 col-sm-4  ">
                          <label className="form-label raise-ticket-label">
                            Sub-Category List
                          </label>
                          <div id="input-color">
                            <select
                              name="subcategoriesId"
                              id="subcategories"
                              className="form-select"
                              //value={selectedSubCat}
                              onChange={(e) => {
                                setSelectedSubCat(e.target.value)
                              }}
                              required
                              placeholder="Sub-Category List"
                            >
                              <option>
                                Select subcategories
                              </option>
                              {allsubcategories.map((data) => {
                                return <option
                                    key={data.sub_cat_id}
                                    data-key={data.sub_cat_id}
                                    value={data.sub_cat_id}
                                    >{data.sub_cat_name}</option>;
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3  ms-xl-5 ms-0">
                          <label className="form-label raise-ticket-label">
                            Status
                          </label>
                          <div className="status-placeholder">
                            <input
                              type="text"
                              name="status"
                              className="form-control"
                              placeholder=" Drafting Query"
                              readOnly
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
                            name="title"
                            value={raiseTicketData.title}
                            onChange={getInput}
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
                              name="description"
                              value={raiseTicketData.description}
                              onChange={getInput}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3  ms-sm-5 ms-0">
                        <div className="col-12 col-sm-6">
                          <label className="form-label raise-ticket-label">
                            Attach File
                          </label>
                          <img style={{marginLeft:'15px'}}
                                    src={pinimg}
                                    onClick={() =>
                                      fileInputField.current.click()
                                    }
                                  ></img>
                          <p style={{fontSize:'12px',fontWeight:'bold'}}>
                          Note: <span style={{color:'red'}}>
                                (Only .jpg, .png, .jpeg, .pdf files are allowed)
                                </span></p>
                          <p style={{fontSize:'12px',marginTop:'-14px',marginLeft:'34px',fontWeight:'bold'}}>
                              <span style={{color:'red'}}>(Files size cannot be greater then 5MB)
                              </span></p>
                          <div id="input-color">
                          <input
                              id="input-file"
                              accept=".jpg,.pdf,.jpeg,.png"
                              className="d-none"
                              type="file"
                              name="files"
                              value={null}
                              multiple
                              ref={fileInputField}
                              key={key}
                              //onClick={handleClick}
                              onChange={uploadHandler}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4  ms-sm-5 ms-0">
                        <div className="col-12 col-sm-6 d-sm-flex ">
                          <ul>
                            {files.length > 0
                              ? files.map((file, index) => (
                                  <li key={file.name} >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <p>{file.name}</p>
                                      <i className="fas fa-times close-icon" onClick={() =>removeFile(file)}></i>
                                    </div>
                                  </li>
                                ))
                              : null}
                          </ul>
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
                            className="px-4 py-2 add-button ms-3"
                            onClick={getRaiseTicketData}
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
