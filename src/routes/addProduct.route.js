var express = require('express');
const { chooseHierarchyInAddProduct, chooseProductAttribute, addProduct } = require('../controllers/addProduct.controller');
var router = express.Router();

router.post("/", addProduct)
router.get("/chooseHierarchyInAddProduct", chooseHierarchyInAddProduct);
router.get("/chooseProductAttributes", chooseProductAttribute);


module.exports = router;