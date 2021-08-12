const { OrderModel } = require("../models/orderModel");

exports.singleOrder = async(req,res) => {
  let orderNumber = req.params.orderNumber;
  try{
    let data = await OrderModel.findOne({orderNumber});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).send(err)
  }
}