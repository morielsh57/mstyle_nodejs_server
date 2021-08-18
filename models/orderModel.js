const mongoose = require("mongoose");
const Joi = require("joi");
const { random } = require("lodash");

const orderSchema = new mongoose.Schema({
  customerID: String,
  shipperID: String,
  totalPrice: Number,
  orderNumber: Number,
  status: {
    type: String, default: "pending"
  },
  paypalID: String,
  shipData: Object,
  cartAr: Array,
  date_created: {
    type: Date, default: Date.now()
  },
  //for notifications
  supplierID:Array
});

exports.OrderModel = mongoose.model("orders", orderSchema);

exports.validOrder = (_body) => {
  const joiSchema = Joi.object({
    totalPrice: Joi.number().min(1).required(),
    cartAr: Joi.array().min(1).required(),
    shipData: Joi.object({
      name:Joi.string().min(1).required(),
      description:Joi.string().min(1).required(),
      address:Joi.string().min(1).required()
    }),
    paypalID:Joi.string().min(1).required(),
    supplierID: Joi.array().items(Joi.string().min(24).max(24)).min(1).required(),
  })
  return joiSchema.validate(_body);
}

exports.generateOrderNum = async () => {
  let rnd;
  let okFlag = false;
  while (!okFlag) {
    rnd = random(1000000, 9999999);
    let data = await this.OrderModel.findOne({ orderNumber: rnd });
    if (!data) {
      okFlag = true;
    }
  }
  return rnd;
}