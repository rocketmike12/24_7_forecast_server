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

const whitelist = ["::ffff:127.0.0.1"];

function authenticateToken(req, res, next) {
	const authCookie = req.cookies["authcookie"];

	if (authCookie == null) return res.sendStatus(401);

	jwt.verify(authCookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send("403 access denied");

		req.user = user;
		next();
	});
}

// let db = new sqlite3.Database("db.sqlite3", (err) => {
// 	if (err) {
// 		console.error("DB: error: " + err);
// 	} else {
// 		console.log("DB: DB connected");
// 	}
// });

// app.post("/api/v0/auth/register/", async (req, res) => {
// 	res.set("Content-Type", "text/plain");
//
// 	// if (!whitelist.includes(req.ip)) return res.status(403).send("403 access denied");
//
// 	const { username, password } = req.body;
//
// 	try {
// 		await addUser(db, username, password);
//
// 		const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
//
// 		res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true });
// 		return res.status(200).send("ok");
// 	} catch (err) {
// 		return res.status(406).send(`user ${username} not created: ${err.message}`);
// 	}
// });
//
// app.post("/api/v0/auth/login/", async (req, res) => {
// 	const { username, password } = req.body;
//
// 	// if (!whitelist.includes(req.ip)) {
// 	// 	res.set("Content-Type", "text/plain");
// 	// 	return res.status(403).send("403 access denied");
// 	// }
//
// 	try {
// 		let userData = await getUser(db, username, password);
//
// 		const token = jwt.sign(userData.username, process.env.ACCESS_TOKEN_SECRET);
//
// 		res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true });
// 		return res.status(200).send("ok");
// 	} catch (err) {
// 		res.set("Content-Type", "text/plain");
//
// 		if (err.message === "login incorrect") {
// 			return res.status(401).send(err.message);
// 		}
//
// 		return res.status(500).send(`failed to get user: ${err}`);
// 	}
// });
//
// app.post("/api/v0/auth/confirm/", authenticateToken, (req, res, next) => {
// 	res.json(req.user);
// });
//
// app.delete("/api/v0/auth/delete/", async (req, res) => {
// 	res.set("Content-Type", "text/plain");
//
// 	// if (!whitelist.includes(req.ip)) return res.status(403).send("403 access denied");
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
		console.log("server is running on port 8080");
	});
});
