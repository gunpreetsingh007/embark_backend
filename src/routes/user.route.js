var express = require('express');
const { getUserDetails, updateUser, getAddresses, createEditAddresses, checkByUsername } = require('../controllers/user.controller');
var router = express.Router();

router.get('/getUserDetails', getUserDetails);
router.post('/updateUser', updateUser);
router.get('/getAddresses/:addressType', getAddresses);
router.post('/createEditAddresses', createEditAddresses);

module.exports = router;