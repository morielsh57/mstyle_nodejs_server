const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/userModel")
const {config} = require("../config/secretData")


exports.authToken = (req,res,next) => {
  let token = req.header("auth-token");
  if(!token){
    return res.status(400).json({msg:"you must send token in this url to get data"});
  }
  try{

    let decodeToken = jwt.verify(token,config.jwtSecret);
    // Creates a new property with user information for the next function can use it (in the id)
    req.userData = decodeToken;
    next();
  }
  catch (err) {
    console.log(err);
    res.status(400).json({msg:"token invalid or expired"});
  }
}

//check if the user is an admin user ("admin")
exports.authAdminToken = async(req,res,next) => {
  try{
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role != "admin"){
     return res.status(401).json({msg:"You must be an admin user to send here data"})
    }
    next()
  }
  catch (err) {
    console.log(err);
    res.status(401).json({msg:"err system"});
  }
}