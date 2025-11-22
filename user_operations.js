import { addUserSql, getUserSql, delUserSql } from "./sql.js";

export const addUser = function (db, username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await addUserSql(db, username, password);

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
			const res = await getUserSql(db, username, password);

			resolve(res);
		} catch (err) {
			reject(err);
		}
	});
};

export const delUser = function (db, username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await delUserSql(db, username, password);

			resolve(res);
		} catch (err) {
			if (err.message === "login incorrect") {
				reject(new Error("login incorrect"));
			}

			reject(err);
		}
	});
};
