const { verify } = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    const accessToken = req.headers['authorization']
    if (!accessToken) return res.status(401).json({ "statusCode": 401, "errorMessage": 'Sign In required' })
    else {
        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET)
            if (validToken) {
                req.currentUser = {
                    id: validToken.id,
                    role: validToken.role
                }
                next()
            }
        }
        catch (error) {
            return res.status(401).json({ "statusCode": 401, "errorMessage": 'Please sign in again' })
        }
    }
}

module.exports = {
    validateToken
}