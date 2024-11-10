require("dotenv").config();
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app: Express = express();

//body parser
app.use(express.json({limit: "50mb"}));

//cookie parser
app.use(cookieParser());

//cors
app.use(cors({
	origin: process.env.ORIGIN
}));

//test api
app.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API Successful"
	})
})

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
})