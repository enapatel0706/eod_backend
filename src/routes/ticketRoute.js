const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path")
const { getCategory, getSubCategory, addTicket, getTicketById, getTicketByEmp, getTicketEmpDateRange, getTicketByDate, getTicketByDateRange } = require("../controller/ticketController");

const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.get("/ticket/categories", getCategory)
router.get("/ticket/subcategories", getSubCategory)
router.get("/ticket/ticketDetaiils", getTicketById)
router.get("/employee/ticket", getTicketByEmp)
router.get("/employee/ticket/daterange", getTicketEmpDateRange)
router.get("/getallticket/date", getTicketByDate)
router.get("/getallticket/daterange", getTicketByDateRange)
router.post('/ticket/addTicket', upload.array('attachments'), addTicket);
module.exports = router;