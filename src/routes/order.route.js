var express = require('express');
const { createOrder, getOrders, paymentVerificationAndCreateOrder } = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/jwt');
var router = express.Router();

router.post('/createOrder', validateToken , createOrder);
router.get('/getOrders', validateToken , getOrders);
router.post('/paymentVerificationAndCreateOrder', validateToken, paymentVerificationAndCreateOrder);

module.exports = router;