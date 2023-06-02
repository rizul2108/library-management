const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
const jwt = require("jsonwebtoken");
const db = require("../database.js");

router.get("/profile", (req, res) => {
    const username = req.query.username;
    if (!username) {
        res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
    } else {
        db.query(
            `SELECT * FROM users WHERE USERNAME = ${db.escape(username)}`,
            async (error, results) => {
                if (error) {
                    console.log(error);
                    return;
                }
                if(!results[0]){
                    res.redirect("/");
                }
                const secretKey = process.env.JWT_SECRET;
                try {
                    const decode = jwt.verify(results[0].token, secretKey);
                    const JWTusername = decode.username;
                    if (username === JWTusername) {
                        res.sendFile(path.join(rootDir, "views", "clientProfile.html"));
                    } else {
                        res.redirect("/");
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        );
    }
});

module.exports = router;
