const { CartModel } = require("../models/cartModel");
const { NotificationModel } = require("../models/notificationModel");
const { OrderModel, validOrder, generateOrderNum } = require("../models/orderModel");
const { UserModel } = require("../models/userModel");

exports.singleOrder = async (req, res) => {
  let orderNumber = req.params.orderNumber;
  try {
    let data = await OrderModel.findOne({ orderNumber });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.allOrders = async (req, res) => {
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 8;
  let page = (req.query.page) ? Number(req.query.page) : 0;
  let sortQ = (req.query.sort) ? req.query.sort : "_id";
  let ifReverse = (req.query.reverse) ? -1 : 1;

  try {
    let data = await OrderModel.find({})
      .sort({ [sortQ]: ifReverse })
      .limit(perPage)
      .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.createOrder = async (req, res) => {
  let validBody = validOrder(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let supplierID_ar = req.body.supplierID;
    //delete the cart of the user
    let data = await CartModel.deleteOne({ customerID: req.userData._id });
    if (data.n !== 1) { //if the cart of the user did not deleted
      return res.status(500).json({ message: "Falid, please try again" })
    }
    let newOrder = new OrderModel(req.body);
    newOrder.customerID = req.userData._id;
    newOrder.orderNumber = await generateOrderNum();
    newOrder.isReview = initializeIsReviewFalse(req.body.cartAr.length);
    await newOrder.save();

    //create notification for the suppliers
    let notification = new NotificationModel();
    notification.type = 1;
    notification.orderNumber = newOrder.orderNumber;
    notification.supplierID = [];
    let user_ar = await UserModel.find({ _id: { $in: supplierID_ar } });

    for (let i = 0; i < user_ar.length; i++) {
      if (user_ar[i].role !== "supplier") {
        await OrderModel.deleteOne({ orderNumber: newOrder.orderNumber });
        return res.status(400).json({ message: "Invalid suppliers id" });
      }
      notification.supplierID.push(user_ar[i]._id);
      let editUnreadCounter = user_ar[i].unreadCounter + 1;
      await UserModel.updateOne({ _id: user_ar[i]._id }, { unreadCounter: editUnreadCounter });
    }
    await notification.save();

    return res.status(201).json({ order: newOrder, notification: notification });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.status = async (req, res) => {
  if (!req.body.status) {
    return res.status(400).json({ msg: "You must send status" });
  }
  try {
    let data = await OrderModel.updateOne({ orderNumber: req.params.orderNumber }, { status: req.body.status });
    return res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.deleteOrder = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role !== "admin") return res.status(400).json({ message: "You have to be an admin" });
    const data = await OrderModel.deleteOne({ orderNumber: req.params.orderNumber });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}


exports.myOrders = async (req, res) => {
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 8;
  let page = (req.query.page) ? Number(req.query.page) : 0;
  let sortQ = (req.query.sort) ? req.query.sort : "_id";
  let ifReverse = (req.query.reverse) ? -1 : 1;

  try {
    let data = await OrderModel.find({ customerID: req.userData._id })
      .sort({ [sortQ]: ifReverse })
      .limit(perPage)
      .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.mySingleOrder = async (req, res) => {
  const orderNumber = req.params.orderNumber;
  try {
    let order = await OrderModel.findOne({ $and: [{ customerID: req.userData._id }, { orderNumber }] }, { paypalID: 0, customerID: 0 })
    if (!order) return res.status(400).json({ message: "order not exist" });
    res.json(order);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}