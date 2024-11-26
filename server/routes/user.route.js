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
	findUser,
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

//User Logout
router.get("/logout", isAuthenticated, userLogout);

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
"avatar": Image File (.png or .jpeg; <5MB)
}*/

router.get("/find-user", isAuthenticated, findUser);
/* QUERY PARAM
...?username=username */

router.get("/find-groups", isAuthenticated, findGroups);
/* QUERY PARAM
...?group=groupName */

module.exports = router;
