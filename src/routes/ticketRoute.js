const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path")
const { getCategory, getSubCategory, addTicket, getTicketByEmp, getTicketEmpDateRange, getTicketByDate, getTicketByDateRange } = require("../controller/ticketController");

const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.get("/ticket/categories", getCategory)
router.get("/ticket/subcategories", getSubCategory)
// router.get("/ticket/ticketDetaiils", getTicketById)
router.get("/employee/ticket/date", getTicketByEmp)
router.get("/employee/ticket/daterange", getTicketEmpDateRange)
router.get("/hr/getallticket/date", getTicketByDate)
router.get("/hr/getallticket/daterange", getTicketByDateRange)
router.post('/employee/addTicket', upload.array('attachments'), addTicket);
module.exports = router;