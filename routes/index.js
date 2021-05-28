var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'The world database API' });
});

router.get('/api', function (req, res, next) {
  res.render('index', { title: 'Lots of routes available' });
});

module.exports = router;
