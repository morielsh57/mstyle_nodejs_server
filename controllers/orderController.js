const { CartModel } = require("../models/cartModel");
const { OrderModel, validOrder, generateOrderNum } = require("../models/orderModel");

exports.singleOrder = async(req,res) => {
  let orderNumber = req.params.orderNumber;
  try{
    let data = await OrderModel.findOne({orderNumber});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err)
  }
}

exports.allOrders = async(req,res) => {
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 8;
  let page = (req.query.page) ? Number(req.query.page) : 0;
  let sortQ = (req.query.sort) ? req.query.sort : "_id";
  let ifReverse = (req.query.reverse) ? -1 : 1;

  try {
    // filter -> query
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

exports.createOrder = async(req,res) => {
  let validBody = validOrder(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    //delete the cart of the user
    let data = await CartModel.deleteOne({customerID:req.userData._id});
    if(data.n !== 1){ //if the cart of the user did not deleted
      return res.status(500).json({message:"Falid, please try again"})
    }
    let newOrder = new OrderModel(req.body);
    newOrder.customerID = req.userData._id;
    newOrder.orderNumber = generateOrderNum();
    await newOrder.save();
    return res.status(201).json(newOrder);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err)
  } 
}

exports.status = async(req,res) => {
  if(!req.body.status){
    return res.status(400).json({msg:"You must send status"});
  }
  try{
    let data = await OrderModel.updateOne({orderNumber:req.params.orderNumber},{status:req.body.status});
      return res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err)
  } 
}
