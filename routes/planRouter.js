const router = require('express').Router();
const planController = require('../controllers/planController');
const { protect } = require('../middleware/auth')

router.get('/', protect, planController.index);
router.get('/all', protect, planController.all);
router.get('/:planId', protect, planController.get);
router.post('/', protect, planController.create);
router.post('/:id', protect, planController.edit);

module.exports = router;