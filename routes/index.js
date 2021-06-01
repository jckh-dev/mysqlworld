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

router.get("/api/city/:CountryCode", function (req, res, next) {
  req.db.from('city')
    .select('*')
    .where('CountryCode', '=', req.params.CountryCode)
    .then((rows) => { res.json({ "Error": false, "Message": "Success", "Cities": rows }) })
    .catch((err) => {
      console.log(err); res.json({ "Error": true, "Message": "Error executing MySQL query" })
    })
});

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization
  let token = null

  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1]
    console.log("Token: ", token)
  } else {
    res.status(401).json({ error: true, message: err + " : Unauthorized" })
    return
  }

  // verify JWT and check exp date
  try {
    const decoded = jwt.verify(token, secretKey)

    if (decoded.exp < Date.now()) {
      res.status(401).json({ error: true, message: "token expired" })
      return
    }

    // permit user to advance
    next()
  } catch (e) {
    res.status(401).json({ error: true, message: err + " : Unauthorized" })
  }
}

router.post('/api/update', authorize, function (req, res) {
  if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
    res.status(400).json({ message: `Error updating population` });
  } else {
    const filter = {
      "Name": req.body.City,
      "CountryCode": req.body.CountryCode
    };
    const pop = {
      "Population": req.body.Pop
    }
    req.db
      .from('city')
      .where(filter)
      .update(pop)
      .then(_ => {
        res.status(201).json({ message: "Successful update " + req.body.City });
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ message: 'Database error - not updated' });
      })
  }
});
module.exports = router;
