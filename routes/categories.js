const express = require("express");
const router = express.Router();
const { authToken, authAdminToken } = require("../middlewares/auth");
const categoryController = require('../controllers/categoryController');

router.get("/", categoryController.catList);

router.get('/single/:shortID', categoryController.singleCategory);

router.post("/", authToken,authAdminToken, categoryController.createCategory);

router.put("/:shortID", authToken,authAdminToken, categoryController.editCategory);

router.delete("/:shortID", authToken , authAdminToken, categoryController.deleteCategory);

module.exports = router;