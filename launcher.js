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

function isDownloadSupported(doc) {
  var line = doc.querySelector('.rbtn').children[1].getAttribute('href');
  // example
  // javascript:goDownPay('1251', 'False', '0');
  // javascript:goDownPay('1251', 'False', '123');
  var t = line.replace('javascript:goDownPay(', '').replace(');', '');
  var tokens = t.split(',');
  for(var i = 0 ; i < tokens.length ; i++) {
    tokens[i] = tokens[i].trim();
  }
  var cnt = tokens[2];
  if(cnt == '\'0\'') {
    return false;
  }
  return true;
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
      var doc = dom.window.document;
      var ids = getVideoIds(doc);
      var supported = isDownloadSupported(doc);
      res.render('launcher', {
        serial: serial,
        ids: ids,
        supported: supported,
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
