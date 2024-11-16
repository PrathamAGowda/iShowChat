const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const userRegistration = require("../controllers/user.controller");
const userLogin = require("../controllers/user.controller");

router.get("/", (req, res) => {
	res.send("From API router");
});

// User Registration
router.post("/register", userRegistration);

//User Login
router.post("/login", userLogin);

module.exports = router;
