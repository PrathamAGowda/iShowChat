const mongoose = require("mongoose");
const dbUrl = "mongodb://localhost/iShowChat";

const connectDB = async () => {
	try {
		await mongoose.connect(dbUrl).then((data) => {
			console.log(`Database connected with ${data.connection.host}`);
		});
	} catch (error) {
		console.log(error.message);
		setTimeout(connectDB, 5000);
	}
};

module.exports = connectDB;
