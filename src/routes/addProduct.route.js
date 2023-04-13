var express = require('express');
const { chooseHierarchyInAddProduct, chooseProductAttribute, addProduct, updateProduct } = require('../controllers/addProduct.controller');
var router = express.Router();

router.post("/", addProduct)
router.put("/", updateProduct)
router.get("/chooseHierarchyInAddProduct", chooseHierarchyInAddProduct);
router.get("/chooseProductAttributes", chooseProductAttribute);


module.exports = router;