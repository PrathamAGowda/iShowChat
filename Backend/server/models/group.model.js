const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
	{
		chatType: {
			type: String,
			enum: ["DM", "group"],
			required: true,
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		groupName: String,
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chat", chatSchema);
