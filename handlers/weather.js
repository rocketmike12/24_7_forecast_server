import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const weatherApi = axios.create({
	baseURL: "https://api.openweathermap.org/data/2.5",
	params: { appid: process.env.OPENWEATHER_KEY, units: "metric", lang: "en" }
});

export const weatherHandler = async function (req, res) {
	try {
		const place = req.query.q;
		if (!place) return res.sendStatus(406);

		const { data } = await weatherApi.get("/weather", { params: { q: place } });

		res.json(data);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		console.error(`failed to get weather: ${err.message}`);
		console.error(err);
		return res.sendStatus(err.status);
	}
};
