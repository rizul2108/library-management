require("dotenv").config();
const mysql = require("mysql");
module.exports= mysql.createConnection({
 host:process.env.MYSQL_HOST||"localhost",
 user:process.env.USER,
 database:process.env.DB_NAME,
 password:process.env.PASSWORD
});
