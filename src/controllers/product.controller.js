var Hierarchy = require('../database/models').Hierarchy;
var Product = require("../database/models").Product
var ProductTag = require("../database/models").ProductTag
var Fragrance = require("../database/models").Fragrance
const sequelize = require("sequelize");
const Review = require('../database/models').Review;
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

        result = await splitProductsByAttribues(products)

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

        for (let i = 0; i < childHierarchies.length; i++) {
           hierarchyIds = [ ...hierarchyIds, ...await getChildHierarchiesIds(childHierarchies, i, [])]
        }

        hierarchyIds.push(selectedHierarchy.id)

        let result = []

        let products = await Product.findAll({
            where: {
                hierarchyId: hierarchyIds,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })

        result = await splitProductsByAttribues(products)

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

        let allReviews = await Review.findAll({
            where: {
                productId: req.params.id,
                isApproved: true
            },
            raw: true
        })
        let reviewMap = {}
        let reviewRatingMap = {}
        for(let review of allReviews){
            if(reviewMap[review.productAttributeId]){
                let existingArray = reviewMap[review.productAttributeId]
                existingArray.push({
                   rating: review.rating,
                   name: review.name,
                   email: review.email,
                   reviewTitle: review.reviewTitle,
                   reviewText: review.reviewText,
                   reviewPictures: review.reviewPictures,
                   createdAt: review.createdAt
                })
                reviewRatingMap[review.productAttributeId].push(review.rating)
            }
            else{
                reviewMap[review.productAttributeId] = [{
                   rating: review.rating,
                   name: review.name,
                   email: review.email,
                   reviewTitle: review.reviewTitle,
                   reviewText: review.reviewText,
                   reviewPictures: review.reviewPictures,
                   createdAt: review.createdAt
                }]
                reviewRatingMap[review.productAttributeId] = []
                reviewRatingMap[review.productAttributeId].push(review.rating)
            }           
        }

        product.productDetails.map(productDetailElement=>{
            if(reviewMap[productDetailElement.id]){
                productDetailElement.reviewsArray = reviewMap[productDetailElement.id]
                productDetailElement.rating = parseFloat((reviewRatingMap[productDetailElement.id].reduce((a,b)=> parseFloat(a) + parseFloat(b), 0) / reviewRatingMap[productDetailElement.id].length).toFixed(1))
            }
            else{
                productDetailElement.reviewsArray = []
                productDetailElement.rating = 0
            }
        })

        let searchTags = await ProductTag.findAll({
            where: {
                productId: product.id
            },
            attributes: ["searchTags"],
            raw: true
        })

        product["searchTags"] = searchTags.map(item => item.searchTags)

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

        result = await splitProductsByAttribues(products)

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

        let productsFromFirstQuery = await Product.findAll({
            where: {
                $or: [
                    sequelize.where(sequelize.col('productName'), 'LIKE', `%${req.query.q}%`),
                    //sequelize.where(sequelize.col('productDescription'), 'LIKE', `%${req.query.q}%`),
                    sequelize.where(sequelize.col('Hierarchy.hierarchyName'), 'LIKE', `%${req.query.q}%`)
                ],
                isDeleted: false
            },
            include: [{
                model: Hierarchy,
                attributes: ["hierarchyName"]
            }],
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
        })

        let productsFromSecondQuery = await ProductTag.findAll({
            where: {
                $or: [
                    sequelize.where(sequelize.col('searchTags'), 'LIKE', `%${req.query.q}%`),
                ],
                isDeleted: false
            },
            attributes: ["searchTags"],
            include: [{
                model: Product,
                exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
                include: [{
                    model: Hierarchy,
                    attributes: ["hierarchyName"]
                }]
            }]
        })

        let combinedProducts = [...productsFromFirstQuery, ...productsFromSecondQuery.map(item => item.Product)]

        combinedProducts = JSON.parse(JSON.stringify(combinedProducts))

        combinedProducts = combinedProducts.map(item => {
            item["Hierarchy.hierarchyName"] = item.Hierarchy.hierarchyName
            delete item.Hierarchy
            return item
        })

        let uniqueProducts = combinedProducts.filter(function({id}) {
            return !this.has(id) && this.add(id);
          }, new Set);
     
        if (uniqueProducts.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        result = await splitProductsByAttribuesSearch(uniqueProducts)

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

        result = await splitProductsByAttribues(products)

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

const bestSellerProducts = async (req, res) => {
    try {

        let result = []
        let products = await Product.findAll({
            where: {
                bestSellerStatus: true,
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

        let productIds = products.map(product=> product.id)
        let allReviews = await Review.findAll({
            where: {
                productId: productIds,
                isApproved: true
            },
            attributes: ["productId", "productAttributeId",[sequelize.literal('round(sum(`rating`) / count(*), 1)'), "rating"], [sequelize.literal(`count(*)`), "ratingCount"]],
            group: ["productId", "productAttributeId"],
            raw: true
        })
        let reviewMap = {}
        for(let review of allReviews){
            reviewMap[review.productAttributeId] = {rating: review.rating, ratingCount: review.ratingCount} 
        }
    
        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
                if(reviewMap[productDetailElement.id]){
                    productDetailElement.rating = parseFloat(reviewMap[productDetailElement.id].rating)
                    productDetailElement.ratingCount = reviewMap[productDetailElement.id].ratingCount
                }
                else{
                    productDetailElement.rating = 0
                    productDetailElement.ratingCount = 0
                }
                if(productDetailElement.bestSellerStatus){
                    result.push({
                        ...product,
                        productDetails: productDetailElement
                    });
                }
            });
        });
    
        result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

const addProductReview =  async (req, res) => {
    try {
        let payload = req.body;
        payload.isApproved = true
        let productReview = await Review.create(payload)
        return res.status(200).json({ "statusCode": 200, data: productReview })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const splitProductsByAttribues = async (products)=> {
    let productIds = products.map(product=> product.id)
    let allReviews = await Review.findAll({
        where: {
            productId: productIds,
            isApproved: true
        },
        attributes: ["productId", "productAttributeId",[sequelize.literal('round(sum(`rating`) / count(*), 1)'), "rating"], [sequelize.literal(`count(*)`), "ratingCount"]],
        group: ["productId", "productAttributeId"],
        raw: true
    })
    let reviewMap = {}
    for(let review of allReviews){
        reviewMap[review.productAttributeId] = {rating: review.rating, ratingCount: review.ratingCount} 
    }
    let result = []
    let orderIndexRes = await ProductsOrderIndex.findOne()
    orderIndexRes = orderIndexRes.productsOrderJson

    products.forEach((product) => {
        product.productDetails.forEach((productDetailElement) => {
            productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
            productDetailElement.orderIndex = orderIndexRes?.[product.id]?.[productDetailElement.id] || 0
            if(reviewMap[productDetailElement.id]){
                productDetailElement.rating = parseFloat(reviewMap[productDetailElement.id].rating)
                productDetailElement.ratingCount = reviewMap[productDetailElement.id].ratingCount
            }
            else{
                productDetailElement.rating = 0
                productDetailElement.ratingCount = 0
            }
            result.push({
                ...product,
                productDetails: productDetailElement
            });
        });
    });

    result.sort((a, b) => (a.productDetails.orderIndex - b.productDetails.orderIndex) || (b.createdAt - a.createdAt))
    return result
}

const splitProductsByAttribuesSearch = async (products)=> {
    let productIds = products.map(product=> product.id)
    let allReviews = await Review.findAll({
        where: {
            productId: productIds,
            isApproved: true
        },
        attributes: ["productId", "productAttributeId",[sequelize.literal('round(sum(`rating`) / count(*), 1)'), "rating"], [sequelize.literal(`count(*)`), "ratingCount"]],
        group: ["productId", "productAttributeId"],
        raw: true
    })
    let reviewMap = {}
    for(let review of allReviews){
        reviewMap[review.productAttributeId] = {rating: review.rating, ratingCount: review.ratingCount} 
    }
    let result = []
    products.forEach((product) => {
        product.productDetails.forEach((productDetailElement) => {
            productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
            if(reviewMap[productDetailElement.id]){
                productDetailElement.rating = parseFloat(reviewMap[productDetailElement.id].rating)
                productDetailElement.ratingCount = reviewMap[productDetailElement.id].ratingCount
            }
            else{
                productDetailElement.rating = 0
                productDetailElement.ratingCount = 0
            }
            result.push({
                ...product,
                productDetails: productDetailElement
            });
        });
    });

    return result
}

const updateProductHierarchy = async (req, res) => {
    try {
        let {productId, hierarchyId} = req.body;
        let product = await Product.find({
            where: {
                id: productId
            }
        })
        let hierarchy = await Hierarchy.find({
            where: {
                id: hierarchyId
            }
        })
        if(!product || !hierarchy){
            return res.status(500).json({ "errorMessage": "Invalid Payloads" })
        }
        let updatedProduct = await Product.update({
            hierarchyId
        },{
            where: {
                id: productId
            }
        })
        return res.status(200).json({ "statusCode": 200, data: "success" })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const updateProductGender = async (req, res) => {
    try {
        let {productId, gender} = req.body;
        let product = await Product.find({
            where: {
                id: productId
            }
        })
        if(!product || !["Men", "Women", "Unisex"].includes(gender)){
            return res.status(500).json({ "errorMessage": "Invalid Payloads" })
        }
        let updatedProduct = await Product.update({
            gender
        },{
            where: {
                id: productId
            }
        })
        return res.status(200).json({ "statusCode": 200, data: "success" })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getProductsByGender = async (req, res) => {
    try {
        let gender = req.params.gender;
        if(!["Men", "Women", "Unisex"].includes(gender)){
            return res.status(500).json({ "errorMessage": "Invalid Gender" })
        }
        let result = []
        let products = await Product.findAll({
            where: {
                gender,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId"],
            raw: true
        })
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        result = await splitProductsByAttribues(products)

        return res.status(200).json({ "statusCode": 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
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
    saveOrderOfProducts,
    bestSellerProducts,
    addProductReview,
    updateProductHierarchy,
    updateProductGender,
    getProductsByGender
}

