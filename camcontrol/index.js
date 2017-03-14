
var express = require('express');
var app = express();
var request = require('request');

app.post('/up', function (req, res) {
	console.log("Button Up pressed");
	  request('http://192.168.0.90/axis-cgi/com/ptz.cgi?move=up', function(error){
			console.log('Error', error);
	});
});

app.post('/down', function (req, res) {
	 console.log("Button Down pressed");
	 request('http://192.168.0.90/axis-cgi/com/ptz.cgi?move=down', function(error){
			console.log('Error', error);
	});
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
