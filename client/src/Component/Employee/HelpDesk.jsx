import React, { useState, useEffect } from "react";
// import "./../../css/history.css";
import "./../../css/history.scss";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import edit_emp from "./../../Image/EditIcon.svg";
import DataTable from "react-data-table-component";
import { useNavigate } from 'react-router-dom';

const HelpDesk = () => {
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
  const todayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  };
  const [ticketDate, setTicketDate] = useState(todayDate());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticket, setTicket] = useState([]);
  const navigate = useNavigate();
  const getTicketDetails = () => {
    let ticketData = JSON.parse(localStorage.getItem("userData"));
    return ticketData;
  };

  const fetchTicket = async () => {
    try {
      setLoader(true);
      if (ticketDate) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/ticket/date`,
          {
            params: {
              emp_id: getTicketDetails().empId,
              req_date: ticketDate,
            },
          }
        );
        if (Array.isArray(res.data)) {
          setTicket(res.data);
        } else {
          setTicket([]);
        }
        setLoader(false);
      } else {
        setLoader(false);
        Swal.fire({
          title: "Error",
          type: "error",
          icon: "error",
          text: "Select Date",
        }).then(() => setLoader(false), setTicket([]));
      }
    } catch (err) {
      setTicket([]);
      setLoader(false);
    }
  };
  const fetchTicketDateRange = async () => {
    try {
      setLoader(true);
      if (startDate && endDate && endDate > startDate) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/employee/ticket/daterange`,
          {
            params: {
              emp_id: getTicketDetails().empId,
              start_date: startDate,
              end_date: endDate,
            },
          }
        );
        if (Array.isArray(res.data)) {
          setTicket(res.data);
        } else {
          setTicket([]);
        }
        setLoader(false);
      } else {
        setLoader(false);
        Swal.fire({
          type: "error",
          icon: "error",
          title: "Please select valid date",
          confirmButtonText: "OK",
          confirmButtonColor: "#06bdff",
        });
      }
    } catch (err) {
      setTicket([]);
      setLoader(false);
    }
  };
  useEffect(() => {
    fetchTicket();
  }, [ticketDate]);

  const columns = [
    {
      name: <th scope="col">Sr.No</th>,
      selector: (row, index) => <th scope="row">{index + 1}</th>,
    },
    {
      name: <th scope="col">Date</th>,
      selector: (row) => (
        <tr>
          <td>{moment(row.req_date).format("DD-MM-YYYY")}</td>
        </tr>
      ),
    },
    {
      name: <th scope="col">Ticket No.</th>,
       selector: (row) => row.req_id,
    },
    {
      name: <th scope="col">Name</th>,
      selector: (row) => row.emp_fname + " " + row.emp_lname,
      sortable: true,
    },
    {
      name: <th scope="col">Emp Code</th>,
      selector: (row) => row.emp_code,
    },
    {
      name: <th scope="col">Category</th>,
      selector: (row) => row.category_name,
    },
    {
      name: <th scope="col">Sub-Category</th>,
      selector: (row) => row.sub_cat_name,
    },
    {
      name: <th scope="col">Title</th>,
      selector: (row) => row.title,
    },
    {
      name: <th scope="col">Status</th>,
      selector: (row) => row.status,
    },
    {
      name:<th className="border-0"></th>,
      selector:(row) =><tr>
      <td className="border-0">
      <img src={edit_emp} alt="" width={20}  height={20} 
       onClick={() => {navigate(`/update-ticket?req_id=${row.req_id}`);}}
      />
      </td></tr>,
    },
  ];
  const customStyles = {
    pagination: {
      style: {
        color: "black",
        fontSize: "20px",
      },
    },
  };
  const handleRaiseTicket = () => {
    navigate('/raise-ticket');
  };
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
                          <h3 className="text-uppercase">Tickets</h3>
                        </div>
                        <div className="col-sm-4 col-12  d-flex  flex-sm-row flex-column  justify-content-sm-end justify-content-center mb-xl-2 mb-2 mt-sm-4 mt-3">
                        <button
                          type="submit"
                          className="px-4 py-2 add-button ms-1"
                          onClick={handleRaiseTicket}
                        >
                          Raise Ticket
                        </button>
                    </div>
                    
                        <div className="mt-3 d-flex justify-content-end">
                          <nav
                            className="date-btn d-flex justify-content-between"
                            id="btn-top"
                          >
                            <div
                              className="nav nav-tabs"
                              id="nav-tab"
                              role="tablist"
                            >
                              <button
                                className="nav-link btn-1 active"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-home"
                                type="button"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                                onClick={() => {
                                  fetchTicket();
                                }}
                              >
                                Date
                              </button>
                              <button
                                className="nav-link btn-2"
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false"
                                // onClick={() => { setTasks([]); }}
                                onClick={() => {
                                  if (startDate && endDate) {
                                    fetchTicketDateRange();
                                  } else {
                                    setTicket([]);
                                    setStartDate("");
                                    setEndDate("");
                                  }
                                }}
                              >
                                Date Range
                              </button>
                            </div>
                          </nav>
                        </div>
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center">
                              <div className="col-10 col-sm-8 col-md-5 d-flex align-items-end">
                                <div className="col-10 me-2 date-1">
                                  <p className="date-report mb-0 text-white">
                                    End of Day Report Date
                                  </p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="req_date"
                                    className="form-control p-2"
                                    defaultValue={ticketDate}
                                    max={todayDate()}
                                    onChange={(e) =>
                                      setTicketDate(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                          >
                            <div className="row col-12 mx-0 px-0 my-3 text-center align-items-end">
                              <div className="col-12 col-sm-6 col-md-5 col-lg-4 d-flex">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">
                                    Starting Date
                                  </p>
                                  <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    className="form-control p-2"
                                    value={startDate}
                                    max={todayDate()}
                                    onChange={(e) =>
                                      setStartDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-sm-6 col-md-5 col-lg-4 mt-3 mt-sm-0 d-flex">
                                <div className="col-12 date-1">
                                  <p className="date-report mb-0 text-white">
                                    End Date
                                  </p>
                                  <input
                                    type="date"
                                    className="form-control p-2"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    max={todayDate()}
                                  />
                                </div>
                              </div>
                              <div className="col-2 mt-3 mt-md-0 d-flex justify-content-start">
                                <button
                                  type="submit"
                                  className="btn-search text-white"
                                  onClick={fetchTicketDateRange}
                                >
                                  Search
                                </button>
                              </div>
                            </div>
                          </div>
                          <div
                            className="table-responsive custm-paginator"
                            style={{ width: "100%" }}
                          >
                            <DataTable 
                              columns={columns} 
                              data={ticket}
                              pagination
                              fixedHeader
                              fixedHeaderScrollHeight="400px"
                              customStyles={customStyles}
                             />
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

export default HelpDesk;