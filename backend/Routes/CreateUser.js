const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator'); // when the user enter its detail it should be correct

// for password authentication
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const jwtSecret ="mynameisprajapatshyamsundervedpr"

// createuser is the endpoint ..  when we go to signup page
router.post("/createuser",[
body('email').isEmail(),
body('name').isLength({min :5}),
body('password','Incorrect Password').isLength({min : 5})],
async(req , res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors : errors.array()});
  }

  const salt = await bcrypt.genSalt(10);
  let secpassword = await bcrypt.hash(req.body.password , salt)
   try{
  await User.create({
    name : req.body.name,
    password : secpassword,
    email : req.body.email,
    location : req.body.location
})
res.json({success : true});
   }
   catch(error){
     console.log(error)
     res.json({success:false})
   }
})

//loginuser is the end point .. when we go to login page
router.post("/loginuser",[
  body('email').isEmail(),
  
  body('password','Incorrect Password').isLength({min : 5})],
  async(req , res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors : errors.array()});
  }
 let email = req.body.email
     try{
      // finding if the email which is being entered is there in the db or not
   let userData  =  await User.findOne({email});
   if(!userData)
   {
    return res.status(400).json({errors : "Try login with correct credentials"});
   }
   const pwdcompare = await bcrypt.compare(req.body.password,userData.password)
   if(!pwdcompare)
   {
    return res.status(400).json({errors : "Write Correct Password"});
   }
    const data ={
      user:{
        id : userData.id
      }
    }
    const authToken = jwt.sign(data , jwtSecret)
   return res.json({success : true , authToken : authToken})

     }
     catch(error){
       console.log(error)
       res.json({success:false})
     }
  })
module.exports = router