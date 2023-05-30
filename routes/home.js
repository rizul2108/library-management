const express = require('express');
const router=express.Router();
const path=require('path');
const rootDir=require("../utils/path")

router.get("/",(req,res)=>{
    res.sendFile( path.join(rootDir,'src','views','home.html'))
})
module.exports=router;
