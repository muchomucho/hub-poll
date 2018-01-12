var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var ioclient = require('socket.io-client');

var tags_right = [];
var tags_left = [];
var act_question = "oui ou non ?";

function write_score_to_file(left, right)
{
  fs.writeFile(__dirname + "/save.json", {"left": JSON.stringify(left), "right": JSON.stringify(right)}, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
}

function read_score_from_file()
{
  fs.readFile(__dirname + '/save.json', function (err, data) {
    if (err) {
      return console.log('Error loading');
    }

    if (data && data != "") {
      try {
        var ret = JSON.parse(data);
        if (ret && ret.left && ret.right){
          tags_right = ret.right;
          tags_left = ret.left;
        }
        else {
          console.log("json object invalid");
        }
      } catch (e) {
        console.log("file not a json file");
      }
    }
  });
}

read_score_from_file();

/*
** server connect to dashboard
*/
var dash = ioclient.connect("http://hub-control.chang.ovh");

/*
** Web server confug (port : 8888)
*/
app.listen(8888);
console.log("Serveur web so hitek lancé ... #guiguituto&cie");

function handler (req, res) {
  var uri = req.url.split('?');

  if (uri[0] == "/gauche") {
    //request to register a tag
    var tag = uri[1].split("=")[2];
    /*
    ** if tag not registered, add tag
    */
    console.log("tag left: " + tag);
    if (tags_right.indexOf(tag) < 0 && tags_left.indexOf(tag) < 0) {
      console.log("add tag left");
      tags_left.push(tag);
      write_score_to_file(tags_left, tags_right);
      io.emit("left", tags_left.length);
      dash.emit("get_form", [tags_left.length, tags_right.length]);
    }
    res.writeHead(200);
    res.end("");
  }
  else if (uri[0] == "/droite") {
    //request to register a tag
    var tag = uri[1].split("=")[2];
    /*
    ** if tag not registered, add tag
    */
    console.log("tag right : " + tag);
    if (tags_right.indexOf(tag) < 0 && tags_left.indexOf(tag) < 0) {
      console.log("add tag right");
      tags_right.push(tag);
      write_score_to_file(tags_left, tags_right);
      io.emit("right", tags_right.length);
      dash.emit("get_form", [tags_left.length, tags_right.length]);
    }
    res.writeHead(200);
    res.end("");
  }
  else {
    //webserver
    fs.readFile(__dirname + '/html/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
  }
}

/*
** On client connexion, this callback is trigered
*/

dash.on("get_form", function() {
	console.log("sending stats to dashboard");
	dash.emit("get_form", [tags_left.length, tags_right.length]);
});

dash.on("set_question", function(question) {
	console.log("setting question from dashboard");
	act_question = question;
	io.emit("get_question", question);
});

dash.on("get_question", function() {
	console.log("sending question to dashboard");
  dash.emit("get_question", act_question);
})

dash.on("reset_score", function(){
  tags_left = [];
  tags_right = [];
  //write on file
  write_score_to_file(tags_left, tags_right);
  io.emit("left", tags_left.length);
  io.emit("right", tags_right.length);  
});

io.on('connection', function (socket) {
  io.emit("left", tags_left.length);
  io.emit("right", tags_right.length);
  io.emit("get_question", act_question);
});
