const express = require("express");
const router = express.Router();
const { authToken, authAdminToken } = require("../middlewares/auth");
const productController = require('../controllers/productController')

router.get("/", productController.productsList);

router.get("/count", productController.productsAmount);

router.get('/single/:id', productController.singleProduct);

router.post("/", authToken,authAdminToken ,productController.createProduct);

router.delete("/:id", authToken,authAdminToken , productController.deleteProduct);

router.put("/:id", authToken,authAdminToken, productController.editProduct);

module.exports = router;
