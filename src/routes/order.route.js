var express = require('express');
const { createOrder, getOrders, paymentVerificationAndCreateOrder, getOrderById, bulkUpdateOrderStatus, getOrdersCount } = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post('/createOrder', validateToken , createOrder);
router.get('/getOrders', validateToken ,admin, getOrders);
router.get('/getOrdersCount', getOrdersCount);
router.get('/getOrderById/:id', validateToken ,admin, getOrderById);
router.post('/bulkUpdateOrderStatus', validateToken ,admin, bulkUpdateOrderStatus);
router.post('/paymentVerificationAndCreateOrder', validateToken, paymentVerificationAndCreateOrder);

module.exports = router;