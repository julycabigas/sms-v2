const { checkToken, decodeToken } = require('../utils/token')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization && 
                req.headers.authorization.startsWith('Bearer') && 
                req.headers.authorization.split(' ')[1]
  checkToken(token, async (decoded) => {
    if (decoded) {
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } else {
      res.sendStatus(401)
    }
  })
}