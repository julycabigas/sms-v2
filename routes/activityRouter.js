const router = require('express').Router();
const activityLogController = require('../controllers/activityLogController');
const { protect } = require('../middleware/auth')

router.get('/', protect, activityLogController.index);

module.exports = router;