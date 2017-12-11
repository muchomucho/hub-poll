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
        data = []
        data.left = false;
        data.right = false;
        if (deviceName == "")
        {
            deviceName = deviceID;
        }
        else if (deviceName == deviceID)
        { // Left
          data.left = true;
          console.log("gauche");
        }
        else
        { // Right
          data.right = true;
          console.log("droite");
        }
        /*console.log("DATTAAAA");
        console.log(deviceID);
        console.log(tag.uid);*/
        io.emit('selected', data)
        nfcdev.stop();
  });

  nfcdev.on('error', function(err) {
    console.log(util.inspect(err, { depth: null }));
  });

  nfcdev.on('stopped', function() {
    console.log('stopped');
    read(deviceID);
  });

  try {
    console.log(nfcdev.start(deviceID));
  } catch (e) {
    read(deviceID);
  }
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