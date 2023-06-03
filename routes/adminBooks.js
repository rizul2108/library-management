var express = require("express");
var router = express.Router();
var database = require("../database");
const path = require("path");
const rootDir = require("../utils/path");

router.get("/admin/books", function (request, response, next) {
	var query = "SELECT * FROM books where quantity>0";

	database.query(query, function (error, data) {
		if (error) {
			throw error;
		} else {
			response.render(path.join(rootDir, "views", "adminBooks.ejs"), {
				title: "Books List",
				action: "list",
				sampleData: data,
			});
		}
	});
});
router.get("/admin/add", function (request, response, next) {
	response.render(path.join(rootDir, "views", "adminBooks.ejs"), {
		title: "Insert Books into Database",
		action: "add",
	});
});

router.post("/admin/add_book", function (request, response, next) {
	var title = request.body.title;

	var author = request.body.author;
	var quantity = request.body.quantity;

	var query = `
	INSERT INTO books
	(title, author,quantity) 
	VALUES ("${title}", "${author}","${quantity}")
	`;

	database.query(query, function (error, data) {
		if (error) {
			throw error;
		} else {
			response.redirect("/admin/books");
		}
	});
});
router.post("/addQty", (req, res) => {
	const { bookID, quantity } = req.body;

	const query = `UPDATE books SET quantity = quantity + ${quantity} WHERE book_id = ${bookID}`;
	database.query(query, (err, result) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			if (result.affectedRows > 0) {
				res.redirect("/admin/books");
			}
		}
	});
});
router.post("/delete", (req, res) => {
	const { bookID, quantity } = req.body;

	// Construct and execute the DELETE query
	const query = `UPDATE books SET quantity = quantity - ${quantity} WHERE book_id = ${bookID}`;
	database.query(query, (err, result) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			if (result.affectedRows > 0) {
				res.redirect("/admin/books"); // Redirect to the main page after successful deletion
			} else {
				res.sendStatus(404); // Record not found or invalid quantity
			}
		}
	});
});

module.exports = router;
