const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("../database");
require("dotenv").config();
const cors = require("cors");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());
const jwt = require("jsonwebtoken");

router.get("/login", (req, res) => {
	res.sendFile(path.join(rootDir, "views", "login.html"));
});
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) res.redirect("/login");
	else {
		db.query(
			`select * from users where USERNAME = ${db.escape(username)}`,
			async (err, result) => {
				if (err) throw err;
				if (!result[0]) {
					res.redirect("/login");
				} else {
					let hash = await bcrypt.hash(password, result[0].salt);
					if (hash !== result[0].hash) {
						console.log("passwords don't match");
						res.redirect("/login");
					} else {
						const token = jwt.sign(
							{ username: result[0].username },
							process.env.JWT_SECRET,
							{
								expiresIn: process.env.JWT_EXPIRES,
							}
						);
						res.redirect(`/profile?username=${result[0].username}`);
					}
				}
			}
		);
	}
});
module.exports = router;
