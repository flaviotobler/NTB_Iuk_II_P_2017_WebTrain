//benötigte Module laden
/*pw.js einbinden, in diesem File sind passwort und ip adresse der Netzwerkkamera hinterlegt
zusätzlich auch der PORT für den server*/
const PW = require('./pw.js');

/*verwendete module werden eingebunden*/
var express = require('express');
var app = express();
var request = require('request');
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;

/*über das hinterlegte passwort und die IP Adresse wird die Url um der Kamera Befehle zu schicken gebildet */
var baseUrl = 'http://'+ PW.USERNAME +':'+ PW.PASSWORD +'@'+ PW.CAMERAIP +'';

/*dateien im Ordner 'public' werden als statische web dateien zur verfügung gestellt
public/ ist das root verzeichnis für die webseite, bei aufruf des nodejs servers über
einen Browser wird public/index.html angezeigt	*/
app.use(express.static('public'));

/* http POST request werden vom node.js server verarbeitet in den flgenden express funktionen
wenn ein POST request die jeweilige URL ausgeführt wird, z.B. http://URLNODEJS/up wird die dazugehörige Funktion in app.post('/up, function(){} ausgeführt  */
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
