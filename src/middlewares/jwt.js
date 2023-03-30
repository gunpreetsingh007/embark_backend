const { verify } = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    const accessToken = req.headers['authorization']
    if (!accessToken) return res.status(400).json({ "statusCode": 400, "errorMessage": 'Token is required' })
    else {
        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET)
            if (validToken) {
                req.currentUser = {
                    username: validToken.username,
                    id: validToken.id,
                    role: validToken.role
                }
                next()
            }
        }
        catch (error) {
            return res.status(400).json({ "statusCode": 400, "errorMessage": 'Invalid Authorization Token' })
        }
    }
}

module.exports = {
    validateToken
}