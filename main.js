import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./config/connectDb.js";
import { addUser, getUser } from "./db.js";
import mongoose from "mongoose";

connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());

function authenticateToken(req, res, next) {
	const authCookie = req.cookies["authcookie"];

	if (authCookie == null) return res.sendStatus(401);

	jwt.verify(authCookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send("403 access denied");

		req.user = user;
		next();
	});
}

app.post("/api/v0/auth/login/", async (req, res) => {
	const { username, password } = req.body;

	try {
		let userData = await getUser(username, password);

		if (!userData) throw new Error(userData);

		// const token = jwt.sign(userData.username, process.env.ACCESS_TOKEN_SECRET);

		// res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true });

		return res.status(200).json(userData);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		if (err.message === "login incorrect") {
			return res.status(401).send("401 unauthorized: login incorrect");
		}

		return res.status(500).send(`failed to get user: ${err.message}`);
	}
});

app.post("/api/v0/auth/register/", async (req, res) => {
	const { username, password } = req.body;

	try {
		const userData = await addUser(username, password);

		// const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);

		// res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true });

		return res.status(200).json(userData);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		return res.status(500).send(`user ${username} not created: ${err.message}`);
	}
});

// app.post("/api/v0/auth/confirm/", authenticateToken, (req, res, next) => {
// 	res.json(req.user);
// });

// app.delete("/api/v0/auth/delete/", async (req, res) => {
// 	res.set("Content-Type", "text/plain");
//
// 	const { username, password } = req.body;
//
// 	try {
// 		await delUser(db, username, password);
//
// 		return res.status(201).send(`user ${username} deleted successfully`);
// 	} catch (err) {
// 		if (err.message === "login incorrect") {
// 			return res.status(401).send(err.message);
// 		}
//
// 		return res.status(500).send(`user ${username} not deleted: ${err.message}`);
// 	}
// });

mongoose.connection.once("open", () => {
	app.listen(8080, () => {
		console.log("SRV: server is running on :8080");
	});
});
