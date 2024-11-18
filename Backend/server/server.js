const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./utils/db");
const cors = require("cors");
const user = require("./routes/user.route");
const ErrorMiddleware = require("./middleware/error");
const PORT = 8000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", user);

app.all("*", (req, res, next) => {
	const err = new Error(`Route ${req.originalUrl} not found`);
	err.statusCode = 404;
	next(err);
});

app.use(ErrorMiddleware);

//create server
app.listen(PORT, () => {
	console.log(`Connected to PORT ${PORT}`);
	connectDB();
});
