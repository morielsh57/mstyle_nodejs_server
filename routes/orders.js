const express = require("express");
// const { authToken,authAdminToken } = require("../middlewares/auth");
// const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"orders work"});
})

module.exports = router;