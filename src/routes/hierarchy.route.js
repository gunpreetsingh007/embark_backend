var express = require('express');
const { getMajorCategories, getHierarchyTreeByRootName } = require('../controllers/hierarchy.controller');
var router = express.Router();

router.get("/getMajorCategories", getMajorCategories);
router.get("/getHierarchyTreeByRootName/:name", getHierarchyTreeByRootName);


module.exports = router;