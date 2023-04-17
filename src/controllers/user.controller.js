var User = require('../database/models').User;
var Address = require('../database/models').Address;
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.currentUser.id },
            attributes: ["firstName", "lastName", "username", "email"],
            raw: true
        })
        return res.status(200).json({ "statusCode": 200, user })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, currentPassword, username, email, newPassword } = req.body;
        let encryptPassword
        if (newPassword) {
            const user = await User.findOne({ where: { id: req.currentUser.id}, raw: true })
            if (! await bcrypt.compare(currentPassword, user.password))
                return res.status(400).json({ "statusCode": 400, "message": "Password is incorrect" })
            else {
                encryptPassword = await bcrypt.hash(newPassword, 10)
            }
        }

        const result = await User.findOne({
            where: {
                email: email.trim(),
                id: {
                    [Op.ne]: req.currentUser.id
                }
            },
            raw: true
        })

        if (result) return res.status(400).json({ "statusCode": 400, "message": "Email is already registered" })

        if (encryptPassword) {
            await User.update(
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.trim(),
                    email: email.trim(),
                    password: encryptPassword
                }, {
                where: {
                    id: req.currentUser.id
                }
            })
        }
        else {
            await User.update(
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.trim(),
                    email: email.trim(),
                }, {
                where: {
                    id: req.currentUser.id
                }
            })
        }

        return res.status(200).json({ "statusCode": 200, "message": "User changes are updated" })
    } catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getAddresses = async (req, res) => {
    try {

        let addresses = await Address.findAll({
            where: { userId: req.currentUser.id },
            raw: true
        })

        return res.status(200).json({ "statusCode": 200, data: addresses })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const createEditAddresses = async (req, res) => {
    try {
        const { id, firstName, lastName, companyName, gstNumber, country, email, state, streetAddress, city, apartmentAddress, postcode, phone, addressType } = req.body;

        if (id) {
            await Address.update(
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    companyName: companyName.trim(),
                    gstNumber: gstNumber.trim(),
                    email: email.trim(),
                    country: country.trim(),
                    state: state.trim(),
                    streetAddress: streetAddress.trim(),
                    city: city.trim(),
                    apartment: apartmentAddress.trim(),
                    pincode: postcode.trim(),
                    contact: phone.trim()
                }, {
                where: {
                    id
                }
            })
            return res.status(200).json({ "statusCode": 200, "message": "Address is updated" })
        }
        else {
            await Address.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                companyName: companyName.trim(),
                gstNumber: gstNumber.trim(),
                email: email.trim(),
                country: country.trim(),
                state: state.trim(),
                streetAddress: streetAddress.trim(),
                city: city.trim(),
                apartment: apartmentAddress.trim(),
                pincode: postcode.trim(),
                contact: phone.trim(),
                addressType,
                userId: req.currentUser.id
            })
            return res.status(200).json({ "statusCode": 200, "message": "Address is saved" })
        }
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}


const getAddressById = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(500).json({ "errorMessage": "Id is not provided" })
        }

        let address = await Address.findOne({
            where: { id: req.params.id },
            raw: true
        })

        return res.status(200).json({ "statusCode": 200, data: address })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    getUserDetails,
    updateUser,
    getAddresses,
    createEditAddresses,
    getAddressById
}