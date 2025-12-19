import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const newsApi = axios.create({
	baseURL: "https://newsapi.org/v2/everything",
	params: { apiKey: process.env.NEWSAPI_KEY, sortBy: "publishedAt", language: "en", searchin: "title" }
});

export const newsHandler = async function (req, res) {
	try {
		const q = req.query;
		if (!q) return res.sendStatus(406);

		const { data } = await newsApi.get("/", { params: q });

		res.status(200).json(data);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		console.error(`failed to get news: ${err.message}`);
		console.error(err);

		return res.sendStatus(err.status);
	}
};
