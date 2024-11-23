const { io } = require("socket.io-client");

async function connectGroup(username, groupName) {
	const socket = io("http://localhost:8000", {
		auth: {
			username: username,
		},
	});

	socket.on("connect", () => {
		console.log(`${username} Successfully Connected`);
		socket.emit("join", groupName);

		socket.emit("load-messages", groupName);

		console.log("Previous messages retrieved:");
		socket.on("previous-messages", (messages) => {
			console.log(messages);
		});

		socket.on("new-message", async (message) => {
			try {
				console.log(
					`New Message from ${message.sender}:\n${message.content}`
				);
			} catch (error) {
				console.error("Error Displaying New Message:", error);
			}
		});

		socket.on("message-error", (error) => {
			console.error("Socket message error:", error);
		});
	});

	socket.on("connect-error", (error) => {
		console.error("Connection Error:", error);
	});

	socket.on("disconnect", (reason) => {
		console.log("Disconnected:", reason);
	});
}

const sendMessage = async (username, groupName, message) => {
	const socket = io("http://localhost:8000", {
		auth: {
			username: username,
		},
	});

	socket.on("connect", () => {
		try {
			socket.emit("send-message", {
				groupName: groupName,
				content: message,
			});

			console.log("Message send test initiated");
		} catch (error) {
			console.error("Message send test failed:", error);
		}
	});
};

const loadMessage = async () => {
	const socket = io("http://localhost:8000", {
		auth: {
			username: username,
		},
	});

	socket.on("connect", () => {
		console.log(`${username} Successfully Connected`);
		socket.emit("join", groupName);

		socket.emit("load-messages", groupName);

		console.log("Previous messages retrieved:");
		socket.on("previous-messages", (messages) => {
			console.log(messages);
		});
	});
};

const disconnectGroup = async () => {};

module.exports = {
	connectGroup,
	sendMessage,
	loadMessage,
};
