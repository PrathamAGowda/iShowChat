const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
	{
		groupName: String,
		description: String,
		chatType: {
			type: String,
			enum: ["DM", "group"],
			required: true,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		groupAvatar: { type: Schema.Types.ObjectId, ref: "Image" },
		lastMessage: {
			type: Schema.Types.ObjectId,
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
