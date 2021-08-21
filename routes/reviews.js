const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({message:"review work!"});
})

router.post("/", authToken, reviewController.createReview);

router.get("/single/:orderNum/:prodId", authToken, reviewController.getSingleReview);

router.get("/prodReviews/:productID", reviewController.getproductReviews);

router.put("/:orderNum/:prodId", authToken, reviewController.editReview);

module.exports = router;