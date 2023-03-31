var express = require('express');
const { getMajorCategories, getHierarchyTreeById, getHierarchyDetailsById, getAllFragrances } = require('../controllers/hierarchy.controller');
var router = express.Router();

router.get("/getMajorCategories", getMajorCategories);
router.get("/getHierarchyTreeById/:id", getHierarchyTreeById);
router.get("/getHierarchyDetailsById/:id", getHierarchyDetailsById);
router.get("/getAllFragrances", getAllFragrances)


module.exports = router;