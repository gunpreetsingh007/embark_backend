var express = require('express');
const { validateAndApplyCoupon } = require('../controllers/coupon.controller');
const { validateToken } = require('../middlewares/jwt');
var router = express.Router();

router.post("/validateAndApplyCoupon", validateToken, validateAndApplyCoupon);

module.exports = router;