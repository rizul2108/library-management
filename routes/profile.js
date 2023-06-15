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
				if (!results[0]) {
					res.redirect("/signup");
				}
				const secretKey = process.env.JWT_SECRET;
				try {
					const decode = jwt.verify(results[0].token, secretKey);
					const JWTusername = decode.username;
					if (username === JWTusername) {
						const query = `select * from requests where user_id=${results[0].user_id}`;
						db.query(query, (err, requestdata) => {
							if (err) throw err;
							res.render(path.join(rootDir, "views", "clientProfile.ejs"), {
								username: username,
								fullname: results[0].full_name,
								data: requestdata,
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
router.post("/delReq", (req, res) => {
    const { reqID, username } = req.body;
    const q = `SELECT req_type FROM requests WHERE request_id = ${reqID}`;
    db.query(q, (err, result) => {
      if (err) throw err;
      if (result[0].req_type == "borrow") {
        const query = `DELETE FROM requests WHERE request_id = ${reqID}`;
        db.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            if (result.affectedRows > 0) {
              res.redirect(`/profile?username=${username}`); // Redirect to the main page after successful deletion
            } else {
              res.sendStatus(404); // Record not found or invalid quantity
            }
          }
        });
      } else {
        const query = `UPDATE requests SET req_type="accepted", state="owned" WHERE request_id = ${reqID}`;
  
        db.query(query, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            if (result.affectedRows > 0) {
              res.redirect(`/profile?username=${username}`); // Redirect to the main page after successful deletion
            } else {
              res.sendStatus(404); // Record not found or invalid quantity
            }
          }
        });
      }
    });
  });
  
router.post("/retBook", (req, res) => {
	const { reqID, username } = req.body;

	// Construct and execute the DELETE query
	const query = `update requests set state="requested" , req_type="return" WHERE request_id = ${reqID}`;

	db.query(query, (err, result) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			if (result.affectedRows > 0) {
				res.redirect(`/profile?username=${username}`); // Redirect to the main page after successful deletion
			} else {
				res.sendStatus(404); // Record not found or invalid quantity
			}
		}
	});
});
module.exports = router;
