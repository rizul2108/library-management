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

router.get("/adminLogin", (req, res) => {
	const message = req.query.message || "";
	res.render(path.join(rootDir, "views", "adminLogin.ejs"),{message});
});
router.post("/adminLogin", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) res.redirect("/adminLogin");
	else {
		db.query(
			`select * from users where USERNAME = ${db.escape(username)}`,
			async (err, result) => {
				if (err) throw err;
				if (!result[0]) {
					res.redirect("/signup");
				} else {
					let hash = await bcrypt.hash(password, result[0].salt);
					if (hash !== result[0].hash) {
						return res.redirect("/adminLogin?message=Password%20didn't%20match");
					} else if(result[0].type!=='admin'){
						return res.redirect("/adminLogin?message=You%20aren't%20admin");
						
                    }
                    else {
						const token = jwt.sign(
							{ username: result[0].username },
							process.env.JWT_SECRET,
							{
								expiresIn: process.env.JWT_EXPIRES,
							}
						);
						const query = `update users set token=${db.escape(token)} WHERE username = ${db.escape(username)}`;
						db.query(query,async(err,results)=>{
							if(err){
								throw err;
							}

						})
						res.redirect(`/admin/books?username=${result[0].username}`);
					}
				}
			}
		);
	}
});
module.exports = router;
