var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { protect } = require('../middleware/auth')

/* GET users listing. */
router.get('/', protect, userController.index);
router.get('/:userId', protect, userController.get);
router.put('/:userId', protect, userController.update);
router.delete('/:userId', protect, userController.deleteUser);

router.post('/login', userController.login);
router.post('/register', protect, userController.register);
router.post('/logout', userController.authLogout);
router.post('/profile', protect, userController.updateProfile);

module.exports = router;
