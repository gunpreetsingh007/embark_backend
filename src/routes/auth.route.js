var express = require('express');
const { login, createUser, checkByUsername } = require('../controllers/auth.controller');
var router = express.Router();

router.post('/login', login);
router.post("/createUser", createUser);
router.get("/checkByUsername/:username", checkByUsername)

module.exports = router;