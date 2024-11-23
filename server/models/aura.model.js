const mongoose = require("mongoose");
const { Schema } = mongoose;

const auraSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
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
			expires: 60 * 60 * 24 * 7, // 7 days
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Aura", auraSchema);
