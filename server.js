const detail = require('./detail');

var express = require('express');
var app = express();
app.set('view engine', 'hbs');
app.set('views', './views') // specify the views directory

app.get('/', function (req, res) {
  var serial = req.query['serial'];
  var p = detail.createPromise(serial);
  p.then(function (data) {
    res.render('launcher', data);
  });
});

var port = 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});
