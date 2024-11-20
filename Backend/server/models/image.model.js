const mongoose = require("mongoose");
const defaultProfile = require("../images/profile");
const { Schema } = mongoose;

const imageSchema = new Schema({
	name: String,
	image: {
		type: String, // Base64 string
		default: defaultProfile,
	},
});

module.exports = mongoose.model("Image", imageSchema);
