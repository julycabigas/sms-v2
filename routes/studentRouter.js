const router = require('express').Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/auth')

router.post('/', protect, studentController.store);
router.get('/', protect, studentController.index);
router.get('/:studentId', protect, studentController.get);
router.put('/:studentId', protect, studentController.update);

router.get('/:studentId/deposit', protect, studentController.getDeposits);
router.post('/:studentId/deposit', protect, studentController.addDeposit);
router.put('/:studentId/deposit', protect, studentController.updateDeposit);
router.delete('/:studentId/deposit/:depositId', protect, studentController.deleteDeposit);

router.get('/:studentId/payment_list', protect, studentController.getPaymentList);
router.post('/:studentId/payment_list', protect, studentController.addPaymentList);
router.put('/:studentId/payment_list/:paymentListId', protect, studentController.updatePaymentList);

router.get('/payment/all-payment-dues', protect, studentController.allPaymentDues);
module.exports = router;