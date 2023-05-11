import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Autosuggest from 'react-autosuggest';
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

  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [email3, setEmail3] = useState('');
  const getMentor = async () => {
    try {
      let res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/additional/mail`, {
        params: {
          emp_id: getuserDetails().empId,
        },
      });
      if (res.status == 200) {
        setEmail1(res.data[0].mentor1_email);
        setEmail2(res.data[0].mentor2_email);
        setEmail3(res.data[0].mentor3_email);
      }
    } catch (error) {
      msg("error", "error", "Something went wrong")
    }
  }
  const [suggestions, setSuggestions] = useState([]);
  
  const getAllMail = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/get/all/mail`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const getSuggestions = async (value) => {
    const allMails = await getAllMail();
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : allMails.filter(
          (email) =>
            email.toLowerCase().startsWith(inputValue) &&
            email !== email1 &&
            email !== email2 &&
            email !== email3 
            
        );
  }; 
  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await getSuggestions(value);
    setSuggestions(suggestions);
  };
  
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  
  const onChange = (e, { newValue }) => {
    setEmail1(newValue);
  };
  
  const onChange2 = (e, { newValue }) => {
    setEmail2(newValue);
  };
  
  const onChange3 = (e, { newValue }) => {
    setEmail3(newValue);
  };
  
  const renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  };
  
  useEffect(() => {
    getMentor();
    getAllMail();
  }, []);

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
  setLoader(true);

  const allMails = await getAllMail(); // Call the getAllMail function

  let emailErrors = [];
  let hasError = false;

  // Check if the email1 field is valid
  if (!email1) {
    emailErrors.push("Mentor 1 field is mandatory");
    hasError = true;
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email1)) {
    emailErrors.push("Please enter a valid email address for mentor 1");
    hasError = true;
  } else if (!allMails.includes(email1)) { // Check if the email1 field is already present in the API
    emailErrors.push("Please enter a valid email address for mentor 1");
    hasError = true;
  }

  // Check if the email2 field is valid
  if (email2) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email2)) {
      emailErrors.push("Please enter a valid email address for mentor 2");
      hasError = true;
    } else if (!allMails.includes(email2)) { 
      emailErrors.push("Please enter a valid email address for mentor 2");
      hasError = true;
    }
  }

  // Check if the email3 field is valid
  if (email3) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email3)) {
      emailErrors.push("Please enter a valid email address for mentor 3");
      hasError = true;
    } else if (!allMails.includes(email3)) { 
      emailErrors.push("Please enter a valid email address for mentor 3");
      hasError = true;
    }
  }

  if (hasError) {
    setLoader(false);
    if (emailErrors.length > 0) {
      for (let i = 0; i < emailErrors.length; i++) {
        msg("warning", "warning", emailErrors[i]);
        break;
      }
    }
  } else {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/additional/mail`, {
        emp_id: getuserDetails().empId,
        email1: email1,
        email2: email2,
        email3: email3,
        updated_at: todayDate()
      });
      if (res.status == 200) {
        setLoader(false);
        console.log("mentor1", email1);
        msg("success", "success", "Configuration done successfully");
      } else {
        setLoader(false);
        msg("error", "error", "Something went wrong");
      }
    } catch (err) {
      setLoader(false);
      msg("error", "error", "Something went wrong");
    }
  }
};


  return (
    <>
      {loader ? <div className="loadingPopup"></div> : null}
      <div className="fixed-left">
        <div id="wrapper">
          {/* <Sidebar /> */}
          <div className="content-page">
            <div className="content content-top">
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
                            <div className="col-sm-6 col-12 d-flex px-0" style={{ position: "relative" }}>
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                onSuggestionSelected={(suggestionValue)=>suggestionValue}
                                getSuggestionValue={(suggestion) => suggestion}
                                renderSuggestion={renderSuggestion}
                                inputProps={{
                                  placeholder: 'Email',
                                  type: 'email',
                                  className: 'form-control',
                                  id: 'inputEmail',
                                  value: email1,
                                  onChange: onChange,
                                  name: 'email',
                                  required: true,
                                  style: { width: '585px' } 
                                }}
                              />

                              <i className="fas fa-pen icon"></i>
                            </div>
                          </div>
                          <div className="row col-12 mx-0 px-0 mb-3 align-items-center justify-content-center mentor-id">
                            <label htmlFor="inputEmail" className="col-auto form-label mb-0">
                              Mentor2 E-mail Id
                            </label>
                            <div className="col-4 d-flex px-0" style={{ position: "relative" }}>
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                onSuggestionSelected={(suggestionValue)=>suggestionValue}
                                getSuggestionValue={(suggestion) => suggestion}
                                renderSuggestion={renderSuggestion}
                                inputProps={{
                                  placeholder: 'Email',
                                  type: 'email',
                                  className: 'form-control',
                                  id: 'inputEmail',
                                  value: email2,
                                  onChange: onChange2,
                                  name: 'email',
                                  required: true,
                                  style: { width: '390px' } 
                                }}

                              />
                              <i className="fas fa-pen icon"></i>
                            </div>
                          </div>
                          <div className="row col-12 mx-0 px-0 mb-3 align-items-center justify-content-center mentor-id">
                            <label htmlFor="inputEmail" className="col-auto form-label mb-0 px-4">
                              Other E-mail Id
                            </label>
                            <div className="col-4 d-flex px-0" style={{ position: "relative" }}>
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                onSuggestionSelected={(suggestionValue)=>suggestionValue}
                                getSuggestionValue={(suggestion) => suggestion}
                                renderSuggestion={renderSuggestion}
                                inputProps={{
                                  placeholder: 'Email',
                                  type: 'email',
                                  className: 'form-control',
                                  id: 'inputEmail',
                                  value: email3,
                                  onChange: onChange3,
                                  name: 'email',
                                  required: true,
                                  style: { width: '390px' } 
                                }}

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
