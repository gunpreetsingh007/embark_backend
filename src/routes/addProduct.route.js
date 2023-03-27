var express = require('express');
const { chooseHierarchyInAddProduct, chooseProductAttribute, addProduct, getAllFragrances } = require('../controllers/addProduct.controller');
var router = express.Router();

router.post("/", addProduct)
router.get("/chooseHierarchyInAddProduct", chooseHierarchyInAddProduct);
router.get("/chooseProductAttributes", chooseProductAttribute);
router.get("/getAllFragrances", getAllFragrances)


module.exports = router;