
var Popup = require('../database/models').Popup;

const createPopup = async (req, res) => {
    try {
        let payload = req.body 
        let createdPopup =  await Popup.create(payload)      
        return res.status(200).json({ "statusCode": 200, data: createdPopup })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const updatePopup = async (req, res) => {
    try {
        let payload = req.body 
        let id = payload.id 
        delete payload.id
        let updatedPopup =  await Popup.update(payload,{
            where: {
                id
            }
        })      
        return res.status(200).json({ "statusCode": 200, data: updatedPopup })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getPopupById = async (req, res) => {
    try {
        let popup = await Popup.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })
        if(!popup){
            return res.status(500).json({ "errorMessage": "Invalid Id" })
        }     
        return res.status(200).json({ "statusCode": 200, data: popup })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getAllPopups = async (req, res) => {
    try {
        let popups = await Popup.findAll({
            order: [["minimumAmount", "ASC"]],
            raw: true
        })  
        return res.status(200).json({ "statusCode": 200, data: popups })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    createPopup,
    updatePopup,
    getPopupById,
    getAllPopups
}