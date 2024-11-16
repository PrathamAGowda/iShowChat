const mongoose = require("mongoose");
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
});

module.exports = mongoose.model("user", userSchema);
