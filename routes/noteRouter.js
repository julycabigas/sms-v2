const router = require('express').Router();
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/auth')

router.get('/:studentId', protect, noteController.index);
router.post('/:studentId', protect, noteController.store);
router.get('/:noteId/details', protect, noteController.get);
router.put('/:noteId', protect, noteController.update);
router.delete('/:noteId', protect, noteController.deleteNote);

module.exports = router;