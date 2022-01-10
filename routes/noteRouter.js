const router = require('express').Router();
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/auth')

router.get('/:studentId', protect, noteController.index);
router.post('/:studentId', protect, noteController.store);

module.exports = router;