var nfc  = require('nfc').nfc
  , util = require('util')
  , version = nfc.version()
  , devices = nfc.scan()
  ;

var http = require('http'),
fs       = require('fs');
  

console.log('version: ' + util.inspect(version, { depth: null }));
console.log('devices: ' + util.inspect(devices, { depth: null }));

function read(deviceID) {
  console.log('');
  var nfcdev = new nfc.NFC();

  nfcdev.on('read', function(tag) {
        console.log("DATTAAAA");
        console.log(deviceID);
        console.log(tag.uid);
        nfcdev.stop();
  });

  nfcdev.on('error', function(err) {
    console.log(util.inspect(err, { depth: null }));
  });

  nfcdev.on('stopped', function() {
    console.log('stopped');
    read(deviceID);
  });

  console.log(nfcdev.start(deviceID));
}

for (var deviceID in devices) read(deviceID);

var server = http.createServer(function(req, res) {
  fs.readFile('html/index.html', function(err, data) {
    if (err) {
      res.writeHead(500);
    }
    else {
      res.writeHead(200, { 'Content-Type': 'text/html'});
      res.end(data);
    }
  });
});

server.listen(80);
console.log("Serveur web so hitek lancé ... #guiguituto&cie");