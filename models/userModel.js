const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const { config } = require("../config/configData")
const nodemailer = require('nodemailer');

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { 
    type: String, default: "customer"
  },
  phone: String,
  address: String,
  avatar: String,
  isValidEmail: {
    type: Boolean, default: false
  },
  date_created: {
    type: Date, default: Date.now()
  }
})

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (_id) => {
  let token = jwt.sign({ _id }, config.jwtSecret, { expiresIn: "60mins" });
  return token;
}

exports.validUser = (_bodyUser) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(100).email().required(),
    phone: Joi.string().min(9).max(20).required(),
    password: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(2).max(200).allow(null, ''),
    avatar: Joi.string().min(2).max(200).allow(null, ''),
  })
  return joiSchema.validate(_bodyUser);
}


exports.validLogin = (_bodyUser) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(2).max(100).required()
  })
  return joiSchema.validate(_bodyUser);
}

exports.validEditUser = (_bodyUser) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(9).max(20).required(),
    address: Joi.string().min(2).max(200).allow(null, ''),
  })
  return joiSchema.validate(_bodyUser);
}

exports.sendEmail = (email,_id) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mstyle.service.customer@gmail.com',
      pass: 'MStyle2802'
    }
  });
  
  let mailOptions = {
    from: 'mstyle.service.customer@gmail.com',
    to: email,
    subject: 'MStyle-Email Confirmation',
    html: `<p>Hi, press <a href='http://localhost:3004/email/verify/${_id}'>here</a> to verify your email</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
  