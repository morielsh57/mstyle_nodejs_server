const express = require("express");
const { authToken,authAdminToken } = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"orders work"});
})

router.get("/singleOrder/:orderNumber", authToken, authAdminToken, orderController.singleOrder);

router.get("/allOrders", authToken,authAdminToken ,orderController.allOrders);

router.post("/", authToken, orderController.createOrder);

router.patch("/status/:orderNumber", authToken, authAdminToken ,orderController.status);

module.exports = router;