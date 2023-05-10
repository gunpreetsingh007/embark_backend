var Hierarchy = require('../database/models').Hierarchy;
var ProductAttributes = require('../database/models').ProductAttribute;
var Product = require("../database/models").Product
var ProductTag = require("../database/models").ProductTag

const addProduct = async (req, res) => {

    try {
        
        let newProduct = await Product.create(req.body, {returning: true}).then(JSON.stringify).then(JSON.parse)
        let searchTagsPayload = req.body.searchTags.map(item => {
            return {
                searchTags: item,
                productId: newProduct.id
            }
        })

        await ProductTag.destroy({
            where: {
                productId: newProduct.id
            }
        })

        await ProductTag.bulkCreate(searchTagsPayload)
        
        return res.status(200).json({ statusCode: 200, data: newProduct })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}

const updateProduct = async (req, res) => {

    try {

        let id = req.body.id
        delete req.body.id
        
        let newProduct = await Product.update(req.body, {
            where: {
                id
            }
        });
        let searchTagsPayload = req.body.searchTags.map(item => {
            return {
                searchTags: item,
                productId: id
            }
        })

        await ProductTag.destroy({
            where: {
                productId: id
            }
        })

        await ProductTag.bulkCreate(searchTagsPayload)

        return res.status(200).json({ statusCode: 200, data: newProduct })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}

const chooseHierarchyInAddProduct = async (req, res) => {

    try {
        let topLevelHierarchy = await Hierarchy.findAll({
            where: {
                parentId: null,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        
        let result = await getChildHierarchiesName(topLevelHierarchy, null)
        
        return res.status(200).json({ statusCode: 200, data: result })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}

const chooseProductAttribute = async (req,res) => {

    try {
        let allProductAttributes = await ProductAttributes.findAll({
            where: {
              isDeleted: false
            },
            attributes: ["id","attributeName"],
            raw: true
        })
        
        return res.status(200).json({ statusCode: 200, data: allProductAttributes })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}

const getChildHierarchiesName = async (hierarchies, path=null) => {
    let result = []

    for(let i=0; i< hierarchies.length; i++){  
        const p = path ? path + " > " + hierarchies[i].hierarchyName : hierarchies[i].hierarchyName;    
        let childHierarchies = await Hierarchy.findAll({
            where: {
                parentId: hierarchies[i].id,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        if(!childHierarchies.length){
            result.push({
                label: p,
                value: hierarchies[i].id
            })
        }
        else{
            result = [...result, ...await getChildHierarchiesName(childHierarchies,p)]
        }
    }

    return result

}



module.exports = {
    addProduct,
    updateProduct,
    chooseHierarchyInAddProduct,
    chooseProductAttribute
}

