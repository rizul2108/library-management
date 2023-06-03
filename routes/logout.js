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


router.get("/logout", async (req, res) => {
	const username  = req.query.username;
	db.query(`update users set token="null" where username="${username}";`)
    res.redirect("/login")
});
module.exports = router;
