const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller.js")


router.post("/signup", authController.register)
router.post("/signin", authController.login)
router.post("/signin/getotp", authController.getOtp)
router.post("/signin/otpvalidation", authController.otpValidaton)

module.exports = router;