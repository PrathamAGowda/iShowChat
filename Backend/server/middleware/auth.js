const mongoose = require("mongoose");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");

// authenticated user
const isAutheticated = catchAsyncError(async (req, res, next) => {
	const username = req.headers["username"];
	const user = await User.findOne({ username });
	if (!user || user.isLoggedIn === false) {
		return next(new ErrorHandler("Not Logged In!", 400));
	}

	req.user = user;

	next();
});

module.exports = isAutheticated;
