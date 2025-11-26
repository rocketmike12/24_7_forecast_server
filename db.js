import { User } from "./models/user.js";

export const addUser = function (db, username, hash) {
	return new Promise((resolve, reject) => {
		try {
			const user = User.create({
				username: username,
				password: hash
			});

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

export const getUser = function (db, username) {
	return new Promise((resolve, reject) => {
		try {
			const user = User.findOne({ username: username }).exec();

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};
