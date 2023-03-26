var express = require('express');
const { uploadFile, deleteFile, imageFilterMulterInstance } = require('../controllers/files.controller');
var router = express.Router();

router.post("/uploadFile", imageFilterMulterInstance.single("productImage") , uploadFile);
router.delete("/deleteFile", deleteFile);


module.exports = router;