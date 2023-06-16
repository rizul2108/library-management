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
const jwt = require("jsonwebtoken");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get("/makeAdmin", (req, res) => {
	const username = req.query.username;
	if (!username) {
		res.redirect("/signup");
	} else {
		db.query(
			`SELECT * FROM users WHERE username = ${db.escape(username)}`,
			async (error, results) => {
				if (error) {
					console.log(error);
					return;
				}
				if (!results[0]) {
					res.redirect("/signup");
				}
				const secretKey = process.env.JWT_SECRET;
				try {
					if (results[0].type !== "admin") {
						res.redirect("/signup");
					}
					const decode = jwt.verify(results[0].token, secretKey);
					const JWTusername = decode.username;
					if (username === JWTusername) {
						const message = req.query.message || "";
						res.render(path.join(rootDir, "views", "makeAdmin.ejs"), { message });
					} else {
						res.redirect("/signup");
					}
				} catch (err) {
					console.log(err);
				}
			}
		);
	}
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

router.post("/makeAdmin", async (req, res) => {
	const { username, password, fullname, passwordC } = req.body;
	if (password !== passwordC) {
		return res.redirect("/signup?message=Passwords%20didn't%20match");
	} else {
		db.query(
			`select * from users where username = ${db.escape(username)}`,
			async (err, result) => {
				if (err) throw err;
				if (result[0]) {
					return res.redirect("/signup?message=Username%20already%20exists");
				} else {
					var pass = await hashPassword(password);
					const token = jwt.sign(
						{ username: username },
						process.env.JWT_SECRET,
						{
							expiresIn: process.env.JWT_EXPIRES,
						}
					);
					db.query(
						`INSERT INTO users (username, full_name, salt, hash, type, token) VALUES (${db.escape(
							username
						)}, ${db.escape(fullname)}, '${pass.salt}', '${
							pass.hash
						}', 'admin', ${db.escape(token)})`,
						(error, results) => {
							if (error) {
								console.log(error);
							} else {
								res.redirect(`/admin/books`);
							}
						}
					);
				}
			}
		);
	}
});

module.exports = router;
