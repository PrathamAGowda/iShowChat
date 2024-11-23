const User = require("../models/user.model");
const Image = require("../models/image.model");
const Group = require("../models/group.model");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const createGroup = catchAsyncError(async (req, res, next) => {
	try {
		const { username } = req.user;
		const { groupName } = req.body;

		const groupExists = await Group.findOne({ groupName });

		if (groupExists) {
			return next(new ErrorHandler("Group Name Exists!", 400));
		}

		const groupData = req.body;
		let group = new Group(groupData);
		group._id = new mongoose.Types.ObjectId();

		const user = await User.findOneAndUpdate(
			{ username },
			{ $push: { groups: group._id } }
		);

		group
			.save()
			.then(async (result) => {
				await Group.findOneAndUpdate(
					{ groupName },
					{ $push: { members: user._id } }
				);

				res.json({
					status: true,
					send: groupData,
				});
			})
			.catch((error) => {
				res.json({
					status: false,
					message: `Group Creation Failed! ${error.message}`,
				});
			});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const findUser = catchAsyncError(async (req, res, next) => {
	try {
		const username = req.query.username;
		const user = await User.findOne({ username })
			.select("username avatar")
			.populate("avatar", "image -_id");
		if (user) {
			res.json({
				status: true,
				username: user.username,
				avatar: user.avatar.image,
				id: user._id,
			});
		} else {
			res.json({
				status: false,
				message: "User Not Found!",
			});
		}
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const addMembers = catchAsyncError(async (req, res, next) => {
	try {
		// add group to user doc
		const groupName = req.params["group"];
		const { members } = req.body;
		const group = await Group.findOneAndUpdate(
			{ groupName },
			{ $push: { members: { $each: [...members] } } }
		);
		for (const member of members) {
			await User.findOneAndUpdate(
				{ _id: member },
				{ $push: { groups: group._id } }
			);
		}

		res.json({
			status: true,
			message: "Successfully Added New Members",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const getGroupDetails = catchAsyncError(async (req, res, next) => {
	try {
		const groupName = req.params["group"];
		const group = await Group.findOne({ groupName });
		const memberList = await group.getGroupDetails();

		res.json({
			status: true,
			groupName: group.groupName,
			description: group.description,
			members: memberList,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

const updateAvatar = catchAsyncError(async (req, res, next) => {
	try {
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
		const groupName = req.params["group"];

		const group = await Group.findOne({ groupName }).select("avatar");
		if (group) {
			await Image.deleteOne({ _id: group.avatar });
		}
		const base64Image = req.file.buffer.toString("base64");
		const avatar = await Image.create({
			name: req.file.originalname,
			image: base64Image,
		});
		await Group.findOneAndUpdate({ groupName }, { avatar: avatar._id });

		res.json({
			status: true,
			message: "Avatar Updated Successfully",
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

module.exports = {
	createGroup,
	updateAvatar,
	findUser,
	addMembers,
	getGroupDetails,
};
