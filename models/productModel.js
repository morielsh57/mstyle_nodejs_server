const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: String,
  catalogNumber: Number,
  shortID: Number,
  information: String,
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

exports.productModel = mongoose.model("products", productSchema);

exports.validProduct = (_bodyData) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    information: Joi.string().min(2).max(500).required(),
    quantity: Joi.number().min(1).max(99999).required(),
    tags: Joi.string().min(2).max(500).required(),
    price: Joi.number().min(1).max(9999).required(),
    images: Joi.array().items(Joi.string().min(1).max(500)).min(1).max(10).required(),
    color: Joi.string().min(2).max(200).allow(null, ''),
    fabric: Joi.string().min(2).max(200).allow(null, ''),
    size: Joi.number().min(0).max(50).allow(null, ''),
    categoryID: Joi.number().min(1).max(999999).required(),
    supplierID: Joi.string().min(1).max(500).required()
  })

  return joiSchema.validate(_bodyData);
}