var User = require('../database/models').User;
const { sign, verify } = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require("sequelize")
const { Op } = require("sequelize");
var nodemailer = require('nodemailer');
const { generateForgetPassowrdHTML } = require("../../templates/forgetPassword")

const createToken = (user) => {
    const accessToken = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return accessToken
}

const createForgetToken = (user) => {
    const accessToken = sign({ email: user.email }, process.env.JWT_SECRET,{
        expiresIn: '1h'
   });
    return accessToken
}

const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        const user = await User.findOne({
            // where: { email: email.trim() }
            where: {
                [Op.or]: [
                    { email: emailOrPhone.trim() },
                    { phoneNumber: emailOrPhone.trim() }
                ]
            }
        })
        if (!user) return res.status(400).json({ "statusCode": 400, "errorMessage": "Invalid email or phone number" })
        if (! await bcrypt.compare(password, user.password))
            return res.status(400).json({ "statusCode": 400, "errorMessage": "Password is incorrect" })
        else {
            const accessToken = createToken(user)
            return res.status(200).json({ "statusCode": 200, "message": 'Login successful', accessToken, id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, contact: user.phoneNumber })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, password, phoneNumber, email } = req.body;
        const result = await User.findOne({
            // where: {
            //     email: email.trim()
            // },
            where: {
                [Op.or]: [
                    { email: email.trim() },
                    { phoneNumber: phoneNumber.trim() }
                ]
            },
            raw: true
        })

        if (result) return res.status(400).json({ "statusCode": 400, "errorMessage": "Email or phone number is already registered" })

        const encryptPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: encryptPassword,
            phoneNumber: phoneNumber.trim(),
            email: email.trim(),
            role: 'user'
        })
        const accessToken = createToken(user)
        return res.status(200).json({ "statusCode": 200, "message": "User registration complete", accessToken, id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, contact: user.phoneNumber })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const loginWithGoogle = async (req, res) => {
    try {
        const {email,family_name,given_name} = req.body;
        let user
        const result = await User.findOne({
            where: {
                email: email
            },
            raw: true
        })

        if (result) {
            await User.update(
                {
                  firstName: given_name,
                  lastName: family_name,
                  googleAuth:req.body
                },
                {
                  where: {
                    email: email
                  }
                })
                user = {
                    id: result.id,
                    firstName: given_name,
                    lastName: family_name,
                    phoneNumber: result.phoneNumber,
                    role: result.role,
                    email
                }
        }
        else{
            user = await User.create({
                firstName: given_name,
                lastName: family_name,
                email: email,
                googleAuth: req.body,
                role: 'user'
            },
                { returning: true }).then(JSON.stringify).then(JSON.parse)
        }
        const accessToken = createToken(user)
        return res.status(200).json({ "statusCode": 200, "message": "Login with google is completed", accessToken, id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, contact: user.phoneNumber })
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

const forgetPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({
            where: { email: email.trim() }
        })
        if (!user) return res.status(400).json({ "statusCode": 400, "errorMessage": "Invalid email" })

        const accessToken = createForgetToken(user)

        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let emailHtml = generateForgetPassowrdHTML(accessToken, user.firstName, user.lastName)

        var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Forgot password',
            html: emailHtml,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent');
            }
        });

        return res.status(200).json({ "message": "Reset mail sent to the register mail" })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const verifyforgetToken = async (req, res) => {
    try {
        const { token } = req.body;
        const validToken = verify(token, process.env.JWT_SECRET)
        return res.status(200).json({ "statusCode": 200, data: validToken })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, token } = req.body;

        const validToken = verify(token, process.env.JWT_SECRET)
        
        if(validToken.email != email)
            return res.status(500).json({ "errorMessage": "Invalid email" })
            
        const password = await bcrypt.hash(newPassword, 10)

        await User.update(
            {
                password
            }, {
            where: {
                email
            }
        })
        return res.status(200).json({ "statusCode": 200, "message": "Password reset" })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    login,
    createUser,
    checkByUsername,
    forgetPassword,
    verifyforgetToken,
    resetPassword,
    loginWithGoogle
}