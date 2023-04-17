const isEqual = require('lodash.isequal');
const moment = require("moment")
var Order = require('../database/models').Order;
var User = require('../database/models').User;
var Product = require('../database/models').Product;
var nodemailer = require('nodemailer');
const { generateOrderPlacedHtml } = require("../../templates/orderPlaced/index.js")

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const createOrder = async (req, res) => {
    try {
        let {addressDetails, selectedList,orderNotes,paymentMethod} = req.body
        let totalItems = selectedList.length
        let orderToken = "EMB" + random(1000000, 9999999)
        let orderStatus = "PROCESSING"
        let orderDetails = []
        let orderAmount = 0
        let orderAmountWithoutDiscount = 0
        let deliveryCharges = 0
        let orderTotalAmount = 0
        let productIds = selectedList.map(item => item.productId)
        let products = await Product.findAll({
            where: {
                id:productIds,
                isActive: true,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
            raw: true
        })
        if(products.length == 0)
        {
            return res.status(500).json({ "errorMessage": "Invalid Products" })
        }

        selectedList = selectedList.map((item)=>{
            let product = products.find((e)=> e.id == item.productId)
            if(!product){
                return res.status(500).json({ "errorMessage": "Invalid Products" })
            }
            let selectedProductVariant = product.productDetails.find(e => isEqual(e.attributeCombination, item.attributeCombination))
            if(!selectedProductVariant){
                return res.status(500).json({ "errorMessage": "Invalid Products" })
            }
            let obj = {
                productName: product.productName,
                attributeCombination: item.attributeCombination,
                count: item.count,
                productDiscountPrice: selectedProductVariant.productDiscountPrice,
                productPrice: selectedProductVariant.productPrice,
                productId: product.id,
                productAttributeId: selectedProductVariant.id
            }
            orderAmount += selectedProductVariant.productDiscountPrice * item.count
            orderAmountWithoutDiscount += selectedProductVariant.productPrice * item.count
            orderDetails.push(obj)
        })

        if(orderAmount < 500){
            deliveryCharges = 50
        }

        orderTotalAmount = orderAmount + deliveryCharges

        let orderPayload = {
            userId: req.currentUser.id,
            addressDetails,
            orderDetails,
            totalItems,
            orderToken,
            orderNotes,
            paymentMethod,
            orderAmount,
            orderAmountWithoutDiscount,
            deliveryCharges,
            orderTotalAmount,
            orderStatus,
            placedAt: moment().utc()
        }

        let orderCreated = await Order.create(orderPayload)

        let user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ["firstName", "lastName"],
            raw: true
        })

        sendEmail(addressDetails,orderDetails,orderAmount,deliveryCharges,orderTotalAmount,orderAmountWithoutDiscount,orderToken, user.firstName, user.lastName)

        return res.status(200).json({ "statusCode": 200, "message": "success" })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getAllOrders = async (req, res) => {
    try {
        
        let allOrders = await Order.findAll({
            raw: true
        });

        return res.status(200).json({ "statusCode": 200, "data": allOrders })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const sendEmail = async (addressDetails, orderDetails, orderAmount, deliveryCharges, orderTotalAmount, orderAmountWithoutDiscount, orderToken, firstName, lastName) => {
    try {
        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const html = generateOrderPlacedHtml(addressDetails, orderDetails, orderAmount, deliveryCharges, orderTotalAmount, orderAmountWithoutDiscount, orderToken, firstName, lastName)

        var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: addressDetails.shippingAddress.email,
            subject: 'Order Placed!',
            html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent');
            }
        });
    }
    catch (err) {
       console.log("Error while sending mail")
    }
}

module.exports = {
    createOrder,
    getAllOrders
}