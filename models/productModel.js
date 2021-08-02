const mongoose = require("mongoose");
const Joi = require("joi");
const { random } = require("lodash");

const productSchema = new mongoose.Schema({
  name: String,
  catalogNumber: Number,
  description: String,
  information: Array,
  quantity: Number,
  tags: String,
  price: Number,
  color: String, //optional
  fabric: String, //optional
  images: Array,
  size: Number, //optional
  categoryID: Number,
  supplierID: String,
  date_created: {
    type: Date, default: Date.now()
  }
})

exports.ProductModel = mongoose.model("products", productSchema);

exports.validProduct = (_bodyData) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(500).required(),
    information: Joi.array().items(Joi.string().min(1).max(600)).min(1).max(10).required(),
    quantity: Joi.number().min(1).max(99999).required(),
    tags: Joi.string().min(2).max(500).required(),
    price: Joi.number().min(1).max(9999).required(),
    images: Joi.array().items(Joi.string().min(1).max(500)).min(1).max(10).allow(null, ''),
    categoryID: Joi.number().min(1).max(999999).required(),
    supplierID: Joi.string().min(2).max(200).allow(null, ''),
    color: Joi.string().min(2).max(200).allow(null, ''),
    fabric: Joi.string().min(2).max(200).allow(null, ''),
    size: Joi.number().min(0).max(50).allow(null, '')
  })

  return joiSchema.validate(_bodyData);
}

exports.generateCatalogNum = async () => {
  let rnd;
  let okFlag = false;
  
  while (!okFlag) {
    rnd = random(1000000, 9999999);
    let data = await this.ProductModel.findOne({ catalogNumber: rnd });
    if (!data) {
      okFlag = true;
    }
  }
  return rnd;
}
