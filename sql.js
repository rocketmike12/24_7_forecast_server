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

const dbExec = async (db, sql, params = []) => {
	if (params && params.length > 0) {
		return new Promise((resolve, reject) => {
			db.run(sql, params, (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}

	return new Promise((resolve, reject) => {
		db.exec(sql, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

export const addUser = function (db, username, pass) {
	return new Promise((resolve, reject) => {
		db.run(`INSERT INTO users(username, pass) VALUES(?, ?)`, [username, pass], (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

export const getUser = function (db, username, pass) {
	return new Promise((resolve, reject) => {
		db.run(`SELECT * FROM users WHERE username = ? AND pass = ?`, [username, pass], (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
};

export const delUser = function (db, username) {
	return new Promise((resolve, reject) => {
		db.run(`DELETE FROM users WHERE username = ?`, [username], (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};
