const mongoose = require("mongoose");
const { populate } = require("./image.model");
const { Schema } = mongoose;
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "Enter your name"],
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Enter your email"],
		validate: {
			validator: (value) => {
				return emailRegexPattern.test(value);
			},
			message: "Enter a valid email!",
		},
		unique: true,
	},
	dob: { type: Date, required: true },
	password: {
		type: String,
		minlength: [6, "Password must be at least 6 characters"],
		select: false,
	},
	avatar: {
		type: Schema.Types.ObjectId,
		ref: "Image",
	},
	isLoggedIn: { type: Boolean, default: false },
	groups: [
		{
			type: Schema.Types.ObjectId,
			ref: "Chat",
		},
	],
});

userSchema.pre("save", async function (next) {
	this.avatar == null ? (this.avatar = "673ca498fbe0b1209bbbda9b") : null;
	next();
});

userSchema.methods.findGroupsByName = async function (substring) {
	try {
		await this.populate({
			path: "groups",
			match: {
				groupName: {
					$regex: `^${substring}`,
				},
			},
			select: "groupName avatar -_id",
			populate: {
				path: "avatar",
				select: "image",
			},
		});

		const groupList = this.groups.map((group) => ({
			...group.toObject(),
			avatar: group.avatar ? group.avatar.image : null,
		}));

		return groupList;
	} catch (error) {
		console.error("Error searching groups:", error);
		throw error;
	}
};

module.exports = mongoose.model("User", userSchema);
