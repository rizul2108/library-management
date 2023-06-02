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
	if (!username || !password)
		return res.json({
			status: "error",
			error: "Please enter your details completely",
		});
	else {
		db.query(
			`select * from users where USERNAME = ${db.escape(username)}`,
			async (err, result) => {

				if (err) throw err;
				if (!result[0]) {
					return res.json({
						status: "error",
						error: "Username doesn't exist",
					});
				} else {
					let hash = await bcrypt.hash(password, result[0].salt);
					if (hash !== result[0].hash) {
						console.log("passwords don't match");
						return res.json({
							status: "error",
							error: "Password didn't match",
						});
					} else {
						const token = jwt.sign(
							{ username:result[0].username },
							process.env.JWT_SECRET,
							{
								expiresIn: process.env.JWT_EXPIRES,
							}
						);
						
						if (result[0].type === "Client") {
							console.log("hi")
							res.redirect(`/profile?username=${result[0].username}`);
						} else {
							res.redirect("/admin/books");
						}
					}
				}
			}
		);
	}
});
module.exports =router;
