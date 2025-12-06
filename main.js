import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./config/connectDb.js";
import { addUser, getUser } from "./db.js";
import mongoose from "mongoose";

let whitelist = ["http://localhost:5173", "https://rocketmike12.github.io"];

const corsOpts = {
	origin: function (origin, callback) {
		if (whitelist.includes(origin)) {
			callback(null, true);
		} else {
			// callback(new Error("Not allowed by CORS"));
			callback(null, false);
		}
	},
	credentials: true
};

const cookieOpts =
	process.env.NODE_ENV === "dev" ? { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true } : { maxAge: 1000 * 60 * 60 * 24 * 2, httpOnly: true, sameSite: "none", secure: true, partitioned: true };

const app = express();

app.use(cors(corsOpts));
app.use(express.json());
app.use(cookieParser());

connectDb();

const authenticateToken = function (req, res, next) {
	const authCookie = req.cookies["authcookie"];

	if (authCookie == null) return res.sendStatus(401);

	jwt.verify(authCookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(403).send("403 access denied");

		req.user = user;
		next();
	});
};

app.post("/api/v0/auth/login/", async (req, res) => {
	const { username, password } = req.body;

	try {
		let userData = await getUser(username, password);

		if (!userData) throw new Error(userData);

		const token = jwt.sign(userData.username, process.env.ACCESS_TOKEN_SECRET);
		res.cookie("authcookie", token, { maxAge: 900000, httpOnly: true });

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

		const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
		res.cookie("authcookie", token, cookieOpts);

		return res.status(200).json(userData);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		return res.status(500).send(`user ${username} not created: ${err.message}`);
	}
});

app.post("/api/v0/auth/session/", authenticateToken, (req, res) => {
	res.set("Content-Type", "text/plain");

	const token = jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET);
	res.cookie("authcookie", token, cookieOpts);

	return res.status(200).json(req.user);
});

app.post("/api/v0/auth/logout/", (req, res) => {
	res.set("Content-Type", "text/plain");

	res.clearCookie("authcookie");

	res.status(200).send("ok");
});

mongoose.connection.once("open", () => {
	app.listen(8080, () => {
		console.log("SRV: server is running on :8080");
	});
});
