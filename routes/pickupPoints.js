const express = require("express");
const { authToken,authAdminToken } = require("../middlewares/auth");
const pickupPointController = require("../controllers/pickupPointController");

const router = express.Router();

router.get("/", authToken ,pickupPointController.getPoints);

router.get("/single/:id", authToken ,pickupPointController.getSinglePoint);

router.post("/", authToken,authAdminToken ,pickupPointController.addPoint);

module.exports = router;