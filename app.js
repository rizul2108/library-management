const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const db = require("./database.js");
const path = require("path");
const rootDir = require("./utils/path");
const cookie=require("cookie-parser");

  
db.connect((err)=>{
	if(err){
		console.log(err);
	}
	console.log("connected")
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());


//importing routes
const homeRouter = require("./routes/home");
const loginroute = require("./routes/login");
const welcomRoute = require("./routes/welcome");
const signuproute = require("./routes/signup");
const profileRoute = require("./routes/profile");
const clientBooks=require("./routes/booksClient");
const adminBooks=require("./routes/adminBooks");
const requestsRoute=require("./routes/requests");
const { request } = require("http");

//static files serving
// app.use("/css", express.static(path.join(rootDir,"public" ,"css")));
app.use(express.static(__dirname+"/public"));
// app.use(
// 	"/css",
// 	express.static(path.join(rootDir, "node_modules", "bootstrap", "dist", "css"))
// );

//routes
app.use(homeRouter);
app.use(welcomRoute);
app.use(loginroute);
app.use(signuproute);
app.use(profileRoute);
app.use(clientBooks);
app.use(adminBooks);
app.use(requestsRoute);

app.use((req, res) => {
	res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

//initiating server
app.listen(3000, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running,and App is listening on : " + 3000
		);
	else console.log("Error , server can't start", error);
});
