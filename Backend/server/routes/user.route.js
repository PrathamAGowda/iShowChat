const express = require("express");
const router = express.Router();
const isAutheticated = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});
const {
	userRegistration,
	userLogin,
	userLogout,
	getUserProfile,
	updateUserProfile,
	updatePassword,
	updateAvatar,
} = require("../controllers/user.controller");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

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
/* Headers
{username: "username"}*/
router.get("/logout", isAutheticated, userLogout);

//Get User Details:
router.get("/profile", isAutheticated, getUserProfile);

//Update Details:
/* JSON
{
"username": String,
"email": String,
"dob": Date String (YYYY-MM-DD)
}*/
router.post("/update-details", isAutheticated, updateUserProfile);

//Update Password:
/* JSON
{
"username": String,
"password": String
}*/
router.post("/update-password", isAutheticated, updatePassword);

//Update Avatar:
/* JSON
{
"username": String,
"avatar": Image File (.png or .jpeg; <5MB)
}*/
router.post(
	"/update-avatar",
	isAutheticated,
	upload.single("avatar"),
	updateAvatar
);

module.exports = router;
