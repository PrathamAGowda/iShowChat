const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mongoose = require("mongoose");
const db = "mongodb://localhost/users";
mongoose.connect(db);

router.get("/", (req, res) => {
	res.send("From API router");
});

router.post("/register", (req, res) => {
	User.find({ email: req.body.email })
		.then((result) => {
			console.log(result.length);
			if (result.length !== 0) {
				res.json({
					message: "Email exists!",
					status: false,
				});
			} else {
				let userData = req.body;
				let user = new User(userData);
				user._id = new mongoose.Types.ObjectId();
				console.log(user);
				user.save()
					.then((result) => {
						res.json({
							message: "User Registered!",
							status: true,
							send: userData,
						});
					})
					.catch((error) => {
						res.json({
							message: `User Registration Failed! ${error}`,
							status: false,
						});
					});
			}
		})
		.catch((error) => {
			res.json({
				message: `User Registration Failed! ${error}`,
				status: false,
			});
		});
});

module.exports = router;
