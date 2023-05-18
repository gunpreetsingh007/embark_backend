var express = require('express');
const { getProductsByHierarchies, getProductsByMajorHierarchy, getProductDetails, getProductsInCart, getProductsByFragrance, searchProducts, getAllProducts, editProductAttributeColumn, saveOrderOfProducts, bestSellerProducts, addProductReview, updateProductHierarchy, updateProductGender, getProductsByGender } = require('../controllers/product.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.get("/getProductsByHierarchies", getProductsByHierarchies);
router.get("/getProductsByMajorHierarchy/:name", getProductsByMajorHierarchy);
router.get("/getProductDetails/:name", getProductDetails);
router.get("/bestSellerProducts", bestSellerProducts);
router.post("/getProductsInCart",getProductsInCart);
router.get("/getProductsByFragrance/:name", getProductsByFragrance);
router.get("/searchProducts", searchProducts);
router.get("/getAllProducts", getAllProducts);
router.post("/editProductAttributeColumns", validateToken, admin, editProductAttributeColumn);
router.post("/saveOrderOfProducts", validateToken, admin, saveOrderOfProducts);
router.post("/addProductReview", addProductReview);
router.post("/updateProductHierarchy", validateToken, admin, updateProductHierarchy);
router.post("/updateProductGender",validateToken, admin, updateProductGender);
router.get("/getProductsByGender/:gender", getProductsByGender);


module.exports = router;