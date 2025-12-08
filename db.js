import bcrypt from "bcrypt";

import { User } from "./models/user.js";

export const getUser = function (username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ username: username }).exec();
			if (!user) throw new Error("login incorrect");

			const match = await bcrypt.compare(password, user.password);
			if (!match) throw new Error("login incorrect");

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

export const getFavorites = function (username) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ username: username }).exec();

			if (!user) throw new Error("login incorrect");

			resolve(user.favorites);
		} catch (err) {
			reject(err);
		}
	});
};

export const addUser = function (username, password) {
	return new Promise(async (resolve, reject) => {
		try {
			if (await User.findOne({ username: username }).exec()) throw new Error("user already exists");

			const hash = await bcrypt.hash(password, 8);

			const user = User.create({
				username: username,
				password: hash,
				favorites: []
			});

			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};

export const addFavorite = function (username, favorite) {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await User.findOne({ username: username }).exec();
			if (!user) throw new Error("login incorrect");
			if (user.favorites.includes(favorite)) throw new Error("favorite already exists");	

			await User.updateOne({ _id: user._id }, { $push: { favorites: favorite } });

			user = await User.findOne({ username: username }).exec();
			resolve(user);
		} catch (err) {
			reject(err);
		}
	});
};
