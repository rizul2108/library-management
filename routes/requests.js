var express = require("express");
var router = express.Router();
var database = require("../database");
const path = require("path");
const rootDir = require("../utils/path");

router.get("/admin/requests", function (request, response) {
	var query =
		`select request_id,req_type,title,full_name from requests r join books b on r.book_id=b.book_id join users u on r.user_id=u.user_id where req_type="borrow" or req_type="return";`;

	database.query(query, function (error, data) {
		if (error) {
			throw error;
		} else {
			response.render(path.join(rootDir, "views", "requests.ejs"), {
				title: "Requests List",
				action: "list",
				sampleData: data,
			});
		}
	});
});
router.post("/delRequest", function (req, res) {
	console.log(req.body);
	const { reqID } = req.body;
	console.log(reqID);
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
						
						res.redirect(`/admin/requests`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		} else if(result[0].req_type == "return"){
			const query = `DELETE from requests WHERE request_id = ${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
						
						res.redirect(`/admin/requests`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		}
	});
});
router.post("/acceptRequest", function (req, res) {
	console.log(req.body);
	const { reqID } = req.body;
	console.log(reqID);
	const q = `select  * from requests WHERE request_id = ${reqID}`;
	database.query(q, (err, result) => {
		if (err) throw err;
        const bookID=result[0].book_id;
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
						res.redirect(`/admin/requests`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		}
        else if (result[0].req_type == "return") {
			const query = `update requests set req_type="accepted", state="owned" WHERE request_id = ${reqID}`;
			database.query(query, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else {
					if (result.affectedRows > 0) {
                        database.query(
							`update books set quantity=quantity + 1 where book_id=${bookID}`
						);
						res.redirect(`/admin/requests`); // Redirect to the main page after successful deletion
					} else {
						res.sendStatus(404); // Record not found or invalid quantity
					}
				}
			});
		}
	});
});
module.exports = router;
