const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
const jwt = require("jsonwebtoken");
const db = require("../database.js");

router.get("/client/books", (req, res) => {
	const username = req.query.username;
	console.log(username);
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
					console.log("0");
					res.redirect("/signup");
				}
				const secretKey = process.env.JWT_SECRET;
				try {
					const decode = jwt.verify(results[0].token, secretKey);
					const JWTusername = decode.username;
					if (username === JWTusername) {
						const query = `select * from books where quantity>0`;
						db.query(query, (err, requestdata) => {
							if (err) throw err;
							res.render(path.join(rootDir, "views", "booksClient.ejs"), {
								sampleData: requestdata,
								username: username,
							});
						});
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
router.post("/issueBook", (req, res) => {
	const { bookID, username } = req.body;
	const q = `select user_id from users where username="${username}"`;
	db.query(q, (err, result) => {
		const query = `INSERT INTO requests (book_id, user_id,req_type,state) VALUES(${bookID},${result[0].user_id},"borrow","requested")`;
		db.query(query, (err, result) => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
			} else {
				if (result.affectedRows > 0) {
					res.redirect(`/client/books?username=${username}`); // Redirect to the main page after successful deletion
				} else {
					res.sendStatus(404); 
				}
			}
		});
		});});

module.exports = router;
