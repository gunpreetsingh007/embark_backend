var Hierarchy = require('../database/models').Hierarchy;
var Product = require("../database/models").Product
const sequelize = require("sequelize")


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
                isActive: true,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
            raw: true
        })

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

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
                isActive: true,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
            raw: true
        })

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

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
                isActive: true,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
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
                isActive: true,
                isDeleted: false
            },
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
            raw: true
        })
     
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

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
                    sequelize.where(sequelize.col('productName'), 'LIKE', `%${req.query.q}%`),
                    sequelize.where(sequelize.col('Hierarchy.hierarchyName'), 'LIKE', `%${req.query.q}%`)
                ],
                isActive: true,
                isDeleted: false
            },
            include: [{
                model: Hierarchy,
                attributes: ["hierarchyName"]
            }],
            exclude: ["createdAt", "updatedAt", "isDeleted","hierarchyId","isActive"],
            raw: true
        })
     
        if (products.length == 0) {
            return res.status(200).json({ statusCode: 200, data: [] })
        }

        products.forEach((product) => {
            product.productDetails.forEach((productDetailElement) => {
                productDetailElement.attributeNumericValue = parseInt(Object.values(productDetailElement.attributeCombination)[0]?.match(/(\d+)/) || "0")
                result.push({
                    ...product,
                    productDetails: productDetailElement
                });
            });
        });

        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "errorMessage": "Something went wrong" })
    }
}

module.exports = {
    getProductsByHierarchies,
    getProductsByMajorHierarchy,
    getProductDetails,
    getProductsInCart,
    getProductsByFragrance,
    searchProducts
}

