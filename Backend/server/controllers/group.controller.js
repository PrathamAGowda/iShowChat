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
					message: "Group Created",
					status: true,
					send: groupData,
				});
			})
			.catch((error) => {
				res.json({
					message: `Group Creation Failed! ${error.message}`,
					status: false,
				});
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

		const group = await Group.findOne({ groupName });
		await Image.deleteOne({ _id: group.avatar });

		const base64Image = req.file.buffer.toString("base64");
		const avatar = await Image.create({
			name: req.file.originalname,
			image: base64Image,
		});
		await Group.findOneAndUpdate({ groupName }, { avatar: avatar._id });

		res.json({
			message: "Avatar Updated Successfully",
			status: true,
		});
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

module.exports = { createGroup, updateAvatar };
