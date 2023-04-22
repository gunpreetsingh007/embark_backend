var express = require('express');
const { createBanner, updateBanner } = require('../controllers/banner.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post("/createbanner", validateToken, admin, createBanner);
router.put("/updatebanner", validateToken, admin, updateBanner);

module.exports = router;