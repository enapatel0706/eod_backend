const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path")


const { getCategory, getSubCategory, addTicket, getTicketById, updateTickets, updateHRTickets, getTicketByEmp, getTicketEmpDateRange, getTicketByDate, getTicketByDateRange } = require("../controller/ticketController");

const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
router.get("/ticket/categories", getCategory)
router.get("/ticket/subcategories", getSubCategory)
router.get("/employee/ticket/ticketDetaiils", getTicketById)
router.post('/ticket/addTicket', upload.array('attachments'), addTicket);
router.patch("/employee/ticket/ticketDetaiils", upload.array('attachments'), updateTickets)
router.patch("/ticket/hr/ticketDetails", upload.array('attachments'), updateHRTickets)
router.get("/employee/ticket/date", getTicketByEmp)
router.get("/employee/ticket/daterange", getTicketEmpDateRange)
router.get("/getallticket/date", getTicketByDate)
router.get("/getallticket/daterange", getTicketByDateRange)

module.exports = router;