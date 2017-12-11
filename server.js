var nfc  = require('nfc').nfc
  , util = require('util')
  , version = nfc.version()
  , devices = nfc.scan()
  ;

console.log('version: ' + util.inspect(version, { depth: null }));
console.log('devices: ' + util.inspect(devices, { depth: null }));

function read(deviceID) {
  console.log('');
  var nfcdev = new nfc.NFC();

  nfcdev.on('read', function(tag) {
        console.log("DATTAAAA");
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
