const isEqual = require('lodash.isequal');
const moment = require("moment")
var Order = require('../database/models').Order;
var User = require('../database/models').User;
var Product = require('../database/models').Product;
var nodemailer = require('nodemailer');
const { generateOrderPlacedHtml } = require("../../templates/orderPlaced/index.js")
const Razorpay = require('razorpay');
const crypto = require("crypto")
const Axios = require("../controllers/api/Axios")
var razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
const axios = new Axios();

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

        pushOrderToShipRocket(orderCreated)

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
                productAttributeId: selectedProductVariant.id,
                productImage: selectedProductVariant.pictureUrl,
                refNumber: selectedProductVariant.refNumber
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

            pushOrderToShipRocket(orderCreated)
    
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

const pushOrderToShipRocket = async (order) => {
    try {
        let payload = {
            "order_id": order.id,
            "order_date": moment(order.placedAt).utc().format("YYYY-MM-DD HH:mm"),
            "pickup_location": "Embark Taloja Warehouse",
            "channel_id": process.env.SHIPROCKET_CHANNEL_ID,
            "comment": "",
            "billing_customer_name": order.addressDetails?.billingAddress?.firstName,
            "billing_last_name": order.addressDetails?.billingAddress?.lastName,
            "billing_address": order.addressDetails?.billingAddress?.streetAddress,
            "billing_address_2": order.addressDetails?.billingAddress?.apartment,
            "billing_city": order.addressDetails?.billingAddress?.city,
            "billing_pincode": order.addressDetails?.billingAddress?.pincode,
            "billing_state": order.addressDetails?.billingAddress?.state,
            "billing_country": order.addressDetails?.billingAddress?.country,
            "billing_email": order.addressDetails?.billingAddress?.email,
            "billing_phone": order.addressDetails?.billingAddress?.contact,
            "shipping_is_billing": isEqual(order?.addressDetails?.billingAddress, order?.addressDetails?.shippingAddress),
            "payment_method": order?.paymentMethod == "COD" ? "COD" : "Prepaid",
            // "shipping_charges": order?.deliveryCharges,
            // "giftwrap_charges": 0,
            // "transaction_charges": 0,
            // "total_discount": order?.orderAmountWithoutDiscount - order?.orderAmount,
            "sub_total": order?.orderAmount,
            "length": 27,
            "breadth": 15,
            "height": 10,
            "weight": 0.5        }
        if (!isEqual(order?.addressDetails?.billingAddress, order?.addressDetails?.shippingAddress)) {
            payload["shipping_customer_name"] = order.addressDetails?.shippingAddress?.firstName
            payload["shipping_last_name"] = order.addressDetails?.shippingAddress?.lastName
            payload["shipping_address"] = order.addressDetails?.shippingAddress?.streetAddress
            payload["shipping_address_2"] = order.addressDetails?.shippingAddress?.apartment
            payload["shipping_city"] = order.addressDetails?.shippingAddress?.city
            payload["shipping_pincode"] = order.addressDetails?.shippingAddress?.pincode
            payload["shipping_country"] = order.addressDetails?.shippingAddress?.country
            payload["shipping_state"] = order.addressDetails?.shippingAddress?.state
            payload["shipping_email"] = order.addressDetails?.shippingAddress?.email
            payload["shipping_phone"] = order.addressDetails?.shippingAddress?.contact
        }
        let order_items = []
        let i=1
        for (let product of order?.orderDetails) {
            let obj = {}
            obj.name = product.productName
            obj.sku = product.refNumber || i
            obj.units = product.count
            obj.selling_price = product.productDiscountPrice
            order_items.push(obj)
            i += 1
        }
        payload["order_items"] = order_items
        let options = {
            method: "POST",
            body: payload
        }
        let result = await axios.callApi("orders/create/adhoc", options)
        if (result.status == 200) {
            let updatedOrder = await Order.update({
                shiprocketOrderId: result.data?.order_id
            }, {
                where: {
                    id: order.id
                }
            })
            return "success"
        }
        else {
            return "failure"
        }
    }
    catch {
        return "failure"
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    paymentVerificationAndCreateOrder
}