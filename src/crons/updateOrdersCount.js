var ProductsOrderIndex = require("../database/models").ProductsOrderIndex
var cron = require('node-cron');

const updateOrdersCount = async () => {
    try {
        
        let result = await ProductsOrderIndex.findOne();

        let newOrdersCount = result.totalOrders + 1

        await ProductsOrderIndex.update({
            totalOrders: newOrdersCount
        },{
            where:{}
        })

        console.log("Orders Count Updated")

        return res.status(200).json({ "statusCode": 200, "data": newOrdersCount })
    }
    catch (error) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}


module.exports = cron.schedule('*/3 * * * *', updateOrdersCount);