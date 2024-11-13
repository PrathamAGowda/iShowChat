const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const api = require("./routes/api");

const PORT = 8000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", api);

//create server
app.listen(PORT, () => {
	console.log(`Connected to PORT ${PORT}`);
});
