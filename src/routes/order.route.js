var express = require('express');
const { createOrder, getOrders, paymentVerificationAndCreateOrder } = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post('/createOrder', validateToken , createOrder);
router.get('/getOrders', validateToken ,admin, getOrders);
router.post('/paymentVerificationAndCreateOrder', validateToken, paymentVerificationAndCreateOrder);

module.exports = router;