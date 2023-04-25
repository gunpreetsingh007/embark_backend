const isEqual = require('lodash.isequal');
const moment = require("moment")
var Order = require('../database/models').Order;
var User = require('../database/models').User;
var Product = require('../database/models').Product;
var nodemailer = require('nodemailer');
const { generateOrderPlacedHtml } = require("../../templates/orderPlaced/index.js")
const Razorpay = require('razorpay');
const crypto = require("crypto")
const Axios = require("../controllers/api/Axios");
const { generateMaharashtraInvoiceHtml } = require('../../templates/invoices/maharashtra_invoice');
var razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
const axios = new Axios();
const puppeteer = require('puppeteer');
const { v4 } = require('uuid');
const { generateOutsideMaharashtraInvoiceHtml } = require('../../templates/invoices/outside_maharashtra_invoice');
const ProductsOrderIndex = require('../database/models').ProductsOrderIndex

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const createOrder = async (req, res) => {
    let orderCreated
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

        orderCreated = await Order.create(orderPayload, {returning: true}).then(JSON.stringify).then(JSON.parse)

        let updatedOrderWithToken = await Order.update({
            orderToken: orderCreated.orderToken + orderCreated.id
        },{
            where: {
                id: orderCreated.id
            }
        })

        orderCreated.orderToken = orderCreated.orderToken + orderCreated.id

        let user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: ["firstName", "lastName"],
            raw: true
        })

        await pushOrderToShipRocket(orderCreated)
        
        sendEmail(orderCreated, user.firstName, user.lastName)

        return res.status(200).json({ "statusCode": 200, "message": "success" })
    }
    catch (error) {
        console.log(error)
        if(orderCreated){
            await Order.update({
                orderStatus: "FAILED",
                failureReason: error.message
            },{
                where: {
                    id: orderCreated.id
                }
            })
        }
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getOrders = async (req, res) => {
    try {
        
        const { start, end, type } = req.query

        if(type && !["PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "FAILED", "ON HOLD"].includes(type)){
            return res.status(500).json({ "errorMessage": "Invalid Status Type" })
        }

        const queryOptions = type ? {
            placedAt: {
                $gte: start ? moment(parseInt(start)) : moment().startOf("day"),
                $lte: end ? moment(parseInt(end)) : moment().endOf("day")
            },
            orderStatus: type
        } : {
            placedAt: {
                $gte: start ? moment(parseInt(start)) : moment().startOf("day"),
                $lte: end ? moment(parseInt(end)) : moment().endOf("day")
            }
        }

        let allOrders = await Order.findAll({
            where: queryOptions,
            order: [["id", "DESC"]],
            raw: true
        });

        return res.status(200).json({ "statusCode": 200, "data": allOrders })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getOrderById = async (req, res) => {
    try {
        
        const { id } = req.params

        if(!id){
            return res.status(500).json({ "errorMessage": "Id is not provided" })
        }

        const queryOptions = {
            id
        }

        let order = await Order.findOne({
            where: queryOptions,
            attributes: ["addressDetails", "orderDetails","placedAt","orderStatus","paymentMethod","orderToken","orderAmount","orderTotalAmount","deliveryCharges"],
            raw: true
        });

        if(!order){
            return res.status(500).json({ "errorMessage": "No order found with the given id" }) 
        }

        return res.status(200).json({ "statusCode": 200, "data": order })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const bulkUpdateOrderStatus = async (req, res) => {
    try {
        
        const { ids, status } = req.body
        
        if( !Array.isArray(ids) || ids.length == 0 || !status || !["PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "FAILED", "ON HOLD"].includes(status)){
            return res.status(500).json({ "errorMessage": "Please provide correct payload" })
        }

        await Order.update({
            orderStatus: status
        },{
            where: {
                id: ids
            }
        })

        return res.status(200).json({ "statusCode": 200, "message": "Updated Successfully" })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getOrdersCount = async (req, res) => {
    try {
        
        let result = await ProductsOrderIndex.findOne();

        return res.status(200).json({ "statusCode": 200, "data": result.totalOrders })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const generateOrderObject = async (req, payload, razorpayDetails=null)=>{
   try{
        let {addressDetails, selectedList,orderNotes,paymentMethod} = payload
        let oldOrdersCount = await Order.count({
            where: {
                userId: req.currentUser.id
            },
            raw: true
        })
        let productOrderIndexResult = await ProductsOrderIndex.findOne();

        let newOrdersCount = productOrderIndexResult.totalOrders + 1

        await ProductsOrderIndex.update({
            totalOrders: newOrdersCount
        },{
            where:{}
        })
        let purchaseCount = oldOrdersCount + 1
        let totalItems = selectedList.length
        let orderToken = "EMB" + random(10000, 99999)
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
            throw new Error("Error in generate Order Object")
        }

        selectedList = selectedList.map((item)=>{
            let product = products.find((e)=> e.id == item.productId)
            if(!product){
                throw new Error("Error in generate Order Object")
            }
            let selectedProductVariant = product.productDetails.find(e => isEqual(e.attributeCombination, item.attributeCombination))
            if(!selectedProductVariant){
                throw new Error("Error in generate Order Object")
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
                refNumber: selectedProductVariant.refNumber,
                hsnNumber: product.hsnNumber
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
            purchaseCount,
            placedAt: moment().utc()
        }
   }
   catch(err){
       throw err
   }
}

const paymentVerificationAndCreateOrder = async (req, res) => {
    let orderCreated
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

            orderCreated = await Order.create(orderPayload, {returning: true}).then(JSON.stringify).then(JSON.parse)

            let updatedOrderWithToken = await Order.update({
                orderToken: orderCreated.orderToken + orderCreated.id
            },{
                where: {
                    id: orderCreated.id
                }
            })
    
            orderCreated.orderToken = orderCreated.orderToken + orderCreated.id

            let user = await User.findOne({
                where: {
                    id: req.currentUser.id
                },
                attributes: ["firstName", "lastName"],
                raw: true
            })
    
            await pushOrderToShipRocket(orderCreated)
            
            sendEmail(orderCreated, user.firstName, user.lastName)
    
            return res.status(200).json({ "statusCode": 200, "message": "success" })

        } else {
            return res.status(500).json({ "errorMessage": "Something Went Wrong" })
        }
    }
    catch (error) {
        if(orderCreated){
            await Order.update({
                orderStatus: "FAILED",
                failureReason: error.message
            },{
                where: {
                    id: orderCreated.id
                }
            })
        }
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const sendEmail = async (order, firstName, lastName) => {
    try {
        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let invoiceHtml

        if(order.addressDetails.shippingAddress.state.toLowerCase() == "maharashtra"){
            invoiceHtml = generateMaharashtraInvoiceHtml(order)           
        }
        else{
            invoiceHtml = generateOutsideMaharashtraInvoiceHtml(order)
        }

        let emailHtml = generateOrderPlacedHtml(order, firstName, lastName)

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser'
        });

        const page = await browser.newPage();

        await page.setContent(invoiceHtml, { waitUntil: 'domcontentloaded' });

        await page.emulateMediaType('screen');

        const elem = await page.$("html"); 
        const boundingBox = await elem.boundingBox(); 
        const pdfName = v4();

        const pdf = await page.pdf({
            path: `invoices/${pdfName}.pdf`,
            margin: { right: '30px', left: '30px' },
            printBackground: true,
            height: `${boundingBox.height}px`,
        });

        await browser.close();

        await Order.update({
            invoiceId: pdfName
        },{
            where: {
                id: order.id
            }
        })

        var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: order.addressDetails.shippingAddress.email,
            subject: 'Order Placed!',
            html: emailHtml,
            attachments: [
                {
                    filename: 'invoice.pdf',
                    path: `invoices/${pdfName}.pdf`
                }
            ]
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
       console.log(err)
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
            // "billing_address_2": order.addressDetails?.billingAddress?.apartment,
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
            // payload["shipping_address_2"] = order.addressDetails?.shippingAddress?.apartment
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
            throw new Error("pushOrderToShipRocket failure")
        }
    }
    catch(err) {
        throw err
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    bulkUpdateOrderStatus,
    paymentVerificationAndCreateOrder,
    getOrdersCount
}