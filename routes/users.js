var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/logout', userController.authLogout);

module.exports = router;
