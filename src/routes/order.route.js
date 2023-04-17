var express = require('express');
const { createOrder, getAllOrders } = require('../controllers/order.controller');
const { validateToken } = require('../middlewares/jwt');
var router = express.Router();

router.post('/createOrder', validateToken , createOrder);
router.get('/getAllOrders', validateToken , getAllOrders);

module.exports = router;