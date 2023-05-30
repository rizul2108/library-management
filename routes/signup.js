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

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

router.get("/signup", (req, res) => {
	res.sendFile(path.join(rootDir, "src", "views", "signUp.html"));
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

router.post("/signup", (req, res) => {
	// console.log(req.body);
	let name = req.body.fullname;
	let username = req.body.username;
	let password = req.body.password;
	let passwordC = req.body.passwordC;
	let type = req.body.type;
    db.query(`SELECT * FROM users WHERE USERNAME = ${db.escape(username)};`);
});

module.exports = router;
