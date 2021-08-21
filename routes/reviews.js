const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({message:"review work!"});
})

router.post("/", authToken, reviewController.createReview);

module.exports = router;