const express = require("express");
const router = express.Router();
const { authToken, authAdminToken } = require("../middlewares/auth");
const productController = require('../controllers/productController')

router.get("/", productController.productsList);

router.get("/basicData", productController.basicDataList);

router.get("/basicData/:categoryId", productController.byCategoryIdList);

router.get("/count", productController.productsAmount);

router.get('/search', productController.search);

router.get('/search/amount', productController.amountOfResultSearch);

router.get('/single/:id', productController.singleProduct);

router.get('/singlebyName', productController.singleByNameAndColor);

router.get('/ListByNameAndColor', productController.ListByNameAndColor);

router.post("/", authToken,authAdminToken ,productController.createProduct);

router.delete("/:id", authToken,authAdminToken , productController.deleteProduct);

router.put("/delOneImage/:id/:indx", authToken,authAdminToken , productController.deleteOneImage);

router.put("/:id", authToken,authAdminToken, productController.editProduct);

router.put("/editMany/:id", authToken,authAdminToken, productController.editManyProduct);

router.put("/upload/:editId", authToken,authAdminToken ,productController.upload);

module.exports = router;
