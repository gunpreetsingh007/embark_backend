const admin = async (req, res, next) => {
    if(req.currentUser && (req.currentUser.role == "admin" || req.currentUser.role == "superAdmin")){
        next()
    }
    else{
       return res.status(403).json({ "statusCode": 403, "errorMessage": 'Unauthorized' })
    }
}

module.exports = {
   admin
}