import { React, useEffect, useState,useMemo } from "react";
import Edit_emp_details from "./Edit_emp_details";
import edit_emp from "./../../Image/EditIcon.svg";
import axios from "axios";
// import Header from "./AdminHeader";
// import Sidebar from "./AdminSidebar";
import "../../css/employee-list.css";
import DataTable from "react-data-table-component";
import styled from 'styled-components';


const Employee_list = () => {
  const [empData, setEmpData] = useState([]);
  const [showAllEmpData, setShowAllEmpData] = useState(true);
  const [showSingleEmpData, setShowSingleEmpData] = useState(false);
  const [empId, setEmpId] = useState("");
  const [filterText, setFilterText] = useState("");
 
  //------------ Loader Code Start------------
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
    setLoader(false);
  }, []);

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

  //------------ Loader Code End ------------
  // --------------------------Data Fetching -----------------------------------
const columns = [
  {
    name:<th scope="col" className="">Sr.No</th>,
    selector:(row) =><th scope="row">{row.emp_id}</th>,
    minWidth:"1rem"
  },
  {
    name:<th scope="col" className="">Emp Code</th>,
    selector:(row) =>row.emp_code,
    sortable:true,
  },
  {
    name:<th scope="col" className="">Name</th>,
    selector:(row) =>row.emp_fname + " " + row.emp_lname,
    sortable:true,
  },
  {
    name:<th scope="col" className="">Email</th>,
    selector:(row) =>row.email,
    minWidth:"18rem"
  },
  {
    name:<th scope="col" className="">Designation</th>,
    selector:(row) =>row.post,
  },
  {
    name:<th scope="col" className="">Status</th>,
    selector:(row) =><tr className="border-start">
    <td className="text-center">
    {row.status == "ACTIVE" ? (
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
  </tr>
  },
  {
    name:<th className="border-0"></th>,
    selector:(row) =><tr>
    <td className="border-0">
    <img src={edit_emp} alt="" width={20}  height={20} onClick={() => { editEmployee(row.emp_id);}}/>
    </td></tr>,
  },
]
//--------------------------Data Fetching -----------------------------------

 //------------------------Searching Data----------------------------------
 const customStyles ={
  pagination: {
    style: {
      color:'black',
      fontSize:'20px',
    },
  },   
  
};
 const TextField = styled.input`
 height: 32px;
 width: 200px;
 border-radius: 3px;
 border-top-left-radius: 5px;
 border-bottom-left-radius: 5px;
 border-top-right-radius: 0;
 border-bottom-right-radius: 0;
 border: 1px solid #e5e5e5;
 padding: 0 32px 0 16px;

 &:hover {
   cursor: pointer;
 }
`;
const Button = styled.button`
    width: 138px;
    height: 35px;
    text-align: center;
    letter-spacing: 0px;
    color: black;
    Font-weight:bold;
`;
const FilterComponent = ({ filterText, onFilter}) => (
  <div className="row mt-3">
   <div className="col ">
     {/* <button onClick={() => downloadCSV(empData)} class="export-button">Export</button> */}
     </div>
     <div className="col-auto">
    <input
      id="search"
      className="form-control"
      type="text"
      placeholder="Search by name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      autoFocus
    />
    </div>
    </div>
  
);
const filteredItems = empData.filter(
item => item.emp_fname.toLowerCase().includes(filterText.toLowerCase()) ||
        item.emp_lname.toLowerCase().includes(filterText.toLowerCase()),
);
const subHeaderComponentMemo = useMemo(() => {
  return (
    <FilterComponent onFilter={e => setFilterText(e.target.value)} filterText={filterText} />
  );
}, [filterText]);

 //------------------------Searching Data----------------------------------


 //------------------------Exporting  Data----------------------------------
function convertArrayOfObjectsToCSV(array) {
  	let result;
  
  	const columnDelimiter = ',';
  	const lineDelimiter = '\n';
  	const keys = Object.keys(empData[0]);
  
  	result = '';
  	result += keys.join(columnDelimiter);
  	result += lineDelimiter;
  
  	array.forEach(item => {
  		let ctr = 0;
  		keys.forEach(key => {
  			if (ctr > 0) result += columnDelimiter;
  
  			result += item[key];
  			
  			ctr++;
  		});
  		result += lineDelimiter;
  	});
  
  	return result;
  }
  
  
  function downloadCSV(array) {
   // alert(empData)
    //console.log(array)
  	const link = document.createElement('a');
  	let csv = convertArrayOfObjectsToCSV(array);
  	if (csv == null) return;
  
  	const filename = 'EmployeeData.csv';
  
  	if (!csv.match(/^empData:text\/csv/i)) {
  		csv = `data:text/csv;charset=utf-8,${csv}`;
  	}
  
  	link.setAttribute('href', encodeURI(csv));
  	link.setAttribute('download', filename);
  	link.click();
  }
  
 
   //const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;
   //const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(empData)} />, []);


 //------------------------Exporting  Data----------------------------------
 

  const handlesubmit = () => { };

  

  const SingleEmpData = () => {
    return (
      <>
        <Edit_emp_details empId={empId} />
      </>
    );
  };

  const editEmployee = (empId) => {
    setEmpId(empId);
    setShowAllEmpData(false);
    setShowSingleEmpData(true);
  };
    
  useEffect(() => {
    getEmpData();
  }, []);
     
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
                        <div className="page-title-box custm-paginator">
                          <div className="row col-12 mx-0 px-0 text-center border-bottom">
                            <h3 className="text-uppercase">EMPLOYEE'S LIST</h3>
                          </div>
                          <div>
                          <button onClick={() => downloadCSV(empData)} class="export-button">Export</button>
                          </div>
                          
                          <DataTable 
                            columns={columns} data={filteredItems}
                            pagination
                            fixedHeader
                            fixedHeaderScrollHeight="400px"
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}                          
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
