const express = require('express');
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const crypto = require("crypto");
const db = require("./database");
console.log(db);
db.connect();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000;

async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    
    return {
      salt: salt,
      hash: hash
    };
}

app.listen(3000, (error)=>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on : "+ 3000)
    else 
        console.log("Error , server can't start", error);
    }
);