var Hierarchy = require('../database/models').Hierarchy;
var ProductAttributes = require('../database/models').ProductAttribute;
var Product = require("../database/models").Product
var Fragrance = require("../database/models").Fragrance

const addProduct = async (req, res) => {

    try {
        
        let newProduct = await Product.create(req.body);
        
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

const getAllFragrances = async (req,res) => {

    try {
        let allFragrances = await Fragrance.findAll({
            attributes: ["id","fragranceName","fragrancePictureUrl"],
            order: [["orderIndex"]],
            raw: true
        })
        
        return res.status(200).json({ statusCode: 200, data: allFragrances })
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
    chooseHierarchyInAddProduct,
    chooseProductAttribute,
    getAllFragrances
}

