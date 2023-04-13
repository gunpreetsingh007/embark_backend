var Hierarchy = require('../database/models').Hierarchy;
var Product = require("../database/models").Product
var Fragrance = require("../database/models").Fragrance
const sequelize = require("sequelize");
var ProductsOrderIndex = require('../database/models').ProductsOrderIndex;


const getProductsByHierarchies = async (req, res) => {
    try {
        let hierarchy = req.query.hierarchyIds;
        if(!hierarchy){
            return res.status(500).json({ "errorMessage": "Hierarchy Ids are not provided" })
        }
        let hierarchies = hierarchy.split(",")
        let result = []
        let products = await Product.findAll({
            where: {
                hierarchyId: hierarchies,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })

        let orderIndexRes = await ProductsOrderIndex.findOne()
        orderIndexRes = orderIndexRes.productsOrderJson

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ "statusCode": 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getProductsByMajorHierarchy = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ "errorMessage": "No Id provided" })
        }
        let selectedHierarchy = await Hierarchy.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        if (!selectedHierarchy) {
            return res.status(500).json({ "errorMessage": "Wrong Id provided" })
        }
        let hierarchyIds = []
        let childHierarchies = await Hierarchy.findAll({
            where: {
                parentId: selectedHierarchy.id,
                isDeleted: false
            },
            attributes: ["id","hierarchyName"],
            raw: true
        })
        if (childHierarchies.length == 0) {
            return res.status(500).json({ "errorMessage": "No Child Hierarchies found" })
        }

        for (let i = 0; i < childHierarchies.length; i++) {
           hierarchyIds = [ ...hierarchyIds, ...await getChildHierarchiesIds(childHierarchies, i, [])]
        }

        let result = []

        let products = await Product.findAll({
            where: {
                hierarchyId: hierarchyIds,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })

        let orderIndexRes = await ProductsOrderIndex.findOne()
        orderIndexRes = orderIndexRes.productsOrderJson

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }

}

const getProductDetails = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ "errorMessage": "No Id provided" })
        }
        let product = await Product.findOne({
            where: {
                id:req.params.id,
                isDeleted: false
            },
            include: [{
                model: Hierarchy,
                attributes: ["hierarchyName", "id"]
            },
            {
                model: Fragrance,
                attributes: ["fragranceName", "id"]
            }],
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })
        if(!product)
        {
            return res.status(500).json({ "errorMessage": "Invalid Id" })
        }

        return res.status(200).json({ statusCode: 200, data: product })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }

}

const getProductsInCart = async (req, res) => {
    try {
        if ( !Array.isArray(req.body) && req.body.length == 0 ) {
            return res.status(500).json({ "errorMessage": "Cart Items are required" })
        }
        let cartItems = req.body
        let productIds = cartItems.map(item => item.productId)
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
            return res.status(500).json({ "errorMessage": "No Products Found" })
        }

        cartItems = cartItems.map((item)=>{
            let product = products.find((e)=> e.id == item.productId)
            item.productDetails = product.productDetails
            item.productName = product.productName
            return item
        })

        return res.status(200).json({ statusCode: 200, data: cartItems })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }

}

const getChildHierarchiesIds = async (hierarchyArray, index, hierarchyIdsArr) => {


    let hierarchies = await Hierarchy.findAll({
        where: {
            parentId: hierarchyArray[index].id,
            isDeleted: false
        },
        attributes: ["id", "hierarchyName"],
        raw: true
    })

    if (!hierarchies.length) {
        hierarchyIdsArr = [...hierarchyIdsArr, hierarchyArray[index].id]
        return hierarchyIdsArr
    }

    for (let i = 0; i < hierarchies.length; i++) {
        hierarchyIdsArr = [...hierarchyIdsArr, ...await getChildHierarchiesIds(hierarchies, i, [])]
    }

    return hierarchyIdsArr

}

