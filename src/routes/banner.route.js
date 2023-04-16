var express = require('express');
const { createBanner, updateBanner } = require('../controllers/banner.controller');
var router = express.Router();

router.post("/createbanner", createBanner);
router.put("/updatebanner", updateBanner);

module.exports = router;