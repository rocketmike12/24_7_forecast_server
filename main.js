import express from "express";
// import "cors";
import sqlite3 from "sqlite3";

import { initDB } from "./sql.js";
import { addUser, getUser, delUser } from "./user_operations.js";

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
	res.set("Content-Type", "text/plain");

	const username = req.params.username;
	const pass = req.params.pass;

	try {
		await addUser(db, username, pass);
		res.status(201).send(`user ${username} created successfully`);
	} catch (err) {
		res.status(406).send(`user ${username} not created: ${err.message}`);
	}
});

app.get("/api/v0/auth/login/:username/:pass/", async (req, res) => {
	const username = req.params.username;
	const pass = req.params.pass;

	try {
		let userData = await getUser(db, username, pass);
		res.status(200).json(userData);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		if (err.message === "login incorrect") {
			res.status(401).send(err.message);
		}

		res.status(500).send(`failed to get user: ${err}`);
	}
});


app.get("/api/v0/auth/delete/:username/:pass/", async (req, res) => {
	res.set("Content-Type", "text/plain");

	const username = req.params.username;
	const pass = req.params.pass;

	try {
		await delUser(db, username, pass);
		res.status(201).send(`user ${username} deleted successfully`);
	} catch (err) {
		res.status(406).send(`user ${username} not deleted: ${err.message}`);
	}
});

app.listen(8080, () => {
	console.log("server is running on port 8080");
});
