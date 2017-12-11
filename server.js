var nfc  = require('nfc').nfc
  , util = require('util')
  , version = nfc.version()
  , devices = nfc.scan()
  ;

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var deviceName = "";

console.log('version: ' + util.inspect(version, { depth: null }));
console.log('devices: ' + util.inspect(devices, { depth: null }));

function read(deviceID) {
  console.log('');
  var nfcdev = new nfc.NFC();

  nfcdev.on('read', function(tag) {
        if (deviceName == "")
        {
            deviceName = deviceID;
        }
        else if (deviceName == deviceID)
        {
          //gauche
          console.log("gauche");
        }
        else
        {
          console.log("droite");
          //droite
        }
        /*console.log("DATTAAAA");
        console.log(deviceID);
        console.log(tag.uid);*/
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

app.listen(80);
console.log("Serveur web so hitek lancé ... #guiguituto&cie");

function handler (req, res) {
  fs.readFile(__dirname + '/html/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {

});