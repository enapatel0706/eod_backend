const express = require("express");
const router = express.Router();
const { login, sendEmailForgot, forgotPassword, setpassexpire, getusertoken } = require("../controller/authController");

router.post("/login", login);
router.post("/send/email", sendEmailForgot)
router.patch("/forgot/password", forgotPassword);
router.post("/setuser/token", getusertoken)

module.exports = router;
