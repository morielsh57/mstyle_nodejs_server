const mongoose = require("mongoose");
const Joi = require("joi");

const cartSchema = new mongoose.Schema({
  customerID:String,
  productsID:Array
})

exports.CartModel = mongoose.model("carts",cartSchema);

exports.validAddToCart = (_body) => {
  let joiSchema = Joi.object({
    id:Joi.string().min(24).max(24).required(),
    amount:Joi.number().min(1).allow(null, '').default(1)
  })
  return joiSchema.validate(_body);
}

exports.validAddManyToCart = (_body) => {
  let joiSchema = Joi.object({
    cartArr:Joi.array().items(Joi.object({
      id:Joi.string().min(24).max(24).required(),
      amount:Joi.number().min(1).required()
    }))
  })
  return joiSchema.validate(_body);
}