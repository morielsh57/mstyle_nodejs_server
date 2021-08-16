const mongoose = require("mongoose");
const Joi = require("joi");

const pickUpPointsSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: String,
  lat: Number,
  lng: Number,
  date_created: {
    type: Date, default: Date.now()
  }
});

exports.PickupPointModel = mongoose.model("pickupPoints",pickUpPointsSchema);

exports.validPoint = (_body) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).required(),
    description:Joi.string().min(2).required(),
    address:Joi.string().min(2).required(),
    lat: Joi.number().min(1).required(),
    lng: Joi.number().min(1).required()
  })
  return joiSchema.validate(_body);
}