import mongoose from "mongoose";

export const connectDb = async function () {
	try {
		await mongoose.connect(process.env.DATABASE_URI, {});
	} catch (err) {
		console.log(`DB ERR: ${err}`);
	}
};
