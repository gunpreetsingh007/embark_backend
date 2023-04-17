var express = require('express');
const { createOrder, getAllOrders, paymentVerificationAndCreateOrder } = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/jwt');
var router = express.Router();

router.post('/createOrder', validateToken , createOrder);
router.get('/getAllOrders', validateToken , getAllOrders);
router.post('/paymentVerificationAndCreateOrder', validateToken, paymentVerificationAndCreateOrder);

module.exports = router;