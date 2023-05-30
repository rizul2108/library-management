const express = require('express');
const router=express.Router();
const path=require('path');
const rootDir=require("../utils/path")

router.get("/profile",(req,res)=>{
    res.render( path.join(rootDir,'src','views','clientProfile.ejs'))
})
module.exports=router;
