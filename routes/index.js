var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Authy OneCode and Phone Verification Automated Testing Framework' });
});

module.exports = router;
