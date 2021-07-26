const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserModel, validUser, validLogin, genToken,sendEmail } = require("../models/userModel");
const { use } = require("../routes/users");

exports.createUser = async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.pass = user.pass2 = await bcrypt.hash(user.pass, salt);
    await user.save();
    sendEmail(user.email, user._id);
    res.status(201).json({message:"verify your email"});
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

//get a token
exports.loginUser = async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // check if the user exists
    let email_body = new RegExp(req.body.email, "i"); //Ignores uppercase and lowercase letters
    let user = await UserModel.findOne({ email: email_body });
    if (!user) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }
    if(!user.isValidEmail){
      return res.status(400).json({ message: "Please verify your email, before you login" });
    }
    let validPass = await bcrypt.compare(req.body.pass, user.pass);
    if (!validPass) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }
    let myToken = genToken(user._id); //from file models/userModel.js
    res.json({ token: myToken });
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

exports.checkIfAdmin = async (req, res) => {
  res.json({ auth: "admin" })
}
