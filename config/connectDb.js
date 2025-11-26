import mongoose from "mongoose";

export const connectDb = async function () {
	try {
		await mongoose.connect(process.env.DATABASE_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
	} catch (err) {
		console.log(`DB ERR: ${err}`)
	}
}

