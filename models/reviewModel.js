const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema({
  orderNumber: Number,
  productID: String,
  customerID: String,
  review: String,
  date_created: {
    type: Date, default: Date.now()
  }
});

exports.ReviewModel = mongoose.model("reviews",reviewSchema);

exports.validReview = (_body) => {
  const joiSchema = Joi.object({
    orderNumber:Joi.number().min(7).max(7).required(),
    productID:Joi.string().min(24).max(24).required(),
    review: Joi.string().min(2).required()
  })
  return joiSchema.validate(_body);
}