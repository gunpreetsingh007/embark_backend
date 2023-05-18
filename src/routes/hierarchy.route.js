var express = require('express');
const { getMajorCategories, getHierarchyTreeByName, getHierarchyDetailsByName, getAllFragrances } = require('../controllers/hierarchy.controller');
var router = express.Router();

router.get("/getMajorCategories", getMajorCategories);
router.get("/getHierarchyTreeByName/:name", getHierarchyTreeByName);
router.get("/getHierarchyDetailsByName/:name", getHierarchyDetailsByName);
router.get("/getAllFragrances", getAllFragrances)


module.exports = router;