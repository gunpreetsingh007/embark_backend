var express = require('express');
const { login, createUser, checkByUsername, forgetPassword, verifyforgetToken, resetPassword, loginWithGoogle } = require('../controllers/auth.controller');
var router = express.Router();

router.post('/login', login);
router.post("/loginWithGoogle",loginWithGoogle)
router.post("/createUser", createUser);
router.get("/checkByUsername/:username", checkByUsername)
router.post('/forgetPassword', forgetPassword);
router.post('/verifyForgetToken', verifyforgetToken)
router.post('/resetPassword', resetPassword)
module.exports = router;