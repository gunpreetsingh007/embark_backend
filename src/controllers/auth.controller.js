var User = require('../database/models').User;
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require("sequelize")

const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user.id, role: user.role }, process.env.JWT_SECRET);
    return accessToken
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email.trim() } })
        if (!user) return res.status(400).json({ "statusCode": 400, "errorMessage": "Email or password is incorrect" })
        if (! await bcrypt.compare(password, user.password))
            return res.status(400).json({ "statusCode": 400, "errorMessage": "Email or password is incorrect" })
        else {
            const accessToken = createToken(user)
            return res.status(200).json({ "statusCode": 200, "message": 'Login successful', accessToken, id: user.id, username: user.username })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, password, username, email } = req.body;
        const result = await User.findOne({
            where: {
                email: email.trim()
            },
            raw: true
        })

        if (result) return res.status(400).json({ "statusCode": 400, "message": "Email is already registered" })

        const encryptPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: encryptPassword,
            username: username.trim(),
            email: email.trim(),
            role: 'user'
        })
        const accessToken = createToken(user)
        return res.status(200).json({ "statusCode": 200, "message": "User registration complete", accessToken, id: user.id, username: user.username })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const checkByUsername = async (req, res) => {
    try {
        const username = req.params.username
        const result = await User.findOne({
            where: {
                username: sequelize.literal(`BINARY username = '${username}'`)
            },
            raw: true
        })
        if (!result)
            return res.status(200).json({ "statusCode": 200, usernameExists: false })
        else
            return res.status(200).json({ "statusCode": 200, usernameExists: true })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    login,
    createUser,
    checkByUsername
}