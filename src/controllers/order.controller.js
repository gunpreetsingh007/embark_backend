const isEqual = require('lodash.isequal');
const moment = require("moment")
var Order = require('../database/models').Order;
var User = require('../database/models').User;
var Product = require('../database/models').Product;
var nodemailer = require('nodemailer');
const { generateOrderPlacedHtml } = require("../../templates/orderPlaced/index.js")
const Razorpay = require('razorpay');
const crypto = require("crypto")
var razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const createOrder = async (req, res) => {
    try {
        
        let orderPayload = await generateOrderObject(req, req.body)

        if(req.body.paymentMethod == "RAZORPAY"){
            const options = {
                amount: Number(orderPayload.orderTotalAmount * 100),
                currency: "INR",
            };
            const order = await razorpayInstance.orders.create(options);
            return res.status(200).json({ "statusCode": 200, "data": order })
        }

        let orderCreated = await Order.create(orderPayload)

        let user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ["firstName", "lastName"],
            raw: true
        })

        sendEmail(orderPayload.addressDetails,orderPayload.orderDetails,orderPayload.orderAmount,orderPayload.deliveryCharges,orderPayload.orderTotalAmount,orderPayload.orderAmountWithoutDiscount,orderPayload.orderToken, user.firstName, user.lastName)

        return res.status(200).json({ "statusCode": 200, "message": "success" })
    }
    catch (error) {
        console.log(error)
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

const generateOrderObject = async (req, payload, razorpayDetails=null)=>{
   try{
        let {addressDetails, selectedList,orderNotes,paymentMethod} = payload
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
            throw err
        }

        selectedList = selectedList.map((item)=>{
            let product = products.find((e)=> e.id == item.productId)
            if(!product){
                throw err
            }
            let selectedProductVariant = product.productDetails.find(e => isEqual(e.attributeCombination, item.attributeCombination))
            if(!selectedProductVariant){
                throw err
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

        return {
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
            razorpayDetails,
            placedAt: moment().utc()
        }
   }
   catch(err){
       throw err
   }
}

const paymentVerificationAndCreateOrder = async (req, res) => {
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payload } =
            req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database comes here

            let orderPayload = await generateOrderObject(req, payload, {razorpay_order_id, razorpay_payment_id, razorpay_signature})

            let orderCreated = await Order.create(orderPayload)

            let user = await User.findOne({
                where: {
                    id: req.currentUser.id
                },
                attributes: ["firstName", "lastName"],
                raw: true
            })
    
            sendEmail(orderPayload.addressDetails,orderPayload.orderDetails,orderPayload.orderAmount,orderPayload.deliveryCharges,orderPayload.orderTotalAmount,orderPayload.orderAmountWithoutDiscount,orderPayload.orderToken, user.firstName, user.lastName)
    
            return res.status(200).json({ "statusCode": 200, "message": "success" })

        } else {
            return res.status(500).json({ "errorMessage": "Something Went Wrong" })
        }
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
    getAllOrders,
    paymentVerificationAndCreateOrder
}