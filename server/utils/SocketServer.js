const socketIO = require("socket.io");
const Message = require("../models/message.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const ErrorHandler = require("./ErrorHandler");

class SocketServer {
	constructor(httpServer) {
		this.io = socketIO(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.io.use(async (socket, next) => {
			const username = socket.handshake.auth.username;

			try {
				const user = await User.findOne({ username, isLoggedIn: true });
				if (!user) {
					return next(new ErrorHandler("Authentication error"));
				}
				socket.user = user;
				next();
			} catch (error) {
				next(new ErrorHandler("Authentication error"));
			}
		});

		this.io.on("connection", (socket) => {
			console.log(`User ${socket.user.username} connected`);

			socket.on("join", (groupName) => {
				socket.join(groupName);
			});

			socket.on("send-message", async (messageData) => {
				try {
					const { groupName, content } = messageData;

					// Validate group membership
					const group = await Group.findOne({ groupName });
					if (!group || !group.members.includes(socket.user._id)) {
						return socket.emit(
							"message-error",
							"Not authorized to send message"
						);
					}

					const message = new Message({
						sender: socket.user._id,
						content: content,
						group: group._id,
					});

					await message.save();

					await Group.findByIdAndUpdate(group._id, {
						$push: { messages: message._id },
					});

					// Broadcast to group
					this.io.to(group.groupName).emit("new-message", {
						messageId: message._id,
						sender: socket.user.username,
						content: message.content,
						createdAt: message.createdAt,
					});
				} catch (error) {
					socket.emit("message-error", error.message);
				}
			});

			socket.on("load-messages", async (groupName) => {
				try {
					const group = await Group.findOne({ groupName }).populate({
						path: "messages",
						populate: {
							path: "sender",
							select: "username",
						},
						options: {
							sort: { createdAt: -1 },
							limit: 50,
						},
					});

					if (!group || !group.members.includes(socket.user._id)) {
						return socket.emit(
							"message-error",
							"Not authorized to view messages"
						);
					}

					const messages = group.messages
						.map((msg) => ({
							messageId: msg._id,
							sender: msg.sender.username,
							content: msg.content,
							createdAt: msg.createdAt,
						}))
						.reverse();

					socket.emit("previous-messages", messages);
				} catch (error) {
					socket.emit("message-error", error.message);
				}
			});

			socket.on("leave", (groupName) => {
				socket.leave(groupName);
			});

			socket.on("disconnect", () => {
				console.log(`User ${socket.user.username} disconnected`);
			});
		});
	}
}

module.exports = SocketServer;
