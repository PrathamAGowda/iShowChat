const mongoose = require("mongoose");
const { Schema } = mongoose;

const auraSchema = new Schema(
	{
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
			index: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		lifeCycle: {
			type: Date,
			default: Date.now,
			expires: 60 * 60 * 24 * 7,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Aura", auraSchema);
