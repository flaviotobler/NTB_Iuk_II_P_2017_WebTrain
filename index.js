//benötigte Module laden
const PW = require('./pw.js');
var express = require('express');
var app = express();
var request = require('request');
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;

var baseUrl = 'http://'+ PW.USERNAME +':'+ PW.PASSWORD +'@'+ PW.CAMERAIP +'';

app.use(express.static('public'));

app.post('/up', function (req, res) {
	console.log("Button Up pressed");
  	camAction("move=up");
    res.send('POST request to homepage');
});

app.post('/down', function (req, res) {
 	console.log("Button Down pressed");
 	camAction("move=down");
    res.send('POST request to homepage');
  
});

app.post('/left', function (req, res) {
 	console.log("Button Left pressed");
 	camAction("move=left");
    res.send('POST request to homepage');
  
});

app.post('/right', function (req, res) {
 	console.log("Button Right pressed");
 	camAction("move=right");
    
    res.send('POST request to homepage');
  
});

app.get('/test', function (req, res) {
    
    
    
    res.send("Position request");
  
});

/* app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
}); */

app.get('/video.mjpg', new MjpegProxy(baseUrl +'/mjpg/video.mjpg').proxyRequest);

app.listen(PW.PORT, function () {
  console.log('Example app listening on port 3000!');
});

function camAction(param){
    request(baseUrl +'/axis-cgi/com/ptz.cgi?' + param + '', function(error){
        	if(error){
			console.log('Error', error);
		}
	});
}

function getPosition(){
    var actPos = {};
    //asynchroner request
    request("http://root:IUK123@192.168.0.90/axis-cgi/com/ptz.cgi?query=position", function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if(response.statusCode == 200){   
        
        var temp1 = body.replace(/(?:\r\n|\r|\n)/g,'=');
        var spl = temp1.split('=');
        //console.log(spl);
        //gibt array gemäss folgendem array aus:  ['pan','121.8465','tilt','-2.1260','zoom','1','autofocus','on','autoiris','on','' ]
        actPos = {
            x: spl[1],
            y: spl[3],
            zoom: spl[5],
            af: spl[7],
            ai: spl[9]
        };
        console.log(actPos);
        
    }
        
    });
    
}