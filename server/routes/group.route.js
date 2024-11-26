const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});
const {
	createGroup,
	updateAvatar,
	findUser,
	addMembers,
	getGroupDetails,
} = require("../controllers/group.controller");

router.get("/:group", (req, res) => {
	res.send(`From ${req.params["group"]}`);
});

router.post("/create-group", isAuthenticated, createGroup);
/* JSON
{
"groupName": String,
"description": String
} */

router.post("/:group/add-members", isAuthenticated, addMembers);
/* JSON
{
"members: [...userIds]"
} */

router.post(
	"/:group/update-avatar",
	isAuthenticated,
	upload.single("avatar"),
	updateAvatar
);
/* JSON
{
"groupName": String,
"avatar": Image File (.png or .jpeg; <5MB)
}*/

//Fetch group details
router.get("/:group/group-details", isAuthenticated, getGroupDetails);

// /remove-members
// /update-details (name, description)
// /exit-group

module.exports = router;
