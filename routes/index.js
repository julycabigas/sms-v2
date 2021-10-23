var express = require('express');
var router = express.Router();
const studentControlle = require('../controllers/studentController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/student-pdf/:studentId', studentControlle.streamPdf);

module.exports = router;
