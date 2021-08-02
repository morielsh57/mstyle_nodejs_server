const mongoose = require("mongoose");
const Joi = require("joi");
const { random } = require("lodash");


const categorySchema = new mongoose.Schema({
  shortID:Number,
  mainCategory:String,
  subCategory:String
})

exports.CategoryModel = mongoose.model("categories",categorySchema);

exports.validCategory = (_bodyData) => {
  let joiSchema = Joi.object({
    mainCategory:Joi.string().min(2).max(100).required(),
    subCategory:Joi.string().min(2).max(100).allow(null, '')
  })
  return joiSchema.validate(_bodyData);
}

//numbering by the last product to give it a shorter id than the original id(from mongo)
//s_id
exports.generateShortID = async () => {
  let rnd;
  let okFlag = false;
  
  while (!okFlag) {
    rnd = random(1, 999);
    let data = await this.CategoryModel.findOne({ shortID: rnd });
    if (!data) {
      okFlag = true;
    }
  }
  return rnd;
}