const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authToken } = require("../middlewares/auth");

router.get('/', (req, res)=>{
  res.json({message:"cart router"});
});

router.post("/add",authToken, cartController.addToCart);

router.post("/delete",authToken, cartController.deleteFromCart);

router.post("/addMany",authToken, cartController.addManyToCart);

module.exports = router;