const express = require('express');
const router=express.Router();
const path=require('path');
const rootDir=require("../utils/path")

router.get("/books/admin",(req,res)=>{
    res.render( path.join(rootDir,'views','adminBooks.ejs'))
})
module.exports=router;
