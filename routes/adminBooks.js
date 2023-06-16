var express = require("express");
var router = express.Router();
var database = require("../database");
const path = require("path");
const jwt = require("jsonwebtoken");
const rootDir = require("../utils/path");
const jwtM=require("../utils/jwtMiddle")
router.get("/admin/books",function (req, res) {
	const username = req.query.username;
	if (!username) {
		res.redirect("/signup");
	} else {
		database.query(
			`SELECT * FROM users WHERE USERNAME = ${database.escape(username)}`,
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
					const decode = jwt.verify(results[0].token, secretKey);
					const JWTusername = decode.username;
					if (username === JWTusername) {
						var query = "SELECT * FROM books";
						database.query(query, function (error, data) {
							if (error) {
								throw error;
							} else {
								res.render(path.join(rootDir, "views", "adminBooks.ejs"), {
									title: "Books List",
									action: "list",
									sampleData: data,
									username: results[0].username,
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
router.get("/admin/addBook", function (request, response, next) {
	const username = request.query.username;
	response.render(path.join(rootDir, "views", "addBook.ejs"), {
		title: "Insert Books into Database",
		action: "add",
		username: username,
	});
});

router.post("/admin/add_book", function (request, response) {
	var title = request.body.title;
	var username = request.body.username;
	var author = request.body.author;
	var quantity = request.body.quantity;
	var checkQuery = `
SELECT * FROM books where  title=${database.escape(
		title
	)} and author=${database.escape(author)}`;
	database.query(checkQuery, function (error, res) {
		if (error) {
			throw error;
		} else {
			if (res[0]) {
				var query = `UPDATE books set quantity=quantity+${quantity} where title=${database.escape(
					title
				)}`;
			} else {
				var query = `
					INSERT INTO books
					(title, author,quantity) 
					VALUES ("${title}", "${author}","${quantity}")
					`;
			}
			database.query(query, function (error, data) {
				if (error) {
					throw error;
				} else {
					response.redirect(`/admin/books?username=${username}`);
				}
			});
		}
	});
});
router.post("/addQty", (req, res) => {
	const { bookID, quantity, username } = req.body;
	// const username=req.query.username;
	const query = `UPDATE books SET quantity = quantity + "${quantity}" WHERE book_id = "${bookID}"`;
	database.query(query, (err, result) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			if (result.affectedRows > 0) {
				res.redirect(`/admin/books?username=${username}`);
			}
		}
	});
});
router.post("/delete", (req, res) => {
	const { bookID, quantity, username } = req.body;
	// Construct and execute the DELETE query
	const query = `UPDATE books SET quantity = quantity - ${quantity} WHERE book_id = "${bookID}"`;
	database.query(query, (err, result) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			if (result.affectedRows > 0) {
				res.redirect(`/admin/books?username=${username}`); // Redirect to the main page after successful deletion
			} else {
				res.sendStatus(404); // Record not found or invalid quantity
			}
		}
	});
});

module.exports = router;
