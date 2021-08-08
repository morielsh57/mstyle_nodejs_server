const express = require("express");

const router = express.Router();

router.get("/", (req,res) => {
  res.json({message:"cart work!"});
})

module.exports = router;