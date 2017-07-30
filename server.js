const detail = require('./detail');

var express = require('express');
var app = express();
app.set('view engine', 'hbs');
app.set('views', './views') // specify the views directory

app.get('/', function (req, res) {
  var serial = req.query['serial'];
  var p = detail.createPromise(serial);
  p.then(function (data) {
    var ids_line = '';
    for(var i = 0 ; i < data.ids.length ; i++) {
      ids_line += data.ids[i];
      ids_line += ',';
    }
    data['ids_line'] = ids_line;
    res.render('launcher', data);
  });
});

var port = 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});
