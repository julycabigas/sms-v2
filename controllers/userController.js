const User = require('../models/User');
const { generateToken, checkToken } = require('../utils/token')

exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if( user && user.matchPassword(req.body.password)) {
      const access_token = generateToken({ id: user.id });
      res.cookie('access_token', access_token, {
        httpOnly: true, 
        signed: true,
        path: '/token',
      });
      res.send({ access_token, success: true })
    } else {
      res.send({ message: "Email or Password is incorrect!", success: false })
    }
  }
  catch(err) {
    next(err)
  }
}

exports.register = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.send({ message: "User's already exists.", success: false })
      return;
    }
    user = await User.create({ name, email, password });
    if (user) {
      res.send({ success: true })
    }
  }
  catch(err) {
    next(err)
  }
}

exports.authLogout = (req, res) => {
  res.cookie('access_token', '', { path: '/token', maxAge: 0 });
  res.json({ success: true });
};

exports.authToken = (req, res, next) => {
  try {
    const { access_token } = req.signedCookies;
    checkToken(access_token, (isValid) => {
      if (!isValid) {
        res.send(isValid);
      } else {
        res.send(isValid);
      }
    });
  }
  catch(err) {
    next(err)
  }
}