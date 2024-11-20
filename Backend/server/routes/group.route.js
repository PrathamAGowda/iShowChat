const express = require("express");
const router = express.Router();
const isAutheticated = require("../middleware/auth");
const multer = require("multer");
const { createGroup } = require("../controllers/group.controller");
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});

router.get("/", (req, res) => {
	res.send("From group router");
});

//Create Group:
/* JSON
{
"groupName": String,
"chatType": "DM" / "group",
"description": String
} */
router.post("/create-group", isAutheticated, createGroup);

// router.post("/add-members", isAutheticated, addm);

// //Update Avatar:
// /* JSON
// {
// "groupName": String,
// "avatar": Image File (.png or .jpeg; <5MB)
// }*/
// router.post(
// 	"/update-avatar",
// 	isAutheticated,
// 	upload.single("avatar"),
// 	updateAvatar
// );
// /update-avatar
// /group-details
// /remove-members
// /update-details (name, description)
// /exit-group

module.exports = router;
