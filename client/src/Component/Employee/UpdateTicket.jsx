import React, { useState ,useEffect,useRef} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import pinimg from "../../Image/icon-pin.svg";
import "./../../css/eod.css";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

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
  const [loader, setLoader] = useState(true);
  const [inputdate, setInputDate] = useState(todayDate());
  const navigate = useNavigate();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reqid =  queryParams.get("req_id") ;
 
  const id = queryParams.get("req_id");
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []); 
  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
  })
  const [allcategories, setAllCategories] = useState([]);
  const [allsubcategories, setAllSubCategories] = useState([]);
  const [ticketDate, setTicketDate] = useState(todayDate());
  const [showFiles, setShowFiles] = useState(new Set());
  const [fileData, setFileData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [files, setFiles] = useState([]);
  const fileInputField = useRef(null);
  
  let name, value;
  const getData = (e) => {
    name = e.target.name;
    value = e.target.value;
  //  console.log(ticketData.status)
  //  console.log(ticketData.hr_resolution)
  //  console.log(ticketData.title)
  //  console.log(ticketData.cat_id)
  //  console.log(ticketData.sub_cat_id)
    setTicketData({ ...ticketData, [name]: value });
   
  };


const getTicketData = async () =>{
  //e.preventDefault();
  setLoader(true);
    try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/ticket/ticketDetails`,
      {
        params: {
          req_id: id,
        },
      }
      );

    if (res.status == 200) {
      //setTicketData(res.data)
      setTicketData(res.data.finalres);
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
      
      getSubCategories(res.data.finalres.cat_id)
      console.log(res.data)
      setLoader(false);
    } else {
      setTicketData([]);
    }
  } catch (error) {
    setLoader(false);
    console.log(error);
  }
}
const [loading, setLoading] = useState(true);

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
  const getuserDetails = () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    return userData;
  };
  const formData = new FormData();
const updateRaiseTicket=async(e) =>{
  e.preventDefault();

    if (
      ticketData.cat_id == "" ||
      ticketData.sub_cat_id == "" ||
      ticketData.title == "" ||
      ticketData.description == "" 
    ) {
      Swal.fire({
        type: "warning",
        icon: "warning",
        title: "Please enter all data",
        confirmButtonText: "OK",
        confirmButtonColor: "#06bdff",
      });
    }else{
      formData.append("emp_id", getuserDetails().empId)
      formData.append("cat_id", ticketData.cat_id)
      formData.append("sub_cat_id", ticketData.sub_cat_id)
      formData.append("req_date", ticketDate);
      formData.append("title", ticketData.title);
      formData.append("description", ticketData.description);
      formData.append("status", ticketData.status);
      formData.append("hr_resolution", ticketData.hr_resolution);
      formData.append("req_id", reqid);
      //formData.append("id", id);
      for (let i = 0; i < fileData.length; i++) {
        formData.append('attachments', fileData[i])
      }
      for (let i = 0; i < fileData.length; i++) {
        formData.append('file', fileData[i].name)
      }
      for (const value of formData.values()) {
        console.log(value);
      }

      try {
        const res = await axios.patch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/ticket/ticketDetails`,formData,{
            params: {
              req_id: id,
            },
          }
        );
        if (res.status === 200) {
          setLoader(false);

          Swal.fire({
            icon: "success",
            title: "Ticket Updated Successfully",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
          setTicketData({
            title: "",
            description: "",
          });
          //setFiles([])
          setAllCategories([])
          setAllSubCategories([])
          getCategories()
        } else {
          setLoader(false);
          Swal.fire({
            type: "error",
            icon: "error",
            title: "Data Updation failed",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
}

  //-------------Set Files and Show Files ------------------------------
  const handleFileSelect = (id) => {
    console.log("Selected file ID:", id);
    const selectedFile = fileData.find((file) => file.id === id);
    setSelectedFile(selectedFile);
    console.log(selectedFile)
    //setIsEyeToggled(false);
  };
  const [isEyeToggled, setIsEyeToggled] = useState(false);

  const handleEyeToggle = () => {
    setIsEyeToggled(!isEyeToggled);
  };
  const handleFileRemove = (id) => {
    setFileData((prevFileData) =>
      prevFileData.filter((file) => file.id !== id)
    );
    setShowFiles((prevShowFiles) => {
      const newShowFiles = new Set(prevShowFiles);
      const fileName = fileData.find((file) => file.id === id)?.name;
      if (fileName) {
        newShowFiles.delete(fileName);
      }
      return newShowFiles;
    });
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };
   //-------------Set Files and Show Files ------------------------------
   const [key, setKey] = useState(0);
   const uploadHandler = (e) => {
    const files = e.target.files;
    const newFiles = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file?.size < 5 * 1024 * 1024) {
        if (!fileData.some((f) => f.name === file.name)) {
          newFiles.push(file);
        }else {
          Swal.fire({
            type: "warning",
            icon: "warning",
            title: "File is already selected",
            confirmButtonText: "OK",
            confirmButtonColor: "#06bdff",
          });
        }
      } else {
        Swal.fire({
          type: "warning",
          icon: "warning",
          title: "File size should not exceed 5MB",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
      console.log(file.name)
    }
  
    if (newFiles.length > 0) {
      const newShowFiles = new Set([...showFiles]);
      const newFileData = [...fileData];
  
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        newShowFiles.add(file.name);
        newFileData.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: URL.createObjectURL(file),
        });
      }
  
      setShowFiles(newShowFiles);
      setFileData(newFileData);
    }
  };
  //  const uploadHandler = (e) => {
  //   const files = e.target.files;
  //   const newFiles = [];
  
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if (file?.size < 5 * 1024 * 1024) {
  //       if (!fileData.some((f) => f.name === file.name)) {
  //         newFiles.push(file);
  //       }else {
  //         Swal.fire({
  //           type: "warning",
  //           icon: "warning",
  //           title: "File is already selected",
  //           confirmButtonText: "OK",
  //           confirmButtonColor: "#06bdff",
  //         });
  //       }
  //     } else {
  //       Swal.fire({
  //         type: "warning",
  //         icon: "warning",
  //         title: "File size should not exceed 5MB",
  //         confirmButtonText: "OK",
  //         confirmButtonColor: "#06bdff",
  //       });
  //     }
  //     console.log(file.name)
  //   }
  
  //   if (newFiles.length > 0) {
  //     const newShowFiles = new Set([...showFiles]);
  //     const newFileData = [...fileData];
  
  //     for (let i = 0; i < newFiles.length; i++) {
  //       const file = newFiles[i];
  //       newShowFiles.add(file.name);
  //       newFileData.push(file);
  //     }
  //     console.log(newShowFiles)
  //     console.log(newFileData)
  //     setShowFiles(newShowFiles);
  //     setFileData(newFileData);
      
  //   }
  // };
  //  const uploadHandler = (e) => {
  //   const file = e.target.files[0];
  //   if (file?.size < 5 * 1024 * 1024) {
  //     if (files.some((f) => f.name === file.name)) {

  //       Swal.fire({
  //         type: "warning",
  //         icon: "warning",
  //         title: "File is already selected",
  //         confirmButtonText: "OK",
  //         confirmButtonColor: "#06bdff",
  //       });
  //     } else {
  //       setFiles(() => [...files, ...e.target.files]);
  //        setShowFiles([...showFiles, file.name]);
  //     }
  //   } else {
  //     Swal.fire({
  //       type: "warning",
  //       icon: "warning",
  //       title: "File size should not exceed 5MB",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#06bdff",
  //     });
  //   }
  //   console.log(file.name)
  // };
  // const removeFile = (file) => {
  //   let newFiles = [...files]
  //   newFiles.splice(newFiles.indexOf(file), 1)
  //   //alert(files.indexOf(file))
  //   setFiles(newFiles);
  //   setKey(key + 1);
  // }
  const handleCancel = () => {
    navigate('/helpdesk');
  };
  const handleRaiseTicket = () => {
    navigate('/raise-ticket');
  };

useEffect(() =>{
  getTicketData()
  getCategories()
},[])
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
                          <div className="col-sm-4 col-12  d-flex flex-sm-row flex-column justify-content-center mt-sm-4 mt-3">
                            <h3 className="  raise-ticket-title  ">
                              Ticket<span className="span-title">{reqid} </span>
                            </h3>
                          </div>
                    <div className="col-sm-4 col-12  d-flex  flex-sm-row flex-column  justify-content-sm-end justify-content-center mb-xl-2 mb-2 mt-sm-4 mt-3">
                      <button
                        type="submit"
                        className="btn submit-data-btn"
                        onClick={handleRaiseTicket}
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
                              name="catId"
                              id="categoriesId"
                              className="form-select"
                              required
                              
                              value={ticketData.cat_id}
                              //defaultValue={ticketData.cat_id}
                              //onChange={getData}
                              onChange={(e) => {
                                  const { value } = e.target;
                                  setTicketData(prevState => ({
                                    ...prevState,
                                    cat_id: value
                                  }));
                                  getSubCategories(value);
                                }}
                              // onChange={(e) => {
                              //  // getData("cat_id",ticketData.cat_id)
                              //  setTicketData(e.target.value);
                                  
                              //   //getSubCategories(ticketData.cat_id)
                              //     getSubCategories(e.target.value);
                              //     //console.log(e.target.value)
                              // }}
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
                              })
                              }
                              
                            </select>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6  ">
                          <label className="form-label raise-ticket-label">
                            Sub-Category List
                          </label>
                          <div id="input-color">
                            <select
                              name="subCatId"
                              id="subcategoriesId"
                              className="form-select"
                              required
                              //placeholder="Sub-Category List"
                              value={ticketData.sub_cat_id}
                              //defaultValue={ticketData.sub_cat_id}
                             //onChange={getData}
                             onChange={(e) => {
                                  const { value } = e.target;
                                  setTicketData(prevState => ({
                                    ...prevState,
                                    sub_cat_id: value
                                  }));
                                  
                                }}
                              // onChange={(e) => {
                              //   setTicketData(e.target.value)
                              //   //console.log(e.target.value)
                              //   //getSubCategories(e.target.value)
                              // }}
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
                            onChange={getData}
                            //placeholder="Here comes the Title"
                            
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
                              //placeholder="Here comes the Brief information about the task done."
                              value={ticketData.description}
                             onChange={getData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3  ms-sm-5 ms-0">
                          <div className="col-12 ">
                            <label className="form-label raise-ticket-label">
                              Attach File:-
                            </label>
                            <img style={{ marginLeft: '15px' }}
                            src={pinimg}
                            onClick={() =>
                              fileInputField.current.click()
                            }
                          ></img>
                          <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            Note: <span style={{ color: 'red' }}>
                              (Only .jpg, .png, .jpeg, .pdf files are allowed)
                            </span></p>
                          <p style={{ fontSize: '12px', marginTop: '-14px', marginLeft: '34px', fontWeight: 'bold' }}>
                            <span style={{ color: 'red' }}>(Files size cannot be greater then 5MB)
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
                          <div className="row mt-4  ms-sm-5 ms-0">
                          <div className="col-12 col-sm-6 d-sm-flex ">
                          {/* <ul>
                            {files.length > 0
                              ? files.map((file, index) => (
                                <li key={file.name} >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p>{file.name}</p>
                                    <i className="fas fa-times close-icon" onClick={() => removeFile(file)}></i>
                                  </div>
                                </li>
                              ))
                              : null}
                          </ul> */}
                        </div>
                      </div>
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
                                              &nbsp;&nbsp;
                                                <i
                                                  className="fas fa-times"
                                                  onClick={() => handleFileRemove(file.id)}
                                                  title="Remove"
                                                ></i>
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
                                  {selectedFile !== null 
                                  &&
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
                            type="cancel"
                            className="px-4 py-2 add-button ms-1"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 add-button ms-1"
                            onClick={updateRaiseTicket}
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
                              value={ticketData.status}
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
                              placeholder="HR has not uploaded any resolution"
                              value={ticketData.hr_resolution}
                              rows={11}
                              disabled
                              readOnly
                              //value="here come the Brief information about the task done"
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
