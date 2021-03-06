var http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
  if(cnt == '\'0\'' || cnt == '\'\'') {
    return false;
  }
  return true;
}

function getProgramInfo(doc) {
  var title = '';
  var titleElem = doc.querySelector('.tit');
  if(!titleElem) {
    title = "";
  } else if(titleElem.textContent) {
    title = titleElem.textContent;
  } else {
    title = titleElem.children[0].getAttribute('alt');
  }

  return {
    'title': title
  };
}

function createProgramInfoPromise(serial) {
  return new Promise(function(resolve, reject) {
    var url = 'http://www.aniplustv.com/tv/program_view.asp?contentSerial=' + serial;
    http.get(url, function (response) {
      //console.log("Got response: " + res.statusCode);
      var body = '';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('end', function() {
        const dom = new JSDOM(body);
        var doc = dom.window.document;
        var info = getProgramInfo(doc);
        resolve(info);
      });
    }).on('error', function (e) {
      reject(e);
    });
  });
}

function createVideoInfoPromise(serial) {
  return new Promise(function(resolve, reject) {
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
        var data = {
          serial: serial,
          ids: ids,
          video_count: ids.length,
          supported: supported,
        };
        resolve(data);
      });
    }).on('error', function (e) {
      reject(e);
    });
  });
}

function createPromise(serial) {
  return new Promise(function(resolve, reject) {
    var p1 = createProgramInfoPromise(serial);
    var p2 = createVideoInfoPromise(serial);
    Promise.all([p1, p2]).then(function(values) {
      var data = {};
      for(var i = 0 ; i < values.length ; i++) {
        data = Object.assign(data, values[i]);
      }
      resolve(data);
    });
  })
}

module.exports = {
  createPromise: createPromise
};

var args = process.argv.slice(2);
if(args.length == 0) {
  return;
}
var serial = args[0];
var p = createPromise(serial);
p.then(function(val) {
  console.log(val); 
});