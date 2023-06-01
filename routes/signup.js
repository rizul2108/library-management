const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("../database");
const register = async (req, res) => {};

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get("/signup", (req, res) => {
	res.sendFile(path.join(rootDir, "views", "signUp.html"));
});

async function hashPassword(password) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);

	return {
		salt: salt,
		hash: hash,
	};
}

router.post("/signup", async (req, res) => {
	const { username, password, fullname, type, passwordC } = req.body;
	if (!username || !password || !passwordC || !fullname || !type)
		return res.json({
			status: "error",
			error: "Please enter your details completely",
		});
	else if (password !== passwordC) {
		return res.json({
			status: "error",
			error: "Passwords didn't match",
		});
	} else {
		db.query(
			`select * from users where username = ${db.escape(username)}`,
			async (err, result) => {
				if (err) throw err;
				if (result[0]) {
					return res.json({
						status: "error",
						error: "Username already exists",
					});
				} else {
					var pass = await hashPassword(password);
					db.query(
						`INSERT INTO users (username, full_name, salt, hash, type) VALUES(${db.escape(
							username
						)},${db.escape(fullname)},'${pass.salt}', '${
							pass.hash
						}', ${db.escape(type)});`
					),(error,results)=>{
						if(error)throw error;
						else if (type === "client") {
							res.redirect(`/profile/${username}`);
						} else {
							res.redirect("/books/admin");
						}
					};
				}
			}
		);
	}
});

module.exports = router;
