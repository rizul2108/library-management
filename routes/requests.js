var express = require("express");
var router = express.Router();
var database = require("../database");
const path = require("path");
const rootDir = require("../utils/path");
const jwt = require("jsonwebtoken");
const { request } = require("http");

router.get("/admin/requests", function (req, res) {
	const username = req.query.username;
	if (!username) {
		res.redirect("/signup");
	} else {
		database.query(
			`SELECT * FROM users WHERE username = ${database.escape(username)}`,
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
						const query =`SELECT request_id, req_type, title, full_name, quantity
						FROM requests r
						JOIN books b ON r.book_id = b.book_id
						JOIN users u ON r.user_id = u.user_id
						WHERE (req_type = 'return') OR (req_type = 'borrow' AND quantity > 0);`;
						database.query(query, function (error, data) {
							if (error) {
								throw error;
							} else {
								res.render(path.join(rootDir, "views", "requests.ejs"), {
									title: "Requests List",
									action: "list",
									sampleData: data,
									username: username,
								});
							}
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
router.post("/delRequest", function (req, res) {
	const { reqID, username } = req.body;
	const q = `select  * from requests WHERE request_id = ${reqID}`;
	database.query(q, (err, result) => {
		if (err) throw err;
		const bookID = result[0].book_id;
		if (result[0].req_type == "borrow") {
			const query = `DELETE from requests WHERE request_id = ${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
						res.redirect(`/admin/requests?username=${username}`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		} else if (result[0].req_type == "return") {
			const query = `DELETE from requests WHERE request_id = ${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
						res.redirect(`/admin/requests?username=${username}`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		}
	});
});
router.post("/acceptRequest", function (req, res) {
	const { reqID, username } = req.body;
	const q = `select  * from requests WHERE request_id = ${reqID}`;
	database.query(q, (err, result) => {
		if (err) throw err;
		const bookID = result[0].book_id;
		if (result[0].req_type == "borrow") {
			const query = `update requests set req_type="accepted", state="owned" WHERE request_id = ${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
						database.query(
							`update books set quantity=quantity - 1 where book_id=${bookID}`
						);
						res.redirect(`/admin/requests?username=${username}`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		} else if (result[0].req_type == "return") {
			const query = `delete from requests where request_id=${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
						database.query(
							`update books set quantity=quantity + 1 where book_id=${bookID}`
						);
						res.redirect(`/admin/requests?username=${username}`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		}
	});
});
module.exports = router;
