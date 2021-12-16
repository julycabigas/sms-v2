const jwt = require('jsonwebtoken')
const secret = 'bb5dc8842ca31d4603d6aa11448d1654';
const User = require('../models/User');

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

exports.decodeToken = (token) => {
  return jwt.verify(token, secret)
}

exports.checkToken = (token, cb) => {
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      cb(null)
    } else {
      cb(decoded)
    }
  });
}