const getProductsByFragrance = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(500).json({ "errorMessage": "No Id provided" })
        }

        let result = []
        let products = await Product.findAll({
            where: {
                fragranceId: req.params.id,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })
     
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        let orderIndexRes = await ProductsOrderIndex.findOne()
        orderIndexRes = orderIndexRes.productsOrderJson

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

const searchProducts = async (req, res) => {
    try {
        if (!req.query.q) {
            return res.status(500).json({ "errorMessage": "No Search Query Parameter Provided" })
        }

        let result = []
        let products = await Product.findAll({
            where: {
                $or: [
                    sequelize.where(sequelize.col('productName'), 'REGEXP', `${req.query.q.split(" ").join("|")}`),
                    sequelize.where(sequelize.col('productDescription'), 'REGEXP', `${req.query.q.split(" ").join("|")}`),
                    sequelize.where(sequelize.col('Hierarchy.hierarchyName'), 'REGEXP', `${req.query.q.split(" ").join("|")}`)
                ],
                isDeleted: false
            },
            include: [{
                model: Hierarchy,
                attributes: ["hierarchyName"]
            }],
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })
     
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        let orderIndexRes = await ProductsOrderIndex.findOne()
        orderIndexRes = orderIndexRes.productsOrderJson

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

const getAllProducts = async (req, res) => {
    try {

        let result = []
        let products = await Product.findAll({
            exclude: ["updatedAt", "isDeleted"],
            raw: true
        })
     
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        let orderIndexRes = await ProductsOrderIndex.findOne()
        orderIndexRes = orderIndexRes.productsOrderJson

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

const editProductAttributeColumn = async (req, res) => {
    try {

        let {productId, productAttributeId, columnName, flag} = req.body
     
        if (!productId || !productAttributeId || !columnName || (!["isActive", "bestSellerStatus", "isNew"].includes(columnName) ) || typeof flag != "boolean" ) {
            return res.status(500).json({ "errorMessage": "Missing Or Invalid Parameters" })
        }

        let product = await Product.findOne({
            where: {
                id: productId
            },
            attributes: ["id", "productDetails"],
            raw: true
        })

        if(!product){
            return res.status(500).json({ "errorMessage": "Invalid Product Id" })
        }

        let productAttributeFound = false
        let isTrueElementPresent = false

        product.productDetails.map((productDetailElement) => {
            if(productDetailElement.id == productAttributeId){
                productAttributeFound = true
                productDetailElement[columnName] = flag
            }
            if(productDetailElement[columnName]){
                isTrueElementPresent = true
            }
        });

        let obj = {
            productDetails: product.productDetails
        }

        obj[columnName] = isTrueElementPresent

        if(productAttributeFound){
            let updatedProduct = await Product.update(obj,{
                where: {
                    id: product.id
                }
            })
        }
       
        return res.status(200).json({ statusCode: 200, data: "success" })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

const saveOrderOfProducts = async (req, res) => {
    try {

        let { payload } = req.body
     
        if (!payload || typeof payload != "object" ) {
            return res.status(500).json({ "errorMessage": "Invalid Payload" })
        }

        // let finalResult = {}

        // let allProducts = await Product.findAll();

        // for(let productId in payload){

        //     let product = allProducts.find((p)=> p.id == productId)
        //     if(!product){
        //         continue
        //     }

        //     product.productDetails.map((productDetailElement) => {
        //         if(payload[productId][productDetailElement.id]){
        //             if(finalResult[productId]){
        //                 finalResult[productId][productDetailElement.id] = payload[productId][productDetailElement.id]
        //             }
        //             else{
        //                 finalResult[productId] = {}
        //                 finalResult[productId][productDetailElement.id] = payload[productId][productDetailElement.id]
        //             }
        //         }
        //         return productDetailElement
        //     });

        // }

        let productsOrderIndexes = await ProductsOrderIndex.findOne()
        if(!productsOrderIndexes){
            await ProductsOrderIndex.create({
                productsOrderJson: payload
            })
        }
        else{
            await ProductsOrderIndex.update({
                productsOrderJson: payload
            }, {where: {

            }})
        }
       
        return res.status(200).json({ statusCode: 200, data: "success" })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

module.exports = {
    getProductsByHierarchies,
    getProductsByMajorHierarchy,
    getProductDetails,
    getProductsInCart,
    getProductsByFragrance,
    searchProducts,
    getAllProducts,
    editProductAttributeColumn,
    saveOrderOfProducts
}

