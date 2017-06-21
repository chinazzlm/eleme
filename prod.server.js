var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
  res.url = '/inex.html';
  next();
});

app.use(router);

// api
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;
router.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});
router.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});
router.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});
app.use('/api', router);

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});
