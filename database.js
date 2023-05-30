require("dotenv").config();
const mysql = require("mysql");
module.exports = mysql.createConnection({
  host: process.env.MYSQL_HOST || "0.0.0.0",
  user: process.env.USER || "root",
  password: process.env.PASSWORD,
  database: "library",
  port: process.env.PORT || 2000,
});