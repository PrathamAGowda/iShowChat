const User = require("../models/user.model");
const Image = require("../models/image.model");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const userRegistration = catchAsyncError(async (req, res, next) => {
	try {
		const { username, email } = req.body;
		Object.assign(req.body, { isLoggedIn: true });

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
					status: true,
					send: userData,
				});
			})
			.catch((error) => {
				res.json({
					status: false,
					message: `User Registration Failed! ${error}`,
				});
			});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const userLogin = catchAsyncError(async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username }).select("+password");

		if (!user) {
			return next(new ErrorHandler("Invalid username or password", 400));
		}

		const verified = user.password === password;
		if (!verified) {
			return next(new ErrorHandler("Invalid username or password", 400));
		}
		await User.findOneAndUpdate({ username }, { isLoggedIn: true });

		res.json({
			status: true,
			message: "User Verified",
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
			status: true,
			message: "User Logged Out Successfully",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const getUserProfile = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;
		const user = await User.findOne({ username }).populate({
			path: "groups",
			select: "groupName avatar -_id",
			populate: { path: "avatar", select: "image -_id" },
		});
		console.log(user.groups);
		res.json({
			status: true,
			username: user.username,
			email: user.email,
			dob: user.dob,
			avatar: user.avatar,
			groupList: user.groups,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const updateUserProfile = catchAsyncError(async (req, res, next) => {
	try {
		const { username, email, dob } = req.body;
		await User.findOneAndUpdate(
			{ username },
			{ username: username, email: email, dob: dob }
		);

		res.json({
			status: true,
			message: "User Details Updated Succesfully",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const updatePassword = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;
		const { password } = req.body;

		await User.findOneAndUpdate({ username }, { password: password });

		res.json({
			status: true,
			message: "User Password Updated Succesfully",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const updateAvatar = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;

		const allowedTypes = ["image/jpeg", "image/png"];
		if (!allowedTypes.includes(req.file.mimetype)) {
			return next(
				new ErrorHandler(
					"Invalid Filetype! (Accepted: .jpeg, .png)",
					400
				)
			);
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (req.file.size > maxSize) {
			return next(
				new ErrorHandler("Image Size Too Large! (Max Size <5MB)", 400)
			);
		}
		const user = await User.findOne({ username });
		if (user.avatar.toString() !== "673ca498fbe0b1209bbbda9b") {
			await Image.deleteOne({ _id: user.avatar });
		}

		const base64Image = req.file.buffer.toString("base64");
		const avatar = await Image.create({
			name: req.file.originalname,
			image: base64Image,
		});
		await User.findOneAndUpdate({ username }, { avatar: avatar._id });

		res.json({
			status: true,
			message: "Avatar Updated Successfully",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const findGroups = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;
		const query = req.query.group;
		const user = await User.findOne({ username });
		const groupList = await user.findGroupsByName(query);

		res.json({
			status: true,
			groups: groupList,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

module.exports = {
	userRegistration,
	userLogin,
	userLogout,
	getUserProfile,
	updateUserProfile,
	updatePassword,
	updateAvatar,
	findGroups,
};
