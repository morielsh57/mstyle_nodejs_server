const mongoose = require("mongoose");
const Joi = require("joi");

const notificationSchema = new mongoose.Schema({
  type: Number,
  orderNumber: Number,
  supplierID: Array,
  isRead:  {
    type: Boolean, default: false
  },
  date_created: {
    type: Date, default: Date.now()
  }
});

exports.NotificationModel = mongoose.model("notifications", notificationSchema);




