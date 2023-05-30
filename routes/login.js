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

router.get("/login", (req, res) => {
	res.sendFile(path.join(rootDir, "src", "views", "login.html"));
});
router.post("/login", (req, res) => {
	// console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	db.query(`SELECT * FROM users WHERE USERNAME = ${db.escape(username)};`,
    );
});
module.exports = router;
