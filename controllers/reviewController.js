const { validReview, ReviewModel } = require("../models/reviewModel")

exports.createReview = async(req,res) => {
  let validBody = validReview(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let review = new ReviewModel(req.body);
    review.customerID = req.userData._id;
    await review.save();
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