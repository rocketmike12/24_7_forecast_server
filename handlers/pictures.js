import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const picturesApi = axios.create({
	baseURL: "https://pixabay.com/api",
	params: { key: process.env.PIXABAY_KEY }
});

export const picturesHandler = async function (req, res) {
	try {
		const q = req.query;
		if (!q) return res.sendStatus(406);

		const { data } = await picturesApi.get("/", { params: q });

		res.status(200).json(data);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		console.error(`failed to get pictures: ${err.message}`);
		console.error(err);

		return res.sendStatus(err.status);
	}
};
