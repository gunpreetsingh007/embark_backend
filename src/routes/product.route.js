var express = require('express');
const { getProductsByHierarchies, getProductsByMajorHierarchy, getProductDetails, getProductsInCart, getProductsByFragrance, searchProducts, getAllProducts, editProductAttributeColumn, saveOrderOfProducts, bestSellerProducts, addProductReview } = require('../controllers/product.controller');
var router = express.Router();

router.get("/getProductsByHierarchies", getProductsByHierarchies);
router.get("/getProductsByMajorHierarchy/:id", getProductsByMajorHierarchy);
router.get("/getProductDetails/:id", getProductDetails);
router.get("/bestSellerProducts", bestSellerProducts);
router.post("/getProductsInCart",getProductsInCart)
router.get("/getProductsByFragrance/:id", getProductsByFragrance);
router.get("/searchProducts", searchProducts);
router.get("/getAllProducts", getAllProducts);
router.post("/editProductAttributeColumns", editProductAttributeColumn);
router.post("/saveOrderOfProducts", saveOrderOfProducts);
router.post("/addProductReview", addProductReview)


module.exports = router;