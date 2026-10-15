const express = require('express');
const router = express.Router();
const {registerUser, loginUser, verifyOTP} = require("../controllers/auth.controllers")

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

module.exports = router; 