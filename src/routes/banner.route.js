var express = require('express');
const { createBanner, updateBanner, getAllBanners, getBannerDetails } = require('../controllers/banner.controller');
const { validateToken } = require('../middlewares/jwt');
const { admin } = require('../middlewares/admin');
var router = express.Router();

router.post("/createbanner", validateToken, admin, createBanner);
router.put("/updatebanner", validateToken, admin, updateBanner);
router.get("/getAllBanners", getAllBanners);
router.get("/getBannerDetails/:id", validateToken, admin, getBannerDetails);

module.exports = router;