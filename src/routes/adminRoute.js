const express = require("express");
const router = express.Router();
const { getEmployees, getEmployeeById, getProject, getProjectByEmp, setEmpProject, updateEmpProject, updateEmployee, getEmpAttendance, getEmpAttendancePresent, getEmpAttendanceAbsent, getEODReport, getEODReportDateRange, getEODCompliance, getEODComplianceDateRange } = require("../controller/adminController");


router.get("/employees", getEmployees)

router.get("/employee", getEmployeeById)

router.get("/projects", getProject);

router.get("/employee/project", getProjectByEmp);

router.post("/employee/project", setEmpProject);

router.patch("/employee/project", updateEmpProject);

router.patch("/employee", updateEmployee)

router.get("/attendance", getEmpAttendance)

router.get("/attendance/present", getEmpAttendancePresent)

router.get("/attendance/absent", getEmpAttendanceAbsent)

router.get("/employee/eod", getEODReport)

router.get("/employee/eod/daterange", getEODReportDateRange)

router.get("/eod/compliance", getEODCompliance)

router.get("/eod/daterange", getEODComplianceDateRange)


module.exports = router;
