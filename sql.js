export const schema = function (db) {
	db.exec(
		`
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				username TEXT NOT NULL UNIQUE,
				hash TEXT NOT NULL
			)
		`,
		(err) => {
			if (err) {
				console.log("DB: error: " + err);
			} else {
				console.log("DB: schema");
			}
		}
	);
};

export const addUserSql = function (db, username, hash) {
	return new Promise((resolve, reject) => {
		db.run(`INSERT INTO users(username, hash) VALUES(?, ?)`, [username, hash], (err) => {
			if (err) reject(err);
			resolve("ok");
		});
	});
};

export const getUserSql = function (db, username) {
	return new Promise((resolve, reject) => {
		db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
			if (err) reject(err);

			if (!row) reject(new Error("login incorrect"));

			resolve(row);
		});
	});
};

export const delUserSql = function (db, username) {
	return new Promise((resolve, reject) => {
		db.run(`DELETE FROM users WHERE username = ?`, [username], (err) => {
			if (err) reject(err);
			resolve("ok");
		});
	});
};
