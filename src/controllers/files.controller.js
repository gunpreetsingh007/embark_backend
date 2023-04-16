const { v4 } = require('uuid');
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage()
const imageFilter = (req, file, cb) => {
    const fileExt = file.originalname.split('.').pop();
    if (file.mimetype === "image/jpeg" && fileExt==="jpg" ||
        file.mimetype === "image/gif" && fileExt==="gif"  || 
        file.mimetype === "image/jpeg"&& fileExt==="jpeg" ||
        file.mimetype === "image/png" && fileExt==="png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg/png/gif"), false);
    }
}
const imageFilterMulterInstance = multer({ storage: storage, fileFilter: imageFilter });

const uploadFile = async (req, res) => {
    try {
        let file = req.file 
        let fileNameSplit = file.originalname.split(".")
        let extension = fileNameSplit[fileNameSplit.length - 1]
        let fileName = `images/products/${v4()}.${extension}`
        fs.writeFile( fileName, file.buffer, (err) => {
            if (err)
                return res.status(500).json({ "errorMessage": "Something Went Wrong" })
            else {
                return res.status(200).json({ "statusCode": 200, data: fileName })
            }
        });        
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const deleteFile = async (req, res) => {
    try {
        fs.unlink(`images/products/${req.body?.name}`, (err => {
            if (err) return res.status(500).json({ "errorMessage": "Something Went Wrong" })
            else {
                return res.status(200).json({ "statusCode": 200, "message": "success" })
            }
        }));
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}



module.exports = {
    uploadFile,
    deleteFile,
    imageFilterMulterInstance
}