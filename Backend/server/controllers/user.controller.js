const User = require("../models/user.model");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const userRegistration = catchAsyncError(async (req, res, next) => {
	try {
		const { username, email } = req.body;
		if (!username || !email) {
			return next(
				new ErrorHandler("Please enter username and email", 400)
			);
		}

		const usernameExists = await User.findOne({ username });
		const emailExists = await User.findOne({ email });

		if (usernameExists || emailExists) {
			return next(new ErrorHandler("Username or Email Exists!", 400));
		}

		const userData = req.body;
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
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const userLogin = catchAsyncError(async (req, res, next) => {
	try {
		const { username, password } = req.body;
		console.log(username);
		const user = await User.findOne({ username }).select("+password");

		if (!user) {
			return next(new ErrorHandler("Invalid username or password", 400));
		}

		const verified = user.password === password;
		if (!verified) {
			return next(new ErrorHandler("Invalid username or password", 400));
		}
		await User.findOneAndUpdate({ username }, { isLoggedIn: true });
		const loggedUser = await User.findOne({ username });

		res.json({
			message: "User Verified",
			status: true,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const userLogout = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;
		await User.findOneAndUpdate({ username }, { isLoggedIn: false });

		res.json({
			message: "User Logged Out Successfully",
			status: true,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

module.exports = { userRegistration, userLogin, userLogout };
