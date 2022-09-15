const express = require("express");
const router = express.Router();
const { login, sendEmailForgot, forgotPassword } = require("../controller/authController");

router.post("/login", login);
router.post("/send/email", sendEmailForgot)
router.patch("/forgot/password", forgotPassword);

module.exports = router;
