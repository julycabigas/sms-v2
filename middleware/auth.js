const { checkToken, decodeToken } = require('../utils/token')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization && 
                req.headers.authorization.startsWith('Bearer') && 
                req.headers.authorization.split(' ')[1]
  checkToken(token, async (validToken) => {
    if (validToken) {
      const decoded = decodeToken(validToken)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } else {
      res.status(401)
      next({ message:  '401 Unauthorized' })
    }
  })
}