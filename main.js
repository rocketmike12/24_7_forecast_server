import express from "express";
// import "cors";
import sqlite3 from "sqlite3";

import { initDB, addUser, getUser, delUser } from "./sql.js";

const app = express();

// const corsOpts = {
// 	origin: ["http://127.0.0.1:5173"]
// };
//
// app.use(cors(corsOpts));

let db = new sqlite3.Database("db.sqlite3", (err) => {
	if (err) {
		console.error("DB: error: " + err);
	} else {
		console.log("DB: DB connected");
	}
});

initDB(db);

app.get("/api/v0/", (req, res) => {
	res.json({ message: "hello", time: new Date(Date.now()).toLocaleTimeString("en-GB") });
});

app.get("/api/v0/auth/register/:username/:pass/", async (req, res) => {
	const username = req.params.username;
	const pass = req.params.pass;

	try {
		await addUser(db, username, pass);
		res.statusCode = 201;
		res.send(`user ${username} created successfully`);
	} catch (err) {
		res.statusCode = 406;
		res.send(`user ${username} not created:\n${err}`);
	}
});

app.get("/api/v0/auth/login/:username/:pass/", async (req, res) => {
	const username = req.params.username;
	const pass = req.params.pass;

	try {
		let userData = await getUser(db, username, pass);

		if (!userData) {
			res.status(401).send("login incorrect");
		} else {
			console.log(userData);

			res.status(500).send(`user data for ${username}:\n${userData}`);
		}
	} catch (err) {
		res.status(500).send(`failed to get user:\n${err}`);
	}
});

app.listen(8080, () => {
	console.log("server is running on port 8080");
});
