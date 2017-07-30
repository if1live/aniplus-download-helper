var http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function getQueryArguments(url) {
  var qs = url.split('?')[1];
  var tokens = qs.replace('?', '').split('&');
  var kvs = {};
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var kv = token.split('=');
    kvs[kv[0]] = kv[1];
  }
  return kvs;
}

function findResult(doc) {
  var results = [];
  var divs = doc.querySelectorAll('.bx_popani');
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];
    var title = div.querySelector('.name').textContent;

    var href = div.querySelector('a').getAttribute('href');
    href = href.replace('#', '');
    var kvs = getQueryArguments(href);
    var serial = kvs.contentSerial;
    results.push({ title: title, serial: parseInt(serial, 10) });
  }
  return results;
}

function search(keyword) {
  var url = 'http://www.aniplustv.com/search/searchList.asp?gubun=A&strFind=' + encodeURI(keyword);
  http.get(url, function (response) {
    //console.log("Got response: " + res.statusCode);
    var body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      const dom = new JSDOM(body);
      var doc = dom.window.document;
      var results = findResult(doc);
      // https://stackoverflow.com/a/1129270/3553314
      function compare(a, b) {
        if (a.serial < b.serial)
          return -1;
        if (a.serial > b.serial)
          return 1;
        return 0;
      }
      results.sort(compare);

      console.log(`search keyword [${keyword}]`);
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        console.log(`${r.serial}\t${r.title}`);
      }
    });
  }).on('error', function (e) {
    console.error(e);
  });
}


var args = process.argv.slice(2);
if(args.length == 0) {
  return;
}
for(var i = 0 ; i < args.length ; i++) {
  search(args[i]);
}