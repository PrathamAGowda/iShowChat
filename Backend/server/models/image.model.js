const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
	name: String,
	image: {
		type: String,
	},
});

module.exports = mongoose.model("Image", imageSchema);
