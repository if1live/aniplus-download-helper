var http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var express = require('express');
var app = express();
app.set('view engine', 'hbs');
app.set('views', './views') // specify the views directory

function getVideoIds(doc) {
  var ids = [];
  var elems = doc.getElementsByClassName('chkEa');
  for(var i = 0 ; i < elems.length ; i++) {
      var el = elems[i];
      ids.push(el.getAttribute('value'));
  }
  return ids;
}


app.get('/', function (req, res) {
  //res.send('Hello World!');
  var serial = req.query['serial'];
  var url = "http://www.aniplustv.com/tv/vod_downList.asp?contentSerial=" + serial;
  http.get(url, function (response) {
    //console.log("Got response: " + res.statusCode);
    var body = '';
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      const dom = new JSDOM(body);
      var ids = getVideoIds(dom.window.document);
      res.render('launcher', {
        serial: serial,
        ids: ids
      });
    });
  }).on('error', function (e) {
    res.send("Got error: " + e.message);
  });
});

var port = 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});
