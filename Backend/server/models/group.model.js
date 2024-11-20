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
		avatar: { type: Schema.Types.ObjectId, ref: "Image" },
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chat", chatSchema);
