const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
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
	findGroups,
} = require("../controllers/user.controller");

router.get("/", (req, res) => {
	res.send("From user router");
});

router.post("/register", userRegistration);
/* JSON
{
"username": String,
"email": String,
"dob": String (YYYY-MM-DD),
"password": String
} */

router.post("/login", userLogin);
/*JSON
{
"username": String,
"password": String
}*/

router.get("/logout", isAuthenticated, userLogout);
/* Headers
{username: "username"}*/

//Fetch user details
router.get("/profile", isAuthenticated, getUserProfile);

router.post("/update-details", isAuthenticated, updateUserProfile);
/* JSON
{
"username": String,
"email": String,
"dob": String (YYYY-MM-DD)
}*/

router.post("/update-password", isAuthenticated, updatePassword);
/* JSON
{
"username": String,
"password": String
}*/

router.post(
	"/update-avatar",
	isAuthenticated,
	upload.single("avatar"),
	updateAvatar
);
/* JSON
{
"username": String,
"avatar": Image File (.png or .jpeg; <5MB)
}*/

router.get("/find-groups", isAuthenticated, findGroups);
/* QUERY PARAM
...?group=groupName */

module.exports = router;
