const express = require("express");
const router = express.Router();
const { UserModel} = require("../models/userModel");

router.get('/', (req ,res) => {
  res.json({message:'email route'});
});

router.get("/verify/:uniqueId", async(req ,res) => {
  const user = await UserModel.findOne({_id:req.params.uniqueId})
  if(user){
    user.isValidEmail = true
    await user.save();
    res.redirect('http://localhost:3000/login')
  }
  else{
    res.json("User not found");
  }
})

module.exports = router;