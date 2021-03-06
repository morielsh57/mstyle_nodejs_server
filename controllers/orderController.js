const { CartModel } = require("../models/cartModel");
const { NotificationModel } = require("../models/notificationModel");
const { OrderModel, validOrder, generateOrderNum, initializeIsReviewFalse } = require("../models/orderModel");
const { UserModel } = require("../models/userModel");

exports.singleOrder = async (req, res) => {
  const orderNumber = req.params.orderNumber;
  try {
    const data = await OrderModel.findOne({ orderNumber });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.allOrders = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 8;
  const page = (req.query.page) ? Number(req.query.page) : 0;
  const sortQ = (req.query.sort) ? req.query.sort : "_id";
  const ifReverse = (req.query.reverse && req.query.reverse==="true") ? -1 : 1;

  try {
    let allOrForSupplier = {};
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role === "supplier"){
      let notificOrderNum = await NotificationModel.find({supplierID:req.userData._id},{orderNumber:1});
      let OrderNum_ar = [];
      for(let i=0; i<notificOrderNum.length; i++){
        OrderNum_ar.push(notificOrderNum[i].orderNumber);
      }
      allOrForSupplier = {orderNumber:{$in: OrderNum_ar}}
    }
    const data = await OrderModel.find(allOrForSupplier)
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

exports.allOrdersCount = async (req, res) => {
  try {
    let allOrForSupplier = {};
    const user = await UserModel.findOne({ _id: req.userData._id })
    if (user.role === "supplier"){
      let notificOrderNum = await NotificationModel.find({supplierID:req.userData._id},{orderNumber:1});
      let OrderNum_ar = [];
      for(let i=0; i<notificOrderNum.length; i++){
        OrderNum_ar.push(notificOrderNum[i].orderNumber);
      }
      allOrForSupplier = {orderNumber:{$in: OrderNum_ar}}
    }
    const data = await OrderModel.countDocuments(allOrForSupplier);
    res.json({ count: data });
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
    const supplierID_ar = req.body.supplierID;
    //delete the cart of the user
    const data = await CartModel.deleteOne({ customerID: req.userData._id });
    if (data.n !== 1) { //if the cart of the user did not deleted
      return res.status(500).json({ message: "Falid, please try again" })
    }
    let newOrder = new OrderModel(req.body);
    newOrder.customerID = req.userData._id;
    newOrder.orderNumber = await generateOrderNum();
    newOrder.isReview = initializeIsReviewFalse(req.body.cartAr.length);
    await newOrder.save();

    //create new notification for the suppliers
    let notification = new NotificationModel();
    notification.type = 1;
    notification.orderNumber = newOrder.orderNumber;
    notification.supplierID = [];
    const user_ar = await UserModel.find({ _id: { $in: supplierID_ar } });

    for (let i = 0; i < user_ar.length; i++) {
      if (user_ar[i].role !== "supplier") {
        await OrderModel.deleteOne({ orderNumber: newOrder.orderNumber });
        return res.status(400).json({ message: "Invalid suppliers id" });
      }
      let userId = user_ar[i]._id.toString();
      notification.supplierID.push(userId);
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
    const data = await OrderModel.updateOne({ orderNumber: req.params.orderNumber }, { status: req.body.status });
    if(data.n===1){
      let newType = (req.body.status === "canceled") ? 2 : 1;
      let updateTypeNot = await NotificationModel.updateOne({orderNumber: req.params.orderNumber},{ type: newType })
      if(updateTypeNot.n !==1 ){
        return res.json({message:"update type notification faild"})
      }
    }
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
    if(data.n===1){
      await NotificationModel.deleteOne({orderNumber: req.params.orderNumber});
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}


exports.myOrders = async (req, res) => {
  const perPage = (req.query.perPage) ? Number(req.query.perPage) : 8;
  const page = (req.query.page) ? Number(req.query.page) : 0;
  const sortQ = (req.query.sort) ? req.query.sort : "_id";
  const ifReverse = (req.query.reverse) ? -1 : 1;

  try {
    const data = await OrderModel.find({ customerID: req.userData._id })
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

exports.myOrdersCount = async (req, res) => {
  try {
    const data = await OrderModel.countDocuments({ customerID: req.userData._id });
    res.json({ count: data });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.mySingleOrder = async (req, res) => {
  const orderNumber = req.params.orderNumber;
  try {
    const order = await OrderModel.findOne({ $and: [{ customerID: req.userData._id }, { orderNumber }] }, { paypalID: 0, customerID: 0 })
    if (!order) return res.status(400).json({ message: "order not exist" });
    res.json(order);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}