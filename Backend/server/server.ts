import { app } from "./app";
require("dotenv").config();

//create server
app.listen(process.env.PORT, () => {
	console.log(`Connected to PORT ${process.env.PORT}`)
})