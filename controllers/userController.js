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
    user.password = await bcrypt.hash(user.password, salt);
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
    let validPass = await bcrypt.compare(req.body.password, user.password);
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

//get list of users for admin panel
exports.usersList = async (req, res) => {
  try {
    let data = await UserModel.find({}, { pass: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

exports.singleUser = async (req, res) => {
  try {
    let data = await UserModel.findOne({ _id: req.params.id }, { pass: 0, email: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

//get information of the user that the token is belong to him
exports.userInfo = async (req, res) => {
  try {
    // req.userData -> from the middleware authToken in the route "/myInfo"
    let user = await UserModel.findOne({ _id: req.userData._id }, { pass: 0 });
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}