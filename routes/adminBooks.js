var express = require('express');
var router = express.Router();
var database = require('../database');
const path = require('path');
const rootDir = require("../utils/path")

router.get("/admin/books", function(request, response, next){

	var query = "SELECT * FROM books";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render(path.join(rootDir,"views","adminBooks.ejs"), {title:'Books List', action:'list', sampleData:data});
		}

	});

});
router.get("/admin/add", function(request, response, next){

	response.render(path.join(rootDir,"views","adminBooks.ejs"), {title:'Insert Books into Database', action:'add'});

});

router.post("/admin/add_book", function(request, response, next){

	var title = request.body.title;

	var author = request.body.author;

	var query = `
	INSERT INTO books
	(title, author) 
	VALUES ("${title}", "${author}")
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}	
		else
		{
			response.redirect("/admin/books");
		}

	});

});

module.exports = router;