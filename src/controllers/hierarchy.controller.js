var Hierarchy = require('../database/models').Hierarchy;
var Fragrance = require('../database/models').Fragrance;

const getMajorCategories = async (req, res) => {
    try {
        let majorCategories = await Hierarchy.findAll({
            where: {
                parentId: null,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        return res.status(200).json({ "statusCode": 200, data: majorCategories })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getHierarchyTreeById = async (req, res) => {
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
        let childHierarchies = await Hierarchy.findAll({
            where: {
                parentId: selectedHierarchy.id,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        if (childHierarchies.length == 0) {
            return res.status(500).json({ "errorMessage": "No Child Hierarchies found" })
        }
        for (let i = 0; i < childHierarchies.length; i++) {
            await getChildHierarchies(childHierarchies, i)
        }

        return res.status(200).json({ statusCode: 200, data: childHierarchies })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}

const getChildHierarchies = async (hierarchyArray, index) => {

    let hierarchies = await Hierarchy.findAll({
        where: {
            parentId: hierarchyArray[index].id,
            isDeleted: false
        },
        attributes: ["id", "hierarchyName"],
        raw: true
    })
    hierarchyArray[index].children = hierarchies
    hierarchyArray[index].key = hierarchyArray[index].id
    hierarchyArray[index].label = hierarchyArray[index].hierarchyName
    hierarchyArray[index].title = hierarchyArray[index].hierarchyName
    for (let i = 0; i < hierarchyArray[index].children.length; i++) {
        await getChildHierarchies(hierarchyArray[index].children, i)
    }

}

const getHierarchyDetailsById = async (req,res) => {

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

        return res.status(200).json({ statusCode: 200, data: selectedHierarchy })
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
        console.log(err)
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }

}



module.exports = {
    getMajorCategories,
    getHierarchyTreeById,
    getHierarchyDetailsById,
    getAllFragrances
}

