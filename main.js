import express from "express";
// import "cors";

const app = express();

// const corsOpts = {
// 	origin: ["http://127.0.0.1:5173"]
// };
//
// app.use(cors(corsOpts));

app.get("/api/v0/", (req, res) => {
	res.json({ message: "hello", time: new Date(Date.now()).toLocaleTimeString("en-GB") });
});

app.listen(8080, () => {
	console.log("server is running on http://localhost:3000");
});
