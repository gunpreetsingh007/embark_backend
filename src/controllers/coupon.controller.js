const moment = require('moment/moment');

var Coupon = require('../database/models').Coupon;
var CouponAssignment = require('../database/models').CouponAssignment;

const validateAndApplyCoupon = async (req, res) => {
    try {
        const { couponCode, selectedList } = req.body
        let coupon = await Coupon.findOne({
            where: {
                couponName: couponCode,
                isDeleted: false
            },
            raw: true
        })
        if(!coupon){
            return res.status(500).json({ "errorMessage": "Invalid Coupon" })
        }
        if(moment().isAfter(coupon.expiryDate)){
            return res.status(500).json({ "errorMessage": "This Coupon has been expired" })
        }
        if(coupon.isValidOneTime){
            let couponAssignment = await CouponAssignment.findOne({
                where: {
                    couponId: coupon.id,
                    userId: req.currentUser.id
                },
                raw: true
            })
            if(couponAssignment){
                return res.status(500).json({ "errorMessage": "This Coupon has been used" })
            }
        }
        if(coupon.products && coupon.products.length){
            let couponProductIncluded = false
            selectedList.every(product => {
                let productFound = coupon.products.find((e)=> e.productId == product.productId)
                if(productFound && productFound.productVariantId == product.productVariantId){
                    if(product.count == 2){
                        return res.status(500).json({ "errorMessage": "This Coupon is only valid for single unit of this product" })
                    }
                    couponProductIncluded = true
                    return false
                }
                return true
            })
            if(!couponProductIncluded){
                return res.status(500).json({ "errorMessage": "This Coupon is not applicable for this purchase" })
            }
        }
        return res.status(200).json({ "statusCode": 200, data: coupon })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

module.exports = {
    validateAndApplyCoupon
}