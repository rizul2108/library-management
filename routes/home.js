const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");

router.get("/home", (req, res) => {
	res.sendFile(path.join(rootDir, "views", "home.html"));

	// res.send(`
// `);
});
module.exports = router;
