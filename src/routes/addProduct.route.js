var express = require('express');
const { chooseHierarchyInAddProduct, chooseProductAttribute, addProduct, updateProduct } = require('../controllers/addProduct.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post("/",validateToken,admin, addProduct)
router.put("/",validateToken,admin, updateProduct)
router.get("/chooseHierarchyInAddProduct", chooseHierarchyInAddProduct);
router.get("/chooseProductAttributes", chooseProductAttribute);


module.exports = router;