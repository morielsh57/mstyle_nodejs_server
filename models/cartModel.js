const mongoose = require("mongoose");
const Joi = require("joi");
const { string, number } = require("joi");

const cartSchema = new mongoose.Schema({
  customerID: String,
  // totalPrice: Number,
  productsID: Array
})

exports.CartModel = mongoose.model("carts",cartSchema);

exports.validCart = (_body) => {
  const joiSchema = Joi.object({
    // totalPrice:Joi.number().min(1).required(),
    productsID:Joi.object({
      id: Joi.string().min(24).required(),
      amount: Joi.number().min(1).required()
    })
  })
  return joiSchema.validCart(_body);
}

