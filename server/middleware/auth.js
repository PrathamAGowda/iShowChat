const mongoose = require("mongoose");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const { error } = require("console");

// authenticated user
const isAuthenticated = catchAsyncError(async (req, res, next) => {
	const username = req.headers["username"];
	const user = await User.findOne({ username });
	if (!user || user.isLoggedIn === false) {
		return next(new ErrorHandler("Not Logged In!", 400));
	}

	const group = req.params["group"];
	if (group) {
		const inGroup = await user.findGroupsByName(group);
		if (!inGroup.length) {
			return next(new ErrorHandler("Not In Group!", 403));
		}
	}

	req.user = user;

	next();
});

module.exports = isAuthenticated;
