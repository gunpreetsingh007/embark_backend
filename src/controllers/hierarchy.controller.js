var Hierarchy = require('../database/models').Hierarchy;


const getMajorCategories = async (req, res) => {
    try {
        let majorCategories = await Hierarchy.findAll({
            where: {
                parentId: null,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"]
        })
        return res.status(200).json({ "statusCode": 200, data: majorCategories })
    }
    catch (err) {
        return res.status(500).json({ "errorMessage": "Something Went Wrong" })
    }
}

const getHierarchyTreeByRootName = async (req, res) => {
    try {
        if (!req.params.name) {
            return res.status(500).json({ "errorMessage": "No Name provided" })
        }
        let selectedHierarchy = await Hierarchy.findOne({
            where: {
                hierarchyName: req.params.name,
                parentId: null,
                isDeleted: false
            },
            attributes: ["id", "hierarchyName"],
            raw: true
        })
        if (!selectedHierarchy) {
            return res.status(500).json({ "errorMessage": "Wrong Name provided" })
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
    hierarchyArray[index].child = hierarchies
    for (let i = 0; i < hierarchyArray[index].child.length; i++) {
        await getChildHierarchies(hierarchyArray[index].child, i)
    }

}



module.exports = {
    getMajorCategories,
    getHierarchyTreeByRootName
}

