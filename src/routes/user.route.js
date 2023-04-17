var express = require('express');
const { getUserDetails, updateUser, getAddresses, createEditAddresses, getAddressById, createOrder } = require('../controllers/user.controller');
var router = express.Router();

router.get('/getUserDetails', getUserDetails);
router.post('/updateUser', updateUser);
router.get('/getAddresses', getAddresses);
router.get('/getAddressById/:id', getAddressById);
router.post('/createEditAddresses', createEditAddresses);

module.exports = router;