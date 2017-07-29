var spawn = require('child_process').spawn;
var args = process.argv.slice(2);

if(args.length == 0) {
  return;
}

var serial = args[0];
var chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
var launcherUrl = 'http://127.0.0.1:3000/?serial=' + serial;
var prc = spawn(chromePath,  ['--app=' + launcherUrl]);
prc.stdout.setEncoding('utf8');
prc.stdout.on('data', function (data) {
  var str = data.toString()
  var lines = str.split(/(\r?\n)/g);
  console.log(lines.join(""));
});
prc.on('close', function (code) {
  console.log('process exit code ' + code);
});
