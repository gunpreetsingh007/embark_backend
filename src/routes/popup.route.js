var express = require('express');
const { createPopup, updatePopup, getPopupById, getAllPopups } = require('../controllers/popup.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post("/createPopup", validateToken, admin, createPopup);
router.put("/updatePopup", validateToken, admin, updatePopup);
router.get("/getPopupById/:id", validateToken, admin, getPopupById);
router.get("/getAllPopups", validateToken, admin, getAllPopups);

module.exports = router;