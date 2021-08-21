const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema({
  orderNumber: Number,
  productID: String,
  customerID: String,
  review: String,
  stars: Number,
  date_created: {
    type: Date, default: Date.now()
  }
});

exports.ReviewModel = mongoose.model("reviews",reviewSchema);

exports.validReview = (_body) => {
  const joiSchema = Joi.object({
    orderNumber:Joi.number().min(1).required(),
    productID:Joi.string().min(24).max(24).required(),
    stars:Joi.number().min(1).required(),
    review: Joi.string().min(2).allow(null, '')
  })
  return joiSchema.validate(_body);
}

exports.validEditReview = (_body) => {
  const joiSchema = Joi.object({
    stars:Joi.number().min(1).required(),
    review: Joi.string().min(2).allow(null, '')
  })
  return joiSchema.validate(_body);
}