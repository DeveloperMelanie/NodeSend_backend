import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (authHeader) {
        // Get token from header
        const token = authHeader.split(' ')[1]

        try {
            // Verify token
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user
        } catch (error) {
            return res.status(401).json({
                msg: 'El token no es válido',
            })
        }
    }

    return next()
}
