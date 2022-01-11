const User = require('../models/User');
const { generateToken, checkToken } = require('../utils/token')
const fs = require('fs');
const { uploadImageBase64 } = require('../utils/fs');

exports.index = async (req, res, next) => {
  try {
    const match = { 
      _id: { $ne: req.user.id },
      email: { $ne: 'contact@ecomwarrioracademy.com' },
    };
    const options = { 
      page: req.query.page || 1, 
      limit: process.env.LIMIT,
    };
    const users = await User.paginate(match, options);
    res.send(users);
  } catch(err) {
    next(err);
  }
}

exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.send(user);
  }
  catch(err) {
    next(err);
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (user) {
      res.send({ success: true });
    }
    
  }
  catch(err) {
    next(err);
  }
}

exports.update = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.body.photoBase64) {
      payload['photo'] = uploadImageBase64(req.body.photoBase64, 'users');
    }
    delete payload.photoBase64;
    let user = await User.findByIdAndUpdate(req.params.userId, payload);
    user = await User.findById(req.params.userId);
    res.send({ user, success: true });
  }
  catch(err) {
    next(err);
  }
}
 ``
exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if( user && user.matchPassword(req.body.password)) {
      const access_token = generateToken({ id: user._id });
      res.cookie('access_token', access_token, {
        httpOnly: true, 
        signed: true,
        path: '/token',
      });
      res.send({ access_token, user, success: true });
    } else {
      res.send({ message: "Email or Password is incorrect!", success: false })
    }
  }
  catch(err) {
    next(err)
  }
}

exports.register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({ message: "User's already exists.", success: false })
      return;
    }
    const name = `${req.body.first_name} ${req.body.last_name}`;
    const payload = { ...req.body, name };
    if (req.body.photo) {
      payload['photo'] = uploadImageBase64(req.body.photo, 'users');
    }
    user = await User.create(payload);
    delete user.password;
    if (user) {
      res.send({ success: true, user });
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
    checkToken(access_token, async (payload) => {
      if (!payload) {
        res.send(null);
      } else {
        const user = await User.findById(payload.id);
        res.send({ access_token, user });
      }
    });
  }
  catch(err) {
    next(err)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const payload = { ...req.body }; 
    if (req.body.photoBase64) {
      payload['photo'] = uploadImageBase64(req.body.photoBase64, 'users');
      delete payload.photoBase64;
    }
    let profile = await User.findByIdAndUpdate(req.user.id, { ...payload });
    profile = await User.findById(req.user.id);
    delete profile.password;
    res.send({ profile, success: true });
  }
  catch(err) {
    next(err);
  }
}