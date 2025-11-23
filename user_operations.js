import bcrypt from "bcrypt";

import { addUserSql, getUserSql, delUserSql } from "./sql.js";

export const addUser = function (db, username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const hash = await bcrypt.hash(password, 8);

			const res = await addUserSql(db, username, hash);

			resolve(res);
		} catch (err) {
			if (err.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username") {
				reject(new Error("user already exists"));
			}

			reject(err);
		}
	});
};

export const getUser = function (db, username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await getUserSql(db, username);

			const match = await bcrypt.compare(password, user.hash);
			if (!match) throw new Error("login incorrect");

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

export const delUser = function (db, username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await getUserSql(db, username);

			const match = await bcrypt.compare(password, user.hash);
			if (!match) throw new Error("login incorrect");

			try {
				await delUserSql(db, username);

				resolve("ok");
			} catch (err) {
				reject(new Error("login incorrect"));
			}
		} catch (err) {
			reject(err);
		}
	});
};
