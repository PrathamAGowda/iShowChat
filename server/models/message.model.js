const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);
