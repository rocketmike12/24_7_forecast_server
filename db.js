import { User } from "./models/user.js";

export const addUser = function (username, password) {
	return new Promise((resolve, reject) => {
		try {
			const user = User.create({
				username: username,
				password: password
			});

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

export const getUser = function (username) {
	return new Promise((resolve, reject) => {
		try {
			const user = User.findOne({ username: username }).exec();

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};
