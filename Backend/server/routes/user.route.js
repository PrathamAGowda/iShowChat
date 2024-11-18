const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const isAutheticated = require("../middleware/auth");
const {
	userRegistration,
	userLogin,
	userLogout,
} = require("../controllers/user.controller");

router.get("/", (req, res) => {
	res.send("From user router");
});

// User Registration:
/* JSON
{
"username": String,
"email": String,
"dob": Date String (YYYY-MM-DD),
"password": String
} */
router.post("/register", userRegistration);

//User Login:
/*JSON
{
"username": String,
"password": String
}*/
router.post("/login", userLogin);

//User Logout:
router.get("/logout", isAutheticated, userLogout);

// /my-profile
// /update-details
// /update-avatar
// /update-password

module.exports = router;
