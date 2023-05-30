const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database.js");
const path = require("path");
const rootDir = require("./utils/path");
db.connect();

//importing routes
const homeRouter = require("./routes/home");
const loginroute = require("./routes/login");
const signuproute = require("./routes/signup");
const profileRoute = require("./routes/profile");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./src/views");
//static files serving
app.use("/css", express.static(path.join(rootDir, "src", "css")));
app.use(
	"/css",
	express.static(path.join(rootDir, "node_modules", "bootstrap", "dist", "css"))
);
app.use(
	"/js",
	express.static(path.join(rootDir, "node_modules", "bootstrap", "dist", "js"))
);

//routes
app.use(homeRouter);
app.use(loginroute);
app.use(signuproute);
app.use(profileRoute);

app.use((req, res) => {
	res.status(404).sendFile(path.join(rootDir, "src", "views", "404.html"));
});

//initiating server
app.listen(3000, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running,and App is listening on : " + 3000
		);
	else console.log("Error , server can't start", error);
});
