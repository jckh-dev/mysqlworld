var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'The world database API' });
});

router.get('/api', function (req, res, next) {
  res.render('index', { title: 'Lots of routes available' });
});

router.get("/api/city", function (req, res, next) {
  req.db.from('city')
    .select("name", "district")
    .then((rows) => { res.json({ "Error": false, "Message": "Success", "City": rows }) })
    .catch((err) => {
      console.log(err); res.json({ "Error": true, "Message": "Error in  MySQL query" })
    })
});

module.exports = router;
