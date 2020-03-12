const express = require("express");
const db = require("./db");
const volleyball = require("volleyball");
const path = require("path");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { syncAndSeed } = db;
const { Maker, Country } = db.models;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(volleyball);

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/api/brands", (req, res, next) => {
	Maker.findAll().then((brands) => res.send(brands));
});
app.get("/api/brands/:id?", (req, res, next) => {
	console.log(req.params.id);
	Maker.findByPk(req.params.id).then((brand) => res.send(brand));
});

app.get("/api/brands/msg", (req, res, next) => {
	Maker.findAll({
		where: {
			suggestedPrice: { [Op.eq]: [10000] }
		}
	}).then((brands) => {
		console.log(brands);
		return res.send(brands);
	});
});

syncAndSeed().then(() => {
	app.listen(PORT, () => {
		console.log(`listening on port: ${PORT}`);
	});
});
