const { OrderModel } = require("../models/orderModel");
const { validReview, ReviewModel, validEditReview } = require("../models/reviewModel")

exports.createReview = async(req,res) => {
  let validBody = validReview(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let order = await OrderModel.findOne({orderNumber:req.body.orderNumber});
    if(order.customerID !== req.userData._id){
      return res.json({message: "Error permission"})
    }

    let review = new ReviewModel(req.body);
    review.customerID = req.userData._id;
    await review.save();

    let indx = order.cartAr.findIndex(item => item._id === req.body.productID);
    let updateIsRev = order.isReview;
    updateIsRev[indx] = true;
    await OrderModel.updateOne({orderNumber:req.body.orderNumber},{isReview:updateIsRev});

    res.status(201).json(review);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.getSingleReview = async(req,res) => {
  try{
    let review = await ReviewModel.findOne({$and:[{orderNumber:req.params.orderNum},{productID:req.params.prodId}]});
    res.status(200).json(review);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.getproductReviews = async(req,res) => {
  try{
    let reviews = await ReviewModel.find({productID:req.params.productID});
    res.status(200).json(reviews);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}

exports.editReview = async(req,res) => {
  let validBody = validEditReview(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let data;
    if(req.body.review){
    data = await ReviewModel.updateOne({$and:[{orderNumber:req.params.orderNum},{productID:req.params.prodId},{customerID:req.userData._id}]},{review:req.body.review,stars:req.body.stars});
    }
    else{
      data = await ReviewModel.updateOne({$and:[{orderNumber:req.params.orderNum},{productID:req.params.prodId},{customerID:req.userData._id}]},{stars:req.body.stars});
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err)
  }
}
