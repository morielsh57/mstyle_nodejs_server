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