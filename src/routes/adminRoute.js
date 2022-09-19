const express = require("express");
const router = express.Router();
const { getEmployees, getEmployeeById, updateEmployee, getEmpAttendancePresent, getEmpAttendanceAbsent, addEmployee } = require("../controller/adminController");


router.get("/employees", getEmployees)

router.get("/employee", getEmployeeById)

router.patch("/employee", updateEmployee)

router.get("/employee/attendance/present", getEmpAttendancePresent)

router.get("/employee/attendance/absent", getEmpAttendanceAbsent)

router.post("/employee", addEmployee)


module.exports = router;
