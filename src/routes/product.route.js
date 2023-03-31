var express = require('express');
const { getProductsByHierarchies, getProductsByMajorHierarchy, getProductDetails, getProductsInCart, getProductsByFragrance } = require('../controllers/product.controller');
var router = express.Router();

router.get("/getProductsByHierarchies", getProductsByHierarchies);
router.get("/getProductsByMajorHierarchy/:id", getProductsByMajorHierarchy);
router.get("/getProductDetails/:id", getProductDetails);
router.post("/getProductsInCart",getProductsInCart)
router.get("/getProductsByFragrance/:id", getProductsByFragrance);


module.exports = router;