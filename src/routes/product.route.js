var express = require('express');
const { getProductsByHierarchies, getProductsByMajorHierarchy, getProductDetails, getProductsInCart } = require('../controllers/product.controller');
var router = express.Router();

router.get("/getProductsByHierarchies", getProductsByHierarchies);
router.get("/getProductsByMajorHierarchy/:name", getProductsByMajorHierarchy);
router.get("/getProductDetails/:id", getProductDetails);
router.post("/getProductsInCart",getProductsInCart)


module.exports = router;