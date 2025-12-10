import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const weatherApi = axios.create({
	baseURL: "https://api.openweathermap.org/data/2.5",
	params: { appid: process.env.OPENWEATHER_KEY, units: "metric", lang: "en" }
});

const geoApi = axios.create({
	baseURL: "https://api.openweathermap.org/geo/1.0",
	params: { appid: process.env.OPENWEATHER_KEY, limit: "1" }
});

export const weatherHandler = async function (req, res) {
	try {
		const place = req.query.q;
		if (!place) return res.sendStatus(406);

		const { data } = await weatherApi.get("/weather", { params: { q: place } });

		res.status(200).json(data);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		console.error(`failed to get weather: ${err.message}`);
		// console.error(err);

		return res.sendStatus(err.status);
	}
};

export const forecastHandler = async function (req, res) {
	try {
		const place = req.query.q;
		console.log(place)
		if (!place) return res.sendStatus(406);

		let geoData = await geoApi.get("/direct", { params: { q: place } });

		let { data } = await weatherApi.get("/forecast", { params: { lat: geoData.data[0].lat, lon: geoData.data[0].lon } });

		res.status(200).json(data);
	} catch (err) {
		res.set("Content-Type", "text/plain");

		console.error(`failed to get forecast: ${err.message}`);
		// console.error(err);

		return res.sendStatus(500);
	}
};
