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
const jwt=require("jsonwebtoken")


router.get("/login", (req, res) => {
	res.sendFile(path.join(rootDir,"views", "login.html"));
});
router.post("/login", (req, res) => {
    const{username,password}=req.body;
    if (!username || !password )
		return res.json({
			status: "error",
			error: "Please enter your details completely",
		});
    else{
        db.query(
			`select * from users where USERNAME = ${db.escape(username)}`,
			async (err, result) => {
				if(err)throw err;
				if(!result[0]){
					return res.json({
						status: "error",
						error: "Username doesn't exist",
					});
				}
				let hash = await bcrypt.hash(password, result[0].salt);

				 if(hash!==result[0].hash){
					console.log("passwords don't match")
					return res.json({
						status: "error",
						error: "Password didn't match",
					})
				}
				else{
					const token =jwt.sign({id:result[0].user_id},process.env.JWT_SECRET,{
						expiresIn:process.env.JWT_EXPIRES,
						httpOnly:true
					})
					const cookieOptions={
						expiresIn:new Date(Date.now()+process.env.COOKIE_EXPIRES*3600*1000),
						httpOnly:true
					}
					res.cookie("userRegistered",token,cookieOptions);
					 if (result[0].type === "client") {
						res.redirect(`/profile/${username}`);
					} else {
						res.redirect("/books/admin");
					}				}
			}
		)
    }
});
module.exports = router;
