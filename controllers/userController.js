const bcrypt = require("bcrypt");
const _ = require("lodash");
const { RoleModel } = require("../models/roleModel");
const { UserModel, validUser, validLogin, genToken,sendEmail, validEditUser } = require("../models/userModel");
const { use } = require("../routes/users");

exports.createUser = async (req, res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    sendEmail(user.email, user._id);
    res.status(201).json({message:"verify your email"});
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
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
    const email_body = new RegExp(req.body.email, "i"); //Ignores uppercase and lowercase letters
    const user = await UserModel.findOne({ email: email_body });
    if (!user) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }
    if(!user.isValidEmail){
      return res.status(400).json({ message: "Please verify your email, before you login" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }
    const myToken = genToken(user._id); //from file models/userModel.js
    res.json({ token: myToken });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.checkIfAdmin = async (req, res) => {
  const user = await UserModel.findOne({_id:req.userData._id})
  res.json({ role: user.role });
}

//get list of users for admin panel
exports.usersList = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 5; //if perPage not mentioned (?perPage=x) the default: 5
  const page = (req.query.page) ? Number(req.query.page) : 0; //optional (?page=x), default: 0
  const filterRole = (req.query.role) ? { role: req.query.role } : {};
  try {
    const user = await UserModel.findOne({_id:req.userData._id})
    if(user.role !== "admin") return res.status(400).json({ message: "You have to be an admin" });
     if(filterRole.role){
      role = await RoleModel.findOne({roleName:filterRole.role});
      if(!role) return res.status(400).json({ message: "Invalid role" });
    }
    const data = await UserModel.find(filterRole, { password: 0 })
    .sort({_id:-1})
    .limit(perPage)
    .skip(page * perPage);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.singleUser = async (req, res) => {
  try {
    const data = await UserModel.findOne({ _id: req.params.id }, { password: 0, email: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

//get information of the user that the token is belong to him
exports.userInfo = async (req, res) => {
  try {
    // req.userData -> from the middleware authToken in the route "/myInfo"
    const user = await UserModel.findOne({ _id: req.userData._id }, { password: 0 });
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.customersAmount = async (req, res) => {
  try {
    let data = await UserModel.countDocuments({role:"customer"});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findOne({_id:req.userData._id})
    if(user.role !== "admin") return res.status(400).json({ message: "You have to be an admin" });
    if (id != user._id) {
      const data = await UserModel.deleteOne({ _id: id });
      return res.json(data);
    }
    else {
      return res.json({ message: "can't delete your own user" })
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

//can edit just the name, phone, address.
exports.editUser = async (req, res) => {
  const validBody = validEditUser(req.body);
  if (validBody.error) return res.status(400).json(validBody.error.details);
  try {
    const user = await UserModel.findOne({_id:req.userData._id})
    if(user.role !== "admin") return res.status(400).json({ message: "You have to be an admin" });
    const data = await UserModel.updateOne({ _id: req.params.id }, req.body);
    res.status(201).json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.createUserAsAdmin = async (req, res) => {
  const validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({_id:req.userData._id})
    if(user.role !== "admin") return res.status(400).json({ message: "You have to be an admin" });
    const roleName = req.params.role;
    const role = await RoleModel.findOne({roleName});
    if(!role || roleName === "customer"){
      return res.status(400).json({ message: "invalid role" });
    }
    user = new UserModel(req.body);
    user.role = roleName;
    user.isValidEmail = true;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).json(_.pick(user, ["name","role","_id", "email", "phone", "address", "date_created",]));
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}