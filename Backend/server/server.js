const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./utils/db");
const cors = require("cors");
const api = require("./routes/user.route");

const PORT = 8000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", api);

app.all("*", (req, res, next) => {
	const err = new Error(`Route ${req.originalUrl} not found`);
	err.statusCode = 404;
	next(err);
});

//create server
app.listen(PORT, () => {
	console.log(`Connected to PORT ${PORT}`);
	connectDB();
});
