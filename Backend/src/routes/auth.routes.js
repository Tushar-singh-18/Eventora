const express = require('express');
const router = express.Router();
const {registerUser, loginUser, loginDemoAdmin, verifyOTP} = require("../controllers/auth.controllers")

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo-admin', loginDemoAdmin);
router.post('/verify-otp', verifyOTP);

module.exports = router; 