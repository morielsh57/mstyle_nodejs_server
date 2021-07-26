const mongoose = require("mongoose");
const Joi = require("joi");
const { random } = require("lodash");


const categorySchema = new mongoose.Schema({
  shortID:Number,
  name:String
})

exports.CategoryModel = mongoose.model("categories",categorySchema);

exports.validCategory = (_bodyData) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(100).required()
  })
  return joiSchema.validate(_bodyData);
}

//numbering by the last product to give it a shorter id than the original id(from mongo)
//s_id
exports.generateShortId = async () => {
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