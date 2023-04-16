
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

module.exports = {
    createBanner,
    updateBanner,
}