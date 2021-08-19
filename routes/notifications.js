const express = require("express");
const notController = require('../controllers/notController');
const { authToken, authAdminToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/myNot",authToken, authAdminToken, notController.getNotifications);

router.put("/isReadTrue/:id",authToken, authAdminToken, notController.isReadTrue);

module.exports = router;