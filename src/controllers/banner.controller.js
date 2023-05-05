
var Banner = require('../database/models').Banner;

const createBanner = async (req, res) => {
    try {
        let payload = req.body 
        let createdBanner =  await Banner.create(payload)      
        return res.status(200).json({ "statusCode": 200, data: createdBanner })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const updateBanner = async (req, res) => {
    try {
        let payload = req.body 
        let id = payload.id 
        delete payload.id
        let updatedbanner =  await Banner.update(payload,{
            where: {
                id
            }
        })      
        return res.status(200).json({ "statusCode": 200, data: updatedbanner })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getAllBanners = async (req, res) => {
    try {
        let banners = await Banner.findAll({
            raw: true
        });    
        return res.status(200).json({ "statusCode": 200, data: banners })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getBannerDetails = async (req, res) => {
    try {
        let banner = await Banner.findOne({
            where: {
              id: req.params.id
            },
            raw: true
        })
        if(!banner){
            return res.status(500).json({ "errorMessage": "Invalid Id" })
        }   
        return res.status(200).json({ "statusCode": 200, data: banner })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    createBanner,
    updateBanner,
    getAllBanners,
    getBannerDetails
}