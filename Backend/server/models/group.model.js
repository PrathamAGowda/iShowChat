const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
	{
		groupName: {
			type: String,
			required: true,
		},
		description: String,
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

chatSchema.methods.getGroupDetails = async function () {
	try {
		await this.populate({
			path: "members",
			select: "username avatar -_id",
			populate: {
				path: "avatar",
				select: "image",
			},
		});

		const memberList = this.members.map((member) => ({
			...member.toObject(),
			avatar: member.avatar ? member.avatar.image : null,
		}));

		return memberList;
	} catch (error) {
		console.error("Error Retrieving Group Details!", error);
		throw error;
	}
};

module.exports = mongoose.model("Chat", chatSchema);
