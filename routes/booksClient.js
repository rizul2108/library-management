const express = require('express');
const router=express.Router();
const path=require('path');
const rootDir=require("../utils/path")

router.get("/books/client",(req,res)=>{
    res.render( path.join(rootDir,'views','booksClient.ejs'))
})
module.exports=router;
