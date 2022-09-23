const express = require("express");
const router = express.Router();
const { getProjectEmp, getTaskEmp, setEod, setTask, getTaskEmpDateRange, getAdditionalMail, updateAdditionalMail } = require("../controller/eodController");

router.get("/eod/projects", getProjectEmp)
router.post("/eod/task", setTask);
router.get("/eod/task", getTaskEmp)
router.post("/eod", setEod)
router.get("/eod/task/daterange", getTaskEmpDateRange)

router.get("/additional/mail", getAdditionalMail)
router.patch("/additional/mail", updateAdditionalMail)
module.exports = router;

