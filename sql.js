export const initDB = function (db) {
	db.exec(
		`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				username TEXT NOT NULL UNIQUE,
				pass TEXT NOT NULL
			)
		`,
		(err) => {
			if (err) {
				console.log("DB: error: " + err);
			} else {
				console.log("DB: CREATE TABLE users");
			}
		}
	);
};

export const addUserSql = function (db, username, pass) {
	return new Promise((resolve, reject) => {
		db.run(`INSERT INTO users(username, pass) VALUES(?, ?)`, [username, pass], (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

export const getUserSql = function (db, username, pass) {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM users WHERE username = ? AND pass = ?`, [username, pass], (err, row) => {
			if (err) reject(err);

			if (!row) reject(new Error("login incorrect"));

			resolve(row);
		});
	});
};

export const delUserSql = function (db, username, pass) {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM users WHERE username = ? AND pass = ?`, [username, pass], (err, row) => {
			if (err) reject(err);

			if (!row) reject(new Error("login incorrect"));

			db.run(`DELETE FROM users WHERE username = ? AND pass = ?`, [username, pass], (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	});
};
