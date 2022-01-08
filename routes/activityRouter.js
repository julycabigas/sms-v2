const router = require('express').Router();
const activityLogController = require('../controllers/activityLogController');
const { protect } = require('../middleware/auth')

router.get('/', protect, activityLogController.index);
router.get('/:refId', protect, activityLogController.get);

module.exports = router;