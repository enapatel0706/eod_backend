const express = require("express");
const router = express.Router();
const { getEmployees, getEmployeeById, updateEmployee,
    getSkills, getSkillsByEmp, setEmpSkills, deleteEmpSkills,
    getProject, getProjectByEmp, setEmpProject, statusEmpProject, updateEmpProject,
    getEmpAttendance, getEmpAttendancePresent, getEmpAttendanceAbsent,
    getEODReportAll, getEODReportAllDateRange, getEODReport, getEODReportDateRange,
    getEODCompliance, getEODComplianceDateRange } = require("../controller/adminController");


router.get("/employees", getEmployees)

router.get("/employee", getEmployeeById)

router.patch("/employee", updateEmployee)

router.get("/skills", getSkills);

router.get("/employee/skills", getSkillsByEmp);

router.post("/employee/skill", setEmpSkills);

router.delete("/employee/skill", deleteEmpSkills);

router.get("/admin/projects", getProject);

router.get("/employee/project", getProjectByEmp);

router.post("/employee/project", setEmpProject);

router.patch("/employee/project", updateEmpProject);

router.patch("/employee/project/status", statusEmpProject);

router.get("/attendance", getEmpAttendance)

router.get("/attendance/present", getEmpAttendancePresent)

router.get("/attendance/absent", getEmpAttendanceAbsent)

router.get("/eod", getEODReportAll)

router.get("/eod/daterange", getEODReportAllDateRange)

router.get("/employee/eod", getEODReport)

router.get("/employee/eod/daterange", getEODReportDateRange)

router.get("/eod/compliance", getEODCompliance)

router.get("/eod/compliance/daterange", getEODComplianceDateRange)


module.exports = router;